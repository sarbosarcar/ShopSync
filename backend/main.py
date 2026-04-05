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

# Load env
dotenv.load_dotenv()

app = FastAPI()

print("🚀 Starting FastAPI app...")

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Globals (lazy load) ------------------
model = None
index = None
df = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ------------------ Loaders ------------------
def load_model():
    global model
    if model is None:
        print("📦 Loading embedding model...")
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model


def load_data():
    global index, df
    if index is None or df is None:
        try:
            print("📂 Loading FAISS + dataset...")

            index_path = os.path.join(BASE_DIR, "data/products.index")
            json_path = os.path.join(BASE_DIR, "data/products.json")

            index = faiss.read_index(index_path)
            df = pd.read_json(json_path)
            df = df.replace({np.nan: None})

            print("✅ Data loaded successfully")

        except Exception as e:
            print("❌ DATA LOAD ERROR:", e)
            raise RuntimeError(f"Data loading failed: {e}")

    return index, df


# ------------------ Auth ------------------
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


# ------------------ Schemas ------------------
class ChatRequest(BaseModel):
    message: str
    history: list = []


class AuthRequest(BaseModel):
    email: str
    password: str


# ------------------ Routes ------------------

@app.get("/")
def health():
    return {"status": "running"}


@app.post("/api/recommend")
async def recommend(req: ChatRequest, k: int = 5):
    index, df = load_data()
    model = load_model()

    query_vector = model.encode([req.message])
    distances, indices = index.search(np.array(query_vector, dtype=np.float32), k)

    recommended = df.iloc[indices[0]].to_dict(orient="records")[1:]

    return {
        "reply": f"Based on your request '{req.message}', here are top matches.",
        "products": recommended,
    }


@app.get("/api/products")
async def get_products():
    _, df = load_data()
    return df.to_dict(orient="records")


@app.get("/api/product/{id}")
async def get_product(id: str):
    _, df = load_data()

    product = df[df["product_id"] == id]
    if product.empty:
        raise HTTPException(status_code=404, detail="Product not found")

    return product.to_dict(orient="records")[0]


@app.post("/api/auth/register")
async def register(req: AuthRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_bytes = req.password.encode("utf-8")[:72]
    users_db[req.email] = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode()

    token = create_token(req.email)
    return {"token": token, "email": req.email}


@app.post("/api/auth/login")
async def login(req: AuthRequest):
    password_bytes = req.password.encode("utf-8")[:72]

    if req.email not in users_db or not bcrypt.checkpw(
        password_bytes, users_db[req.email].encode()
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(req.email)
    return {"token": token, "email": req.email}


@app.get("/api/auth/me")
async def me(email: str = Depends(verify_token)):
    return {"email": email}


# ------------------ Mistral ------------------
mistral_client = None


def get_mistral():
    global mistral_client
    if mistral_client is None:
        print("🤖 Initializing Mistral client...")
        mistral_client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    return mistral_client


@app.post("/api/recommend/llm")
async def recommend_llm(req: ChatRequest, k: int = 5):
    index, df = load_data()
    model = load_model()
    client = get_mistral()

    conversation = req.history or []
    conversation.append({"role": "user", "content": req.message})

    query_prompt = "Extract a 3-5 word product search query.\n\n"
    for msg in conversation:
        query_prompt += f"{msg['role']}: {msg['content']}\n"

    query_response = client.chat.complete(
        model="mistral-small-latest",
        messages=[{"role": "user", "content": query_prompt}],
    )

    search_query = query_response.choices[0].message.content.strip()

    query_vector = model.encode([search_query])
    distances, indices = index.search(np.array(query_vector, dtype=np.float32), k)
    products = df.iloc[indices[0]].to_dict(orient="records")

    return {
        "reply": f"Here are some recommendations for '{search_query}'",
        "products": products,
        "search_query": search_query,
    }