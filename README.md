# ShopSync

An AI-powered ecommerce platform featuring a React frontend and a FastAPI backend with a FAISS-based product recommender system.

## Prerequisites

- [Node.js](https://nodejs.org/) & npm
- [Python 3.8+](https://www.python.org/)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sarbosarcar/ShopSync.git
cd ShopSync
```

### 2. Frontend Setup

Open a terminal, install the npm packages, create a `.env` file, and start the frontend development server:

```bash
cd frontend

# Set up the required environment variable
echo "VITE_BACKEND_URL=http://localhost:8000" > .env

npm install
npm start  # or npm run dev
```

### 3. Backend Setup

Open a new terminal window/tab, configure the Python virtual environment, create a `.env` file, and start the FastAPI backend:

```bash
cd backend

# Set up the required environment variable
echo "FRONTEND_URL=http://localhost:5173" > .env

# Create and activate the virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# Ingest the products data
python3 ingest.py

# Run the FastAPI server
uvicorn main:app --reload
```

### 4. Test the Application

Once both servers are successfully running:
- **Frontend App:** Open `http://localhost:3000` or `http://localhost:5173` (depending on your Vite/React configuration) in your browser.
- **Backend API:** Access `http://127.0.0.1:8000/docs` to test the FastAPI endpoints via the interactive Swagger interface.
