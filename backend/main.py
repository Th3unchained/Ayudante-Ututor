from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import test_database_connection
from app.routers import auth, courses, folders, conversations, messages, documents, chat

app = FastAPI(title="UTutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ututor-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(folders.router)
app.include_router(conversations.router)
app.include_router(messages.router)
app.include_router(documents.router)
app.include_router(chat.router)


@app.get("/")
def health_check():
    return {
        "message": "UTutor backend funcionando"
    }


@app.get("/db-test")
def database_test():
    message = test_database_connection()

    return {
        "database": message
    }