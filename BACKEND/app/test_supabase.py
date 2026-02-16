from supabase import create_client
import os
from dotenv import load_dotenv

# LOAD ENV FILE
load_dotenv()

print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_KEY SET:", bool(os.getenv("SUPABASE_SERVICE_ROLE_KEY")))

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

res = supabase.storage.from_("raw_files").upload(
    "/home/vinitha.chincholi/app_orders_prod.log",
    b"hello world",
    {"content-type": "text/plain"}
)

print(res)
