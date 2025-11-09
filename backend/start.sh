#!/bin/bash
# Start script for the FastAPI backend

uvicorn app.main:app --host 0.0.0.0 --port 8000

