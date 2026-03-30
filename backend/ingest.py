import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

df = pd.read_csv('data/merged_dataset_with_id.csv')

model = SentenceTransformer('all-MiniLM-L6-v2', device='mps')

descriptions = df['name'].tolist()
print("Generating Embeddings...")
embeddings = model.encode(descriptions)

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings, dtype=np.float32))

faiss.write_index(index, 'data/products.index')
df.to_json('data/products.json', orient='records')
print("Vector DB successfully populated!")