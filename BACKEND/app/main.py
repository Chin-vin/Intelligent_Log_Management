from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user_routes import router as users_router
from app.routes.auth_routes import router as auth_router 
# main.py
from app.routes.file_routes import router as file_router
from app.routes.parsing_routes import router as parsing_router
from dotenv import load_dotenv
from app.routes.log_routes import router as log_router
from app.routes.admin_lookup_routes import router as admin_lookup_router

from app.routes.dashboard_routes import router as dashboard_router

from app.routes import lookup_routes

from app.routes.admin_log_routes import router as admin_log_router
from app.routes.admin_user_routes import router as admin_user_router

from app.routes.user_log_routes import router as user_log_router
from app.routes.admin_security_routes import router as admin_security_router
from app.routes.admin_file_routes import router as admin_file_router
from app.background.scheduler import start_scheduler




from app.routes.archive_routes import router as archive_router
load_dotenv()


app = FastAPI(title="Intelligent Log & File Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
        "https://intelligent-log-management.vercel.app",
        "https://intelligent-log-management-2mg1hjcf9.vercel.app/",
        "https://intelligent-log-management-git-main-chincholi-vinithas-projects.vercel.app/"],   # restrict later
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(file_router)
app.include_router(parsing_router)
app.include_router(archive_router)
app.include_router(log_router)
app.include_router(admin_lookup_router)
app.include_router(dashboard_router)
app.include_router(user_log_router)
app.include_router(lookup_routes.router)
app.include_router(admin_user_router)
app.include_router(admin_log_router)
app.include_router(admin_security_router)
app.include_router(admin_file_router)



@app.on_event("startup")
def startup_event():
    start_scheduler()
