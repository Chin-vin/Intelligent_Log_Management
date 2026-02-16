from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:techv1%403@localhost:5432/Intelligent_Log_File_Management"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully")
except Exception as e:
    print("❌ Database connection failed")
    print(e)
