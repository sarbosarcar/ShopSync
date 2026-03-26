# FastAPI + React Backend Setup & Vector DB Integration Guide

This guide details how to implement the backend services for the AI Recommender.

## Architecture
1. **Python FastAPI Backend**: REST API connecting the frontend with your AI logic.
2. **Vector DB (FAISS)**: Stores text embeddings of your product descriptions for extremely fast semantic search.
3. **Embeddings Model**: `sentence-transformers` uses an open-source model locally to convert text queries into vectors.

---

### Step 1: Initialize FastAPI Service

Navigate to a new folder outside `src` and initialize Python:

```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic faiss-cpu sentence-transformers pandas
```

---

### Step 2: Ingest CSV Products into FAISS DB

Create a python script `ingest.py` to convert a `products.csv` into a FAISS index.

```python
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load Mock CSV Data
df = pd.read_csv('products.csv')

# Load Embedding Model using CPU
model = SentenceTransformer('all-MiniLM-L6-v2')

# Create embeddings from product descriptions
descriptions = df['description'].tolist()
print("Generating Embeddings...")
embeddings = model.encode(descriptions)

# Create highly efficient vector DB using FAISS
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings, dtype=np.float32))

# Save local state
faiss.write_index(index, 'products.index')
df.to_json('products.json', orient='records')
print("Vector DB successfully populated!")
```

Run it via `python ingest.py`.

---

### Step 3: Implement the API (`main.py`)

This creates the webserver and endpoints required by the frontend `ChatUI.jsx`.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import faiss
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np

app = FastAPI()

# Enable CORS for local React testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index('products.index')
df = pd.read_json('products.json')

class ChatRequest(BaseModel):
    message: str

@app.post("/api/recommend")
async def recommend(req: ChatRequest):
    # Retrieve user query embedding
    query_vector = model.encode([req.message])
    
    # Search Vector DB
    k = 2 # Returns top 2 items
    distances, indices = index.search(np.array(query_vector, dtype=np.float32), k)
    
    # Send matches back to React
    recommended = df.iloc[indices[0]].to_dict(orient='records')
    
    return {
        "reply": f"Based on your request '{req.message}', here are the top matches from our catalog.",
        "products": recommended
    }
```

---

### Step 4: Run the Server

```bash
uvicorn main:app --reload --port 8000
```

---

### Step 5: Web App Implementation

In `src/components/ChatUI.jsx`, replace the `setTimeout` mock block within `handleSend` with the API call:

```javascript
try {
  const res = await fetch('http://localhost:8000/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMsg })
  });
  
  if (!res.ok) throw new Error("API Network request failed");
  
  const data = await res.json();
  
  setMessages(prev => [
    ...prev, 
    { role: 'bot', text: data.reply, products: data.products }
  ]);
} catch (error) {
  setMessages(prev => [
    ...prev, 
    { role: 'bot', text: "Sorry, the recommender service is unavailable." }
  ]);
} finally {
  setIsTyping(false);
}
```
