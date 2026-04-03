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
from mistralai import Mistral

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
df = df.replace({np.nan: None})

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
    history: list = []


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

@app.get("/api/products")
async def get_products():
    return df.to_dict(orient='records')

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


mistral_client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))


@app.post("/api/recommend/llm")
async def recommend_llm(req: ChatRequest, k: int = 5):
    conversation = []
    if req.history:
        for msg in req.history:
            conversation.append(
                {"role": msg.get("role", "user"), "content": msg.get("content", "")}
            )
    conversation.append({"role": "user", "content": req.message})

    query_prompt = """Given the following conversation, extract the most relevant search query for finding products.
Return ONLY the search query, nothing else. Make it concise (3-5 words) but descriptive.

Conversation:
"""
    for msg in conversation:
        query_prompt += f"{msg['role']}: {msg['content']}\n"
    query_prompt += "\nSearch query:"

    query_response = mistral_client.chat.complete(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": query_prompt}],
    )
    search_query = query_response.choices[0].message.content.strip()

    query_vector = model.encode([search_query])
    distances, indices = index.search(np.array(query_vector, dtype=np.float32), k)
    products = df.iloc[indices[0]].to_dict(orient="records")

    products_text = "\n".join(
        [
            f"- {p['name']}: {p.get('description', '')} ({p.get('discount_price') or p.get('actual_price', 'N/A')})"
            for p in products
        ]
    )

    response_prompt = f"""You are a helpful shopping assistant. Based on the user's request and chat history, recommend products from the catalog below.

Chat History:
"""
    for msg in conversation:
        response_prompt += f"{msg['role']}: {msg['content']}\n"

    response_prompt += f"""
User's latest request: {req.message}

Available products:
{products_text}

Provide a personalized recommendation (2-3 sentences) mentioning specific products from the list above."""

    final_response = mistral_client.chat.complete(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": response_prompt}],
    )

    return {
        "reply": final_response.choices[0].message.content,
        "products": products,
        "search_query": search_query,
    }
