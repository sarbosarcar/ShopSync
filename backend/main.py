from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import faiss
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import dotenv
import os

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

class ChatRequest(
    BaseModel
):
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