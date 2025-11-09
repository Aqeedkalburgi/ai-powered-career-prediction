# Career Prediction Backend

FastAPI backend for the AI Career Prediction application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Place model files in `app/models/`:
   - `career_rf_model.joblib`
   - `role_label_encoder.joblib`

3. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `GET /` - Health check
- `POST /predict` - Get career predictions

