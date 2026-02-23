
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session

import re
import hashlib
import json
import csv
import xml.etree.ElementTree as ET
from dateutil import parser as date_parser

from app.core.database import SessionLocal
from app.models.lookup import UploadStatus, Environment
from app.models.logs import LogEntry
from app.models.audit import FileProcessingLog
from app.models.files import RawFile
from app.services.storage_service import download_file_from_supabase


FIELD_ALIASES = {
    "timestamp": ["timestamp", "time", "ts", "@timestamp", "date"],
    "severity": ["severity", "level", "loglevel", "priority"],
    "environment": ["env", "environment", "stage"],
    "host": ["host", "hostname", "node"],
    "service": ["service", "app", "application", "component"],
    "message": ["message", "msg", "log", "text"]
}

SEVERITIES = ["DEBUG", "INFO", "WARN", "WARNING", "ERROR", "FATAL", "CRITICAL"]

def get_status_id_by_code(db: Session, code: str) -> int:
    status = (
        db.query(UploadStatus)
        .filter(UploadStatus.status_code == code)
        .first()
    )
    if not status:
        raise HTTPException(
            status_code=500,
            detail=f"Upload status '{code}' not found"
        )
    return status.status_id


def map_environment(db: Session, env_code: str | None) -> int | None:
    if not env_code:
        return None

    env = (
        db.query(Environment)
        .filter(Environment.environment_code == env_code.upper())
        .first()
    )
    return env.environment_id if env else None


def map_severity(severity: str | None) -> int:
    if not severity:
        return 2  # INFO

    return {
        "DEBUG": 1,
        "INFO": 2,
        "WARN": 3,
        "WARNING": 3,
        "ERROR": 4,
        "FATAL": 5,
        "CRITICAL": 5
    }.get(severity.upper(), 2)

def classify_category(message: str, service: str | None = None) -> int:
    text = f"{message} {service or ''}".lower()

    if any(k in text for k in ["auth", "login", "token", "unauthorized"]):
        return 2  # SECURITY
    if any(k in text for k in ["cpu", "disk", "memory", "node", "container","infra"]):
        return 3  # INFRASTRUCTURE
    if any(k in text for k in ["audit", "policy", "permission", "role"]):
        return 4  # AUDIT
    return 1  # APPLICATION

def fingerprint(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def normalize_fields(raw: dict) -> dict:
    raw = {k.lower(): str(v) for k, v in raw.items()}
    normalized = {}

    for canonical, aliases in FIELD_ALIASES.items():
        for a in aliases:
            if a in raw:
                normalized[canonical] = raw[a]
                break
    return normalized


def parse_timestamp(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return date_parser.parse(value)
    except Exception:
        return None


def infer_severity(text: str) -> str:
    for s in SEVERITIES:
        if s in text.upper():
            return s
    return "INFO"


def infer_message(text: str) -> str:
    clean = text
    for s in SEVERITIES:
        clean = re.sub(rf"\b{s}\b", "", clean, flags=re.I)
    clean = re.sub(r"\[.*?\]|\(.*?\)", "", clean)
    return clean.strip()



def extract_kv_from_text(line: str) -> dict:
    pattern = re.compile(
        r"(?P<key>[a-zA-Z_@]+)\s*[:=]\s*"
        r"(?P<value>\".*?\"|\'.*?\'|\[.*?\]|\(.*?\)|[^\s]+)"
    )

    result = {}
    for m in pattern.finditer(line):
        result[m.group("key")] = m.group("value").strip("[]()\"'")
    return result



def parse_record(record: dict | str) -> dict | None:

    # =========================
    # 🔹 TEXT LOGS
    # =========================
    if isinstance(record, str):

        line = record.strip()
        if not line:
            return None

        # 🔹 1️⃣ Extract timestamp from beginning (first token that parses)
        parts = line.split()

        timestamp = None
        timestamp_str = None

        for i in range(min(3, len(parts))):  
            # Try first few tokens combined
            candidate = " ".join(parts[:i+1])
            try:
                timestamp = date_parser.parse(candidate)
                timestamp_str = candidate
                break
            except Exception:
                continue

        if not timestamp:
            return None

        # Remove timestamp portion from line
        remaining = line[len(timestamp_str):].strip()

        # 🔹 2️⃣ Extract severity
        severity = None
        for s in SEVERITIES:
            if remaining.upper().startswith(s):
                severity = s
                remaining = remaining[len(s):].strip()
                break

        if not severity:
            severity = infer_severity(line)

        # 🔹 3️⃣ Extract key=value pairs
        kv_fields = extract_kv_from_text(remaining)
        fields = normalize_fields(kv_fields)

        host = fields.get("host")
        service = fields.get("service")
        environment = fields.get("environment")

        # 🔹 4️⃣ Remove key=value parts from message
        message = re.sub(
            r"[a-zA-Z_@]+\s*[:=]\s*(\".*?\"|\'.*?\'|\[.*?\]|\(.*?\)|[^\s]+)",
            "",
            remaining
        ).strip()

        if not message:
            message = infer_message(remaining)

        return {
            "timestamp": timestamp,
            "severity": severity,
            "environment": environment,
            "host": host,
            "service": service,
            "message": message,
            "raw": line
        }

    # =========================
    # 🔹 STRUCTURED LOGS
    # =========================
    fields = normalize_fields(record)

    ts = parse_timestamp(fields.get("timestamp"))
    msg = fields.get("message")

    if not ts or not msg:
        return None

    return {
        "timestamp": ts,
        "severity": fields.get("severity", "INFO"),
        "environment": fields.get("environment"),
        "host": fields.get("host"),
        "service": fields.get("service"),
        "message": msg,
        "raw": json.dumps(record)
    }


def parse_text(content: bytes):
    return content.decode("utf-8", errors="ignore").splitlines()


def parse_json(content: bytes):
    try:
        data = json.loads(content)
        return data if isinstance(data, list) else []
    except Exception:
        return []


def parse_csv(content: bytes):
    reader = csv.DictReader(
        content.decode("utf-8", errors="ignore").splitlines()
    )
    return list(reader)


def parse_xml(content: bytes):
    root = ET.fromstring(content)
    records = []
    for log in root.findall(".//log"):
        records.append({child.tag: child.text for child in log})
    return records

def parse_mixed_content(content: bytes):
    """
    Allows a single file to contain:
    - Plain text logs
    - JSON logs (single line)
    - CSV rows
    - XML blocks
    Mixed together.
    """

    text = content.decode("utf-8", errors="ignore")
    lines = text.splitlines()

    records = []
    xml_buffer = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 🔹 Try JSON (single-line JSON)
        try:
            obj = json.loads(line)
            records.append(obj)
            continue
        except:
            pass

        # 🔹 Try XML block
        if line.startswith("<"):
            xml_buffer += line
            try:
                root = ET.fromstring(xml_buffer)
                record = {child.tag: child.text for child in root}
                records.append(record)
                xml_buffer = ""
                continue
            except:
                continue

        # 🔹 Try CSV-like row
        if "," in line and not line.startswith("{"):
            parts = line.split(",")
            if len(parts) >= 3:
                records.append({
                    "timestamp": parts[0],
                    "severity": parts[1],
                    "message": ",".join(parts[2:])
                })
                continue

        # 🔹 Default → Treat as plain text
        records.append(line)

    return records



def parse_file(file_id: int):

    db: Session = SessionLocal()
    raw_file = None

    BATCH_SIZE = 500  # 🔥 configurable

    try:
        raw_file = db.query(RawFile).filter(
            RawFile.file_id == file_id
        ).first()

        if not raw_file:
            return

        raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
        db.commit()

        content = download_file_from_supabase(raw_file.storage_path)

        content_str = content.decode("utf-8", errors="ignore").strip()
        records = []

        # 🔹 FORMAT DETECTION
        try:
            full_json = json.loads(content_str)
            if isinstance(full_json, list):
                records = full_json
        except Exception:
            try:
                root = ET.fromstring(content_str)
                for log in root.findall(".//log"):
                    records.append(
                        {child.tag: child.text for child in log}
                    )
            except Exception:
                try:
                    lines = content_str.splitlines()
                    if lines and "," in lines[0]:
                        reader = csv.DictReader(lines)
                        records = list(reader)
                    else:
                        records = parse_mixed_content(content)
                except Exception:
                    records = parse_mixed_content(content)

        # 🔥 REAL BATCH PROCESSING
        total_records = len(records)
        parsed_count = 0
        skipped_count = 0

        batch_objects = []

        for r in records:
            parsed = parse_record(r)

            if (
                not parsed
                or not parsed.get("timestamp")
                or not parsed.get("message")
            ):
                skipped_count += 1
                continue

            log_obj = LogEntry(
                file_id=file_id,
                log_timestamp=parsed.get("timestamp"),
                severity_id=map_severity(parsed.get("severity")),
                category_id=classify_category(
                    parsed.get("message"),
                    parsed.get("service")
                ),
                environment_id=map_environment(
                    db,
                    parsed.get("environment")
                ),
                host_name=parsed.get("host"),
                service_name=parsed.get("service"),
                message=parsed.get("message"),
                raw_log=parsed.get("raw")
            )

            batch_objects.append(log_obj)
            parsed_count += 1

            # 🔹 When batch full → bulk insert
            if len(batch_objects) >= BATCH_SIZE:
                db.bulk_save_objects(batch_objects)
                db.commit()
                batch_objects.clear()  # 🔥 free memory

        # 🔹 Insert remaining logs
        if batch_objects:
            db.bulk_save_objects(batch_objects)
            db.commit()

        raw_file.status_id = get_status_id_by_code(db, "PARSED")
        db.commit()

        return {
            "file_id": file_id,
            "total_records": total_records,
            "parsed_records": parsed_count,
            "skipped_records": skipped_count
        }

    except Exception as e:
        db.rollback()

        if raw_file:
            raw_file.status_id = get_status_id_by_code(db, "FAILED")
            db.commit()

        print("Parse error:", str(e))

    finally:
        db.close()
