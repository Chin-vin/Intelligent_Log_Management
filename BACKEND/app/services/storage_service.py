from app.core.supabase import supabase

def build_archive_path(old_path: str) -> str:
    old_path = old_path.lstrip("/")

    # Prevent nested archive/archive
    if old_path.startswith("archive/"):
        return old_path

    return f"archive/{old_path}"
from app.core.supabase import supabase

def move_storage_file(old_path: str, new_path: str):
    bucket = supabase.storage.from_("raw_files")

    old_path = old_path.lstrip("/")
    new_path = new_path.lstrip("/")

    # Prevent self-copy
    if old_path == new_path:
        print(" File already archived, skipping move")
        return

    print("OLD:", old_path)
    print("NEW:", new_path)

    try:
        bucket.copy(old_path, new_path)
        print(" COPY SUCCESS")

        bucket.remove([old_path])
        print(" DELETE SUCCESS")

    except Exception as e:
        print("STORAGE ERROR:", repr(e))
        raise RuntimeError(f"Storage move failed: {e}")

def download_file_from_supabase(path: str) -> bytes:
    bucket = supabase.storage.from_("raw_files")

    response = bucket.download(path)

    if not response:
        raise RuntimeError("Failed to download file from storage")

    return response


def delete_storage_file(path: str):
    bucket = supabase.storage.from_("raw_files")

    path = path.lstrip("/")

    try:
        bucket.remove([path])
        print(f"Storage deleted: {path}")
    except Exception as e:
        print("STORAGE DELETE ERROR:", repr(e))
        raise RuntimeError(f"Storage delete failed: {e}")
