#!/usr/bin/env bash

set -e

# Start frontend in background
cd frontend
npm install
npm run build
npm start &   # or preview, depending on framework

# Start backend (MAIN PROCESS)
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 10000