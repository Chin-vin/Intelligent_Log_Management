# # from datetime import datetime, timezone
# # from fastapi import HTTPException
# # from sqlalchemy.orm import Session
# # import hashlib
# # import json
# # import csv
# # import xml.etree.ElementTree as ET
# # from app.models.lookup import UploadStatus
# # from app.models.logs import LogEntry
# # from app.models.audit import FileProcessingLog
# # from app.models.files import RawFile
# # from app.models.lookup import Environment
# # from app.services.storage_service import download_file_from_supabase

# # def map_environment(
# #     db: Session,
# #     env_code: str | None
# # ) -> int | None:
# #     if not env_code:
# #         return None

# #     env = (
# #         db.query(Environment)
# #         .filter(Environment.environment_code == env_code.upper())
# #         .first()
# #     )

# #     return env.environment_id if env else None


# # def map_severity(severity: str) -> int:
# #     severity = severity.upper()

# #     mapping = {
# #         "DEBUG": 1,
# #         "INFO": 2,
# #         "WARN": 3,
# #         "ERROR": 4,
# #         "FATAL": 5,
# #         "CRITICAL": 5
# #     }

# #     return mapping.get(severity, 2)  # default INFO

# # def classify_category(message: str, service: str | None = None) -> int:
# #     text = f"{message} {service or ''}".lower()

# #     if any(k in text for k in ["auth", "login", "token", "unauthorized"]):
# #         return 2  # SECURITY
# #     if any(k in text for k in ["cpu", "disk", "memory", "node", "container"]):
# #         return 3  # INFRASTRUCTURE
# #     if any(k in text for k in ["audit", "policy", "permission", "role"]):
# #         return 4  # AUDIT
# #     return 1      # APPLICATION

# # def parse_text(content: bytes, file_id: int, db: Session):
# #     lines = content.decode("utf-8", errors="ignore").splitlines()
# #     seen = set()

# #     for line in lines:
# #         line = line.strip()
# #         if not line:
# #             continue

# #         try:
# #             parts = line.split()
# #             if len(parts) < 3:
# #                 continue  # junk line

# #             ts_raw, severity, env = parts[:3]
# #             log_time = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))

# #             host, service = None, None
# #             msg_start = 3

# #             for i in range(3, len(parts)):
# #                 if parts[i].startswith("host="):
# #                     host = parts[i].split("=", 1)[1]
# #                 elif parts[i].startswith("service="):
# #                     service = parts[i].split("=", 1)[1]
# #                 else:
# #                     msg_start = i
# #                     break

# #             message = " ".join(parts[msg_start:])
# #             if not message:
# #                 continue

# #             fp = hashlib.sha256(line.encode()).hexdigest()
# #             if fp in seen:
# #                 continue
# #             seen.add(fp)

# #             db.add(LogEntry(
# #                 file_id=file_id,
# #                 log_timestamp=log_time,
# #                 severity_id=map_severity(severity),
# #                 category_id=classify_category(message, service),
# #                 environment_id=map_environment(db,env),
# #                 host_name=host,
# #                 service_name=service,
# #                 message=message,
# #                 raw_log=line
# #             ))

# #         except Exception:
# #             continue  # silently skip bad lines

# #     db.commit()

# # def parse_json(content: bytes, file_id: int, db: Session):
# #     try:
# #         records = json.loads(content)
# #     except json.JSONDecodeError:
# #         return  # entire file malformed → skip safely

# #     if not isinstance(records, list):
# #         return

# #     seen_fingerprints: set[str] = set()

# #     for r in records:
# #         try:
# #             # 🔴 Required fields
# #             timestamp = r["timestamp"]
# #             message = r["message"]

# #             severity = r.get("severity") or r.get("level")
# #             environment = r.get("environment") or r.get("env")
# #             host = r.get("host")
# #             service = r.get("service")

# #             # ⏱ Timestamp validation
# #             log_time = datetime.fromisoformat(
# #                 timestamp.replace("Z", "+00:00")
# #             )

# #             # 🔑 Fingerprint (per-file dedup)
# #             fingerprint = hashlib.sha256(
# #                 f"{timestamp}{severity}{environment}{host}{service}{message}".encode()
# #             ).hexdigest()

# #             if fingerprint in seen_fingerprints:
# #                 continue
# #             seen_fingerprints.add(fingerprint)

# #             # 🧾 Persist log
# #             db.add(LogEntry(
# #                 file_id=file_id,
# #                 log_timestamp=log_time,
# #                 severity_id=map_severity(severity),
# #                 category_id=classify_category(message, service),
# #                 environment_id=map_environment(db,environment),
# #                 host_name=host,
# #                 service_name=service,
# #                 message=message,
# #                 raw_log=json.dumps(r, sort_keys=True)
# #             ))

# #         except Exception:
# #             # malformed record → skip only this entry
# #             continue

# #     db.commit()


# # def parse_csv(content: bytes, file_id: int, db: Session):
# #     reader = csv.DictReader(content.decode("utf-8", errors="ignore").splitlines())
# #     seen = set()

# #     for row in reader:
# #         try:
# #             raw = str(row)
# #             fp = hashlib.sha256(raw.encode()).hexdigest()

# #             if fp in seen:
# #                 continue
# #             seen.add(fp)

# #             db.add(LogEntry(
# #                 file_id=file_id,
# #                 log_timestamp=datetime.fromisoformat(row["timestamp"].replace("Z","+00:00")),
# #                 severity_id=map_severity(row["severity"]),
# #                 category_id=classify_category(row["message"], row.get("service")),
# #                 environment_id=map_environment(db,row.get("environment")),
# #                 host_name=row.get("host"),
# #                 service_name=row.get("service"),
# #                 message=row["message"],
# #                 raw_log=raw
# #             ))
# #         except Exception:
# #             continue

# #     db.commit()

# # def parse_xml(content: bytes, file_id: int, db: Session):
# #     root = ET.fromstring(content)
# #     seen = set()

# #     for log in root.findall("log"):
# #         try:
# #             raw = ET.tostring(log).decode()
# #             fp = hashlib.sha256(raw.encode()).hexdigest()

# #             if fp in seen:
# #                 continue
# #             seen.add(fp)

# #             db.add(LogEntry(
# #                 file_id=file_id,
# #                 log_timestamp=datetime.fromisoformat(
# #                     log.findtext("timestamp").replace("Z","+00:00")
# #                 ),
# #                 severity_id=map_severity(log.findtext("severity")),
# #                 category_id=classify_category(
# #                     log.findtext("message"),
# #                     log.findtext("service")
# #                 ),
# #                 environment_id=map_environment(db,log.findtext("environment")),
# #                 host_name=log.findtext("host"),
# #                 service_name=log.findtext("service"),
# #                 message=log.findtext("message"),
# #                 raw_log=raw
# #             ))
# #         except Exception:
# #             continue

# #     db.commit()

# # def get_status_id_by_code(db: Session, code: str) -> int:
# #     status = (
# #         db.query(UploadStatus)
# #         .filter(UploadStatus.status_code == code)
# #         .first()
# #     )
# #     if not status:
# #         raise HTTPException(
# #             status_code=500,
# #             detail=f"Upload status '{code}' not found"
# #         )
# #     return status.status_id

# # def parse_file(*, db: Session, file_id: int):
# #     raw_file = db.query(RawFile).filter(RawFile.file_id == file_id).first()
# #     if not raw_file:
# #         return

# #     # 🔹 Mark file as PROCESSING
# #     raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
# #     db.commit()

# #     content = download_file_from_supabase(raw_file.storage_path)

# #     process = FileProcessingLog(
# #         file_id=file_id,
# #         status="PROCESSING",
# #         started_at=datetime.now(timezone.utc)
# #     )
# #     db.add(process)
# #     db.commit()

# #     try:
# #         # 🔹 Count logs BEFORE parsing
# #         before_count = db.query(LogEntry).filter(
# #             LogEntry.file_id == file_id
# #         ).count()

# #         # 🔹 Parse based on format
# #         if raw_file.format_id == 1:
# #             parse_text(content, file_id, db)
# #         elif raw_file.format_id == 2:
# #             parse_json(content, file_id, db)
# #         elif raw_file.format_id == 3:
# #             parse_csv(content, file_id, db)
# #         elif raw_file.format_id == 4:
# #             parse_xml(content, file_id, db)

# #         # 🔹 Count logs AFTER parsing
# #         after_count = db.query(LogEntry).filter(
# #             LogEntry.file_id == file_id
# #         ).count()

# #         # ❌ No logs created → FAILED
# #         if after_count == before_count:
# #             raise ValueError("No valid log entries found in file")

# #         # ✅ Success
# #         process.status = "PARSED"
# #         raw_file.status_id = get_status_id_by_code(db, "PARSED")

# #     except Exception as e:
# #         # ❌ Failure
# #         process.status = "FAILED"
# #         process.error_message = str(e)
# #         raw_file.status_id = get_status_id_by_code(db, "FAILED")

# #     finally:
# #         process.completed_at = datetime.now(timezone.utc)
# #         db.commit()
# import re
# import hashlib
# import json
# import csv
# import xml.etree.ElementTree as ET
# from datetime import datetime
# from dateutil import parser as date_parser

# # ======================================================
# # 1. FIELD ALIASES (WORKS FOR TEXT / JSON / CSV / XML)
# # ======================================================

# FIELD_ALIASES = {
#     "timestamp": ["timestamp", "time", "ts", "@timestamp", "date"],
#     "severity": ["severity", "level", "loglevel", "priority"],
#     "environment": ["env", "environment", "stage"],
#     "host": ["host", "hostname", "node"],
#     "service": ["service", "app", "application", "component"],
#     "message": ["message", "msg", "log", "text"]
# }

# SEVERITIES = ["DEBUG", "INFO", "WARN", "WARNING", "ERROR", "FATAL", "CRITICAL"]

# # ======================================================
# # 2. UTILITIES
# # ======================================================

# def fingerprint(value: str) -> str:
#     return hashlib.sha256(value.encode()).hexdigest()

# def normalize_fields(raw: dict) -> dict:
#     raw = {k.lower(): str(v) for k, v in raw.items()}
#     normalized = {}
#     for canonical, aliases in FIELD_ALIASES.items():
#         for a in aliases:
#             if a in raw:
#                 normalized[canonical] = raw[a]
#                 break
#     return normalized

# def parse_timestamp(value: str | None) -> datetime | None:
#     if not value:
#         return None
#     try:
#         return date_parser.parse(value)
#     except Exception:
#         return None

# def infer_severity(text: str) -> str:
#     for s in SEVERITIES:
#         if s in text.upper():
#             return s
#     return "INFO"

# def infer_message(text: str) -> str:
#     clean = text
#     for s in SEVERITIES:
#         clean = re.sub(rf"\b{s}\b", "", clean, flags=re.I)
#     clean = re.sub(r"\[.*?\]|\(.*?\)", "", clean)
#     return clean.strip()

# # ======================================================
# # 3. TEXT KV EXTRACTION
# # ======================================================

# def extract_kv_from_text(line: str) -> dict:
#     pattern = re.compile(
#         r"(?P<key>[a-zA-Z_@]+)\s*[:=]\s*(?P<value>\".*?\"|\'.*?\'|\[.*?\]|\(.*?\)|[^\s]+)"
#     )
#     result = {}
#     for m in pattern.finditer(line):
#         result[m.group("key")] = m.group("value").strip("[]()\"'")
#     return result

# # ======================================================
# # 4. UNIVERSAL RECORD PARSER (🔥 CORE LOGIC 🔥)
# # ======================================================

# def parse_record(record: dict | str) -> dict | None:
#     """
#     record can be:
#     - dict (JSON / CSV / XML)
#     - str  (TEXT)
#     """

#     # --------------------
#     # TEXT LOG
#     # --------------------
#     if isinstance(record, str):
#         raw = extract_kv_from_text(record)
#         fields = normalize_fields(raw)

#         ts = parse_timestamp(fields.get("timestamp"))
#         msg = fields.get("message")

#         if ts and msg:
#             return {
#                 "timestamp": ts,
#                 "severity": fields.get("severity", "INFO"),
#                 "environment": fields.get("environment"),
#                 "host": fields.get("host"),
#                 "service": fields.get("service"),
#                 "message": msg,
#                 "raw": record
#             }

#         # Heuristic fallback
#         ts = parse_timestamp(record)
#         if not ts:
#             return None

#         return {
#             "timestamp": ts,
#             "severity": infer_severity(record),
#             "environment": None,
#             "host": None,
#             "service": None,
#             "message": infer_message(record),
#             "raw": record
#         }

#     # --------------------
#     # STRUCTURED LOG
#     # --------------------
#     fields = normalize_fields(record)

#     ts = parse_timestamp(fields.get("timestamp"))
#     msg = fields.get("message")

#     if not ts or not msg:
#         return None

#     return {
#         "timestamp": ts,
#         "severity": fields.get("severity", "INFO"),
#         "environment": fields.get("environment"),
#         "host": fields.get("host"),
#         "service": fields.get("service"),
#         "message": msg,
#         "raw": json.dumps(record)
#     }

# # ======================================================
# # 5. FORMAT-SPECIFIC READERS (ALL USE parse_record)
# # ======================================================

# def parse_text(content: bytes):
#     return content.decode("utf-8", errors="ignore").splitlines()

# def parse_json(content: bytes):
#     try:
#         data = json.loads(content)
#         return data if isinstance(data, list) else []
#     except Exception:
#         return []

# def parse_csv(content: bytes):
#     reader = csv.DictReader(content.decode("utf-8", errors="ignore").splitlines())
#     return list(reader)

# def parse_xml(content: bytes):
#     root = ET.fromstring(content)
#     records = []
#     for log in root.findall(".//log"):
#         records.append({child.tag: child.text for child in log})
#     return records
# def parse_file(db: Session, file_id: int):
#     raw_file = db.query(RawFile).filter(RawFile.file_id == file_id).first()
#     if not raw_file:
#         return

#     raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#     db.commit()

#     content = download_file_from_supabase(raw_file.storage_path)
#     seen = set()

#     if raw_file.format_id == 1:
#         records = parse_text(content)
#     elif raw_file.format_id == 2:
#         records = parse_json(content)
#     elif raw_file.format_id == 3:
#         records = parse_csv(content)
#     elif raw_file.format_id == 4:
#         records = parse_xml(content)
#     else:
#         records = []

#     for r in records:
#         parsed = parse_record(r)
#         if not parsed:
#             continue

#         fp = fingerprint(parsed["raw"])
#         if fp in seen:
#             continue
#         seen.add(fp)

#         db.add(LogEntry(
#             file_id=file_id,
#             log_timestamp=parsed["timestamp"],
#             severity_id=map_severity(parsed["severity"]),
#             category_id=classify_category(parsed["message"], parsed["service"]),
#             environment_id=map_environment(db, parsed["environment"]),
#             host_name=parsed["host"],
#             service_name=parsed["service"],
#             message=parsed["message"],
#             raw_log=parsed["raw"]
#         ))

#     raw_file.status_id = get_status_id_by_code(db, "PARSED")
#     db.commit()
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
    if any(k in text for k in ["cpu", "disk", "memory", "node", "container"]):
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



# def parse_record(record: dict | str) -> dict | None:

#     # =========================
#     # 🔹 TEXT LOGS
#     # =========================
#     if isinstance(record, str):

#         # ✅ 1️⃣ Standard format:
#         # 2026-02-17 09:15:23 INFO AuthService Message
#         pattern = re.match(
#             r"^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+"
#             r"(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL)\s+"
#             r"(\S+)\s+(.*)$",
#             record
#         )

#         if pattern:
#             timestamp_str, severity, service, message = pattern.groups()

#             return {
#                 "timestamp": parse_timestamp(timestamp_str),
#                 "severity": severity,
#                 "environment": None,
#                 "host": None,
#                 "service": service,
#                 "message": message,
#                 "raw": record
#             }

#         # ✅ 2️⃣ Key-value fallback (env=prod severity=INFO etc)
#         raw = extract_kv_from_text(record)
#         fields = normalize_fields(raw)

#         ts = parse_timestamp(fields.get("timestamp"))
#         msg = fields.get("message")

#         if ts and msg:
#             return {
#                 "timestamp": ts,
#                 "severity": fields.get("severity", "INFO"),
#                 "environment": fields.get("environment"),
#                 "host": fields.get("host"),
#                 "service": fields.get("service"),
#                 "message": msg,
#                 "raw": record
#             }

#         # ✅ 3️⃣ Final heuristic fallback
#         ts = parse_timestamp(record)
#         if not ts:
#             return None

#         return {
#             "timestamp": ts,
#             "severity": infer_severity(record),
#             "environment": None,
#             "host": None,
#             "service": None,
#             "message": infer_message(record),
#             "raw": record
#         }

#     # =========================
#     # 🔹 STRUCTURED LOGS
#     # =========================
#     fields = normalize_fields(record)

#     ts = parse_timestamp(fields.get("timestamp"))
#     msg = fields.get("message")

#     if not ts or not msg:
#         return None

#     return {
#         "timestamp": ts,
#         "severity": fields.get("severity", "INFO"),
#         "environment": fields.get("environment"),
#         "host": fields.get("host"),
#         "service": fields.get("service"),
#         "message": msg,
#         "raw": json.dumps(record)
#     }
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


# def parse_record(record: dict | str) -> dict | None:

#     # =========================
#     # 🔹 TEXT LOGS
#     # =========================
#     if isinstance(record, str):

#         # ✅ 1️⃣ Standard format:
#         # 2026-02-17 09:15:23 INFO AuthService Message
#         pattern = re.match(
#             r"^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+"
#             r"(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL)\s+"
#             r"(\S+)\s+(.*)$",
#             record
#         )

#         if pattern:
#             timestamp_str, severity, service, message = pattern.groups()

#             return {
#                 "timestamp": parse_timestamp(timestamp_str),
#                 "severity": severity,
#                 "environment": None,
#                 "host": None,
#                 "service": service,
#                 "message": message,
#                 "raw": record
#             }

#         # ✅ 2️⃣ Key-value fallback (env=prod severity=INFO etc)
#         raw = extract_kv_from_text(record)
#         fields = normalize_fields(raw)

#         ts = parse_timestamp(fields.get("timestamp"))
#         msg = fields.get("message")

#         if ts and msg:
#             return {
#                 "timestamp": ts,
#                 "severity": fields.get("severity", "INFO"),
#                 "environment": fields.get("environment"),
#                 "host": fields.get("host"),
#                 "service": fields.get("service"),
#                 "message": msg,
#                 "raw": record
#             }

#         # ✅ 3️⃣ Final heuristic fallback
#         ts = parse_timestamp(record)
#         if not ts:
#             return None

#         return {
#             "timestamp": ts,
#             "severity": infer_severity(record),
#             "environment": None,
#             "host": None,
#             "service": None,
#             "message": infer_message(record),
#             "raw": record
#         }

#     # =========================
#     # 🔹 STRUCTURED LOGS
#     # =========================
#     fields = normalize_fields(record)

#     ts = parse_timestamp(fields.get("timestamp"))
#     msg = fields.get("message")

#     if not ts or not msg:
#         return None

#     return {
#         "timestamp": ts,
#         "severity": fields.get("severity", "INFO"),
#         "environment": fields.get("environment"),
#         "host": fields.get("host"),
#         "service": fields.get("service"),
#         "message": msg,
#         "raw": json.dumps(record)
#     }

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

# def parse_file(db: Session, file_id: int):
#     raw_file = (
#         db.query(RawFile)
#         .filter(RawFile.file_id == file_id)
#         .first()
#     )
#     if not raw_file:
#         return

#     # Mark PROCESSING
#     raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#     db.commit()

#     content = download_file_from_supabase(raw_file.storage_path)

#     process = FileProcessingLog(
#         file_id=file_id,
#         status="PROCESSING",
#         started_at=datetime.now(timezone.utc)
#     )
#     db.add(process)
#     db.commit()

#     seen = set()

#     try:
#         if raw_file.format_id == 1:
#             records = parse_text(content)
#         elif raw_file.format_id == 2:
#             records = parse_json(content)
#         elif raw_file.format_id == 3:
#             records = parse_csv(content)
#         elif raw_file.format_id == 4:
#             records = parse_xml(content)
#         else:
#             records = []

#         for r in records:
#             parsed = parse_record(r)
#             if not parsed:
#                 continue

#             fp = fingerprint(parsed["raw"])
#             if fp in seen:
#                 continue
#             seen.add(fp)

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed["timestamp"],
#                 severity_id=map_severity(parsed["severity"]),
#                 category_id=classify_category(parsed["message"], parsed["service"]),
#                 environment_id=map_environment(db, parsed["environment"]),
#                 host_name=parsed["host"],
#                 service_name=parsed["service"],
#                 message=parsed["message"],
#                 raw_log=parsed["raw"]
#             ))

#         process.status = "PARSED"
#         raw_file.status_id = get_status_id_by_code(db, "PARSED")

#     except Exception as e:
#         process.status = "FAILED"
#         process.error_message = str(e)
#         raw_file.status_id = get_status_id_by_code(db, "FAILED")

#     finally:
#         process.completed_at = datetime.now(timezone.utc)
#         db.commit()

# def parse_file(file_id: int):

#     db: Session = SessionLocal()

#     try:
#         raw_file = (
#             db.query(RawFile)
#             .filter(RawFile.file_id == file_id)
#             .first()
#         )

#         if not raw_file:
#             return

#         # 🔹 Mark PROCESSING
#         raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#         db.commit()

#         content = download_file_from_supabase(raw_file.storage_path)

#         process = FileProcessingLog(
#             file_id=file_id,
#             status="PROCESSING",
#             started_at=datetime.now(timezone.utc)
#         )
#         db.add(process)
#         db.commit()

#         seen = set()

#         # 🔹 Detect format
#         if raw_file.format_id == 1:
#             records = parse_text(content)
#         elif raw_file.format_id == 2:
#             records = parse_json(content)
#         elif raw_file.format_id == 3:
#             records = parse_csv(content)
#         elif raw_file.format_id == 4:
#             records = parse_xml(content)
#         else:
#             records = []

#         for r in records:
#             parsed = parse_record(r)
#             if not parsed:
#                 continue

#             fp = fingerprint(parsed["raw"])
#             if fp in seen:
#                 continue
#             seen.add(fp)

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed["timestamp"],
#                 severity_id=map_severity(parsed["severity"]),
#                 category_id=classify_category(
#                     parsed["message"],
#                     parsed["service"]
#                 ),
#                 environment_id=map_environment(
#                     db,
#                     parsed["environment"]
#                 ),
#                 host_name=parsed["host"],
#                 service_name=parsed["service"],
#                 message=parsed["message"],
#                 raw_log=parsed["raw"]
#             ))

#         process.status = "PARSED"
#         raw_file.status_id = get_status_id_by_code(db, "PARSED")

#     except Exception as e:
#         db.rollback()

#         process.status = "FAILED"
#         process.error_message = str(e)

#         if raw_file:
#             raw_file.status_id = get_status_id_by_code(db, "FAILED")

#     finally:
#         process.completed_at = datetime.now(timezone.utc)
#         db.commit()
#         db.close()

# def parse_file(file_id: int):
#     db: Session = SessionLocal()
#     process = None
#     raw_file = None

#     try:
#         # 🔹 Fetch file
#         raw_file = (
#             db.query(RawFile)
#             .filter(RawFile.file_id == file_id)
#             .first()
#         )
#         print("Hello")
#         if not raw_file:
#             return

#         # 🔹 Mark PROCESSING
#         raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#         db.commit()

#         # 🔹 Create processing log
#         process = FileProcessingLog(
#             file_id=file_id,
#             status="PROCESSING",
#             started_at=datetime.now(timezone.utc)
#         )
#         db.add(process)
#         db.commit()

#         # 🔹 Download file
#         content = download_file_from_supabase(raw_file.storage_path)

#         # 🔹 Detect format
#         if raw_file.format_id == 1:
#             records = parse_text(content)
#         elif raw_file.format_id == 2:
#             records = parse_json(content)
#         elif raw_file.format_id == 3:
#             records = parse_csv(content)
#         elif raw_file.format_id == 4:
#             records = parse_xml(content)
#         else:
#             records = []

#         seen = set()
#         inserted_count = 0

#         for r in records:
#             parsed = parse_record(r)
#             if not parsed:
#                 continue

#             fp = fingerprint(parsed["raw"])
#             if fp in seen:
#                 continue
#             seen.add(fp)

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed["timestamp"],
#                 severity_id=map_severity(parsed["severity"]),
#                 category_id=classify_category(
#                     parsed["message"],
#                     parsed["service"]
#                 ),
#                 environment_id=map_environment(
#                     db,
#                     parsed["environment"]
#                 ),
#                 host_name=parsed["host"],
#                 service_name=parsed["service"],
#                 message=parsed["message"],
#                 raw_log=parsed["raw"]
#             ))

#             inserted_count += 1

#             # 🔹 Commit in batches (VERY IMPORTANT)
#             if inserted_count % 500 == 0:
#                 db.commit()

#         db.commit()

#         # 🔹 If nothing inserted → FAIL
#         if inserted_count == 0:
#             raise Exception("No valid log entries parsed")

#         # 🔹 Success
#         process.status = "PARSED"
#         raw_file.status_id = get_status_id_by_code(db, "PARSED")

#     except Exception as e:
#         db.rollback()

#         if process:
#             process.status = "FAILED"
#             process.error_message = str(e)

#         if raw_file:
#             raw_file.status_id = get_status_id_by_code(db, "FAILED")

#     finally:
#         if process:
#             process.completed_at = datetime.now(timezone.utc)

#         db.commit()
# #         db.close()
# # def parse_file(file_id: int):

#     db: Session = SessionLocal()
#     raw_file = None

#     try:
#         raw_file = db.query(RawFile).filter(
#             RawFile.file_id == file_id
#         ).first()

#         if not raw_file:
#             return

#         raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#         db.commit()

#         content = download_file_from_supabase(raw_file.storage_path)

#         # Detect format
#         # if raw_file.format_id == 1:
#         #     records = parse_text(content)
#         # elif raw_file.format_id == 2:
#         #     records = parse_json(content)
#         # elif raw_file.format_id == 3:
#         #     records = parse_csv(content)
#         # elif raw_file.format_id == 4:
#         #     records = parse_xml(content)
#         # else:
#         #     records = []
#         # 🔥 Mixed-format safe parsing
#         records = parse_mixed_content(content)

#         seen = set()
#         total_records = len(records)
#         parsed_count = 0
#         skipped_count = 0

#         for r in records:
#             parsed = parse_record(r)

#             if not parsed or not parsed.get("message"):
#                 skipped_count += 1
#                 continue

#             fp = fingerprint(parsed["raw"])
#             if fp in seen:
#                 skipped_count += 1
#                 continue

#             seen.add(fp)

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed.get("timestamp"),
#                 severity_id=map_severity(parsed.get("severity")),
#                 category_id=classify_category(
#                     parsed.get("message"),
#                     parsed.get("service")
#                 ),
#                 environment_id=map_environment(
#                     db,
#                     parsed.get("environment")
#                 ),
#                 host_name=parsed.get("host"),
#                 service_name=parsed.get("service"),
#                 message=parsed.get("message"),
#                 raw_log=parsed.get("raw")
#             ))

#             parsed_count += 1

#             if parsed_count % 500 == 0:
#                 db.commit()

#         db.commit()

#         raw_file.status_id = get_status_id_by_code(db, "PARSED")
#         db.commit()

#         print(
#             f"File {file_id} → Total: {total_records}, Parsed: {parsed_count}, Skipped: {skipped_count}"
#         )

#         return {
#             "file_id": file_id,
#             "total_records": total_records,
#             "parsed_records": parsed_count,
#             "skipped_records": skipped_count
#         }

#     except Exception as e:
#         db.rollback()

#         if raw_file:
#             raw_file.status_id = get_status_id_by_code(db, "FAILED")
#             db.commit()

#         print("Parse error:", str(e))

#     finally:
#         db.close()


# def parse_file(file_id: int):

#     db: Session = SessionLocal()
#     raw_file = None

#     try:
#         raw_file = db.query(RawFile).filter(
#             RawFile.file_id == file_id
#         ).first()

#         if not raw_file:
#             return

#         # 🔹 Mark file as PROCESSING
#         raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#         db.commit()

#         content = download_file_from_supabase(raw_file.storage_path)

#         # 🔥 NEW → Mixed-format parsing
#         # records = parse_mixed_content(content)
        
#         try:
#             content_str = content.decode("utf-8", errors="ignore").strip()
#             full_json = json.loads(content_str)
#             if isinstance(full_json, list):
#                 records = full_json
#             else:
#                 records = []
#         except Exception:
#              # 2️⃣ Try full XML
#             try:
#                 root = ET.fromstring(content_str)
#                 for log in root.findall(".//log"):
#                     records.append({child.tag: child.text for child in log})
#             except Exception:
#                 pass
#         except Exception:
#             # 3️⃣ Try CSV
#         try:
#             lines = content_str.splitlines()
#             if lines and "," in lines[0]:
#                 reader = csv.DictReader(lines)
#                 records = list(reader)
#             else:
#                 records = parse_mixed_content(content)
#         except Exception:
#             # 4️⃣ Final fallback
#             records = parse_mixed_content(content)

#         total_records = len(records)
#         parsed_count = 0
#         skipped_count = 0

#         for r in records:
#             parsed = parse_record(r)

#             # 🔹 Mandatory validation
#             if (
#                 not parsed
#                 or not parsed.get("timestamp")
#                 or not parsed.get("message")
#             ):
#                 skipped_count += 1
#                 continue

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed.get("timestamp"),
#                 severity_id=map_severity(parsed.get("severity")),
#                 category_id=classify_category(
#                     parsed.get("message"),
#                     parsed.get("service")
#                 ),
#                 environment_id=map_environment(
#                     db,
#                     parsed.get("environment")
#                 ),
#                 host_name=parsed.get("host"),
#                 service_name=parsed.get("service"),
#                 message=parsed.get("message"),
#                 raw_log=parsed.get("raw")
#             ))

#             parsed_count += 1

#             # 🔹 Batch commit
#             if parsed_count % 500 == 0:
#                 db.commit()

#         db.commit()

#         # 🔹 Mark as PARSED
#         raw_file.status_id = get_status_id_by_code(db, "PARSED")
#         db.commit()

#         print(
#             f"File {file_id} → Total: {total_records}, Parsed: {parsed_count}, Skipped: {skipped_count}"
#         )

#         return {
#             "file_id": file_id,
#             "total_records": total_records,
#             "parsed_records": parsed_count,
#             "skipped_records": skipped_count
#         }

#     except Exception as e:
#         db.rollback()

#         if raw_file:
#             raw_file.status_id = get_status_id_by_code(db, "FAILED")
#             db.commit()

#         print("Parse error:", str(e))

#     finally:
# #         db.close()
# def parse_file(file_id: int):

#     db: Session = SessionLocal()
#     raw_file = None

#     try:
#         raw_file = db.query(RawFile).filter(
#             RawFile.file_id == file_id
#         ).first()

#         if not raw_file:
#             return

#         raw_file.status_id = get_status_id_by_code(db, "PROCESSING")
#         db.commit()

#         content = download_file_from_supabase(raw_file.storage_path)

#         # 🔥 FIXED DETECTION BLOCK
#         content_str = content.decode("utf-8", errors="ignore").strip()
#         records = []

#         # 1️⃣ Try JSON
#         try:
#             full_json = json.loads(content_str)
#             if isinstance(full_json, list):
#                 records = full_json
#         except Exception:
#             # 2️⃣ Try XML
#             try:
#                 root = ET.fromstring(content_str)
#                 for log in root.findall(".//log"):
#                     records.append(
#                         {child.tag: child.text for child in log}
#                     )
#             except Exception:
#                 # 3️⃣ Try CSV
#                 try:
#                     lines = content_str.splitlines()
#                     if lines and "," in lines[0]:
#                         reader = csv.DictReader(lines)
#                         records = list(reader)
#                     else:
#                         records = parse_mixed_content(content)
#                 except Exception:
#                     # 4️⃣ Final fallback
#                     records = parse_mixed_content(content)

#         # 🔥 INSERT LOGIC
#         total_records = len(records)
#         parsed_count = 0
#         skipped_count = 0

#         for r in records:
#             parsed = parse_record(r)

#             if (
#                 not parsed
#                 or not parsed.get("timestamp")
#                 or not parsed.get("message")
#             ):
#                 skipped_count += 1
#                 continue

#             db.add(LogEntry(
#                 file_id=file_id,
#                 log_timestamp=parsed.get("timestamp"),
#                 severity_id=map_severity(parsed.get("severity")),
#                 category_id=classify_category(
#                     parsed.get("message"),
#                     parsed.get("service")
#                 ),
#                 environment_id=map_environment(
#                     db,
#                     parsed.get("environment")
#                 ),
#                 host_name=parsed.get("host"),
#                 service_name=parsed.get("service"),
#                 message=parsed.get("message"),
#                 raw_log=parsed.get("raw")
#             ))

#             parsed_count += 1

#             if parsed_count % 500 == 0:
#                 db.commit()

#         db.commit()

#         raw_file.status_id = get_status_id_by_code(db, "PARSED")
#         db.commit()

#         return {
#             "file_id": file_id,
#             "total_records": total_records,
#             "parsed_records": parsed_count,
#             "skipped_records": skipped_count
#         }

#     except Exception as e:
#         db.rollback()

#         if raw_file:
#             raw_file.status_id = get_status_id_by_code(db, "FAILED")
#             db.commit()

#         print("Parse error:", str(e))

#     finally:
#         db.close()

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
