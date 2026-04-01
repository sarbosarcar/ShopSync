from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import bcrypt
import faiss
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import dotenv
import os
import jwt
import datetime

dotenv.load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index('data/products.index')
df = pd.read_json('data/products.json')

SECRET_KEY = os.getenv("JWT_SECRET", "shopsync-secret-key")
ALGORITHM = "HS256"

security = HTTPBearer()

users_db = {}


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class ChatRequest(BaseModel):
    message: str

@app.post("/api/recommend")
async def recommend(
    req: ChatRequest,
    k: int = 5
):
    query_vector = model.encode([req.message])
    distances, indices = index.search(np.array(query_vector, dtype=np.float32), k)
    recommended = df.iloc[indices[0]].to_dict(orient='records')[1:]
    return {
        "reply": f"Based on your request '{req.message}', here are the top matches from our catalog.",
        "products": recommended
    }

@app.get("/api/product/{id}")
async def get_product(
    id: str
):
    product = df[df["product_id"] == id].to_dict(orient='records')[0]
    return product
    

class AuthRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/register")
async def register(req: AuthRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    password_bytes = req.password.encode("utf-8")[:72]
    users_db[req.email] = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode(
        "utf-8"
    )
    token = create_token(req.email)
    return {"token": token, "email": req.email}


@app.post("/api/auth/login")
async def login(req: AuthRequest):
    password_bytes = req.password.encode("utf-8")[:72]
    if req.email not in users_db or not bcrypt.checkpw(
        password_bytes, users_db[req.email].encode("utf-8")
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(req.email)
    return {"token": token, "email": req.email}


@app.get("/api/auth/me")
async def me(email: str = Depends(verify_token)):
    return {"email": email}
