from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
try:
    from app.utils.roadmap_data import roadmaps
except ImportError:
    from utils.roadmap_data import roadmaps

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and encoder
try:
    model_path = os.path.join(os.path.dirname(__file__), "models", "career_rf_model.joblib")
    encoder_path = os.path.join(os.path.dirname(__file__), "models", "role_label_encoder.joblib")
    
    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)
except FileNotFoundError as e:
    print(f"Warning: Model files not found: {e}")
    print("Please ensure career_rf_model.joblib and role_label_encoder.joblib are in backend/app/models/")
    model = None
    encoder = None

class SkillInput(BaseModel):
    Database_Fundamentals: int
    Computer_Architecture: int
    Distributed_Computing_Systems: int
    Cyber_Security: int
    Networking: int
    Software_Development: int
    Programming_Skills: int
    Project_Management: int
    Computer_Forensics_Fundamentals: int
    Technical_Communication: int
    AI_ML: int
    Software_Engineering: int
    Business_Analysis: int
    Communication_Skills: int
    Data_Science: int
    Troubleshooting_Skills: int
    Graphics_Designing: int

@app.get("/")
def read_root():
    return {"message": "Career Prediction API is running"}

@app.post("/predict")
def predict_career(input: SkillInput):
    if model is None or encoder is None:
        return {
            "error": "Model not loaded. Please ensure model files are available.",
            "top_k": [
                {"role": "Software Engineer", "probability": 0.4},
                {"role": "Data Scientist", "probability": 0.3},
                {"role": "AI ML Engineer", "probability": 0.3}
            ],
            "roadmap": roadmaps.get("Software Engineer", {})
        }
    
    # Convert input to numpy array
    feature_order = [
        "Database_Fundamentals", "Computer_Architecture", "Distributed_Computing_Systems",
        "Cyber_Security", "Networking", "Software_Development", "Programming_Skills",
        "Project_Management", "Computer_Forensics_Fundamentals", "Technical_Communication",
        "AI_ML", "Software_Engineering", "Business_Analysis", "Communication_Skills",
        "Data_Science", "Troubleshooting_Skills", "Graphics_Designing"
    ]
    
    x = np.array([[getattr(input, field) for field in feature_order]])
    
    # Get predictions
    probs = model.predict_proba(x)[0]
    top_idx = np.argsort(probs)[::-1][:3]
    
    # Get class names
    class_names = encoder.classes_
    top_roles = [class_names[i] for i in top_idx]
    
    # Get roadmap for primary role
    primary_role = top_roles[0]
    roadmap = roadmaps.get(primary_role, {})
    
    return {
        "top_k": [
            {"role": role, "probability": float(probs[idx])}
            for idx, role in zip(top_idx, top_roles)
        ],
        "roadmap": roadmap
    }

