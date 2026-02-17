# # # from sqlalchemy import create_engine
# # # from sqlalchemy.orm import sessionmaker, declarative_base

# # # from sqlalchemy.orm import Session

# # # DATABASE_URL = "postgresql://postgres:techv1%403@localhost:5432/Intelligent_Log_File_Management"

# # # engine = create_engine(DATABASE_URL)
# # # SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# # # Base = declarative_base()


# # # def get_db():
# # #     db = SessionLocal()
# # #     try:
# # #         yield db
# # #     finally:
# # #         db.close()
# # import os
# # from sqlalchemy import create_engine
# # from sqlalchemy.orm import sessionmaker, declarative_base

# # DATABASE_URL = os.getenv("DATABASE_URL")

# # engine = create_engine(
# #     DATABASE_URL,
# #     connect_args={"sslmode": "require"}
# # )

# # SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# # Base = declarative_base()


# # def get_db():
# #     db = SessionLocal()
# #     try:
# #         yield db
# #     finally:
# #         db.close()
# import os
# from dotenv import load_dotenv
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")
# print("DATABASE_URL:",DATABASE_URL)

# engine = create_engine(
#     DATABASE_URL,
# )

# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# Base = declarative_base()


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL")

print("DATABASE_URL:", DATABASE_URL)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
