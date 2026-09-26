# 🧠 Interactive Skill Enhancer
### *AI-Assisted Autism-Support Learning Environment & Observational Platform*

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)
![Godot](https://img.shields.io/badge/Godot-4.7-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

**Interactive Skill Enhancer** is a full-stack, AI-powered educational and observational platform designed to support children—specifically providing autism-support considerations—and their caregivers, parents, and educators.

---

## 🌟 Key Features

### 1. 🤖 Universal AI Tutor Engine
- **Multi-Tiered Answering**: Solves math, computer science, general science, geography, history, and social skills questions accurately.
- **AST Dynamic Math Solver**: Solves arithmetic (`15 + 27`), percentages (`20% of 150`), and square roots dynamically.
- **Voice Studio (Speech-to-Text & Speech Synthesis)**: Voice dictation mic for hands-free typing and instant text-to-speech read-aloud with an animated equalizer bar.

### 2. 🎭 3D Interactive Godot Avatar
- Powered by **Godot Engine 4.7** with the Quaternius 3D Doctor character (`Doctor_Male_Young.gltf`).
- Features an **8-State Animation Machine**: `IDLE`, `THINKING`, `TALKING`, `LISTENING`, `WALKING`, `ENCOURAGING`, `CELEBRATING`, and `ERROR`.

### 3. 📷 Real-Time Facial Affective Cue Recognition
- Live camera frame inference using a lightweight 7-class facial expression classification model (`emotion_model.keras`).
- Supports both 48x48 grayscale and 224x224 RGB input tensors.
- Displays model confidence percentages and 7-class probability breakdowns (*Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral*).

### 4. 📊 Zero Fake Data Progress Tracking
- **100% Measured Data**: All progress bars, active streaks, and learning time metrics are computed dynamically from real MongoDB interaction events.

### 5. 📄 Caregiver PDF Observational Reports
- Generates downloadable observational summary reports for caregivers and educators using ReportLab (`GET /report/pdf?days=7|30|90`).

### 6. ♿ Neurodiverse Accessibility & Sensory Controls
- **Sensory-Friendly Mode**: Dimmed background contrast and reduced motion for children with sensory sensitivities.
- **Dyslexia-Friendly Font**: High-legibility typography toggle.
- **Speech Rate Speed Adjuster**: Variable slider (`0.7x` slow speed to `1.3x`).

### 7. 🎯 Daily Adaptive Quests & Caregiver Observation Journal
- **Daily Micro-Learning Quest**: Interactive 3-question daily challenges with Web Audio chime feedback.
- **Caregiver Journal**: Date-stamped observational notes for tracking focus and communication milestones.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Lucide Icons, Web Speech API, Glassmorphism CSS |
| **Backend** | FastAPI, Python 3.11, Motor (Async MongoDB), ReportLab, OpenCV, TensorFlow/Keras |
| **3D Avatar** | Godot Engine 4.7, GDScript, GLTF Models |
| **DevOps & Containerization** | Docker, Nginx, Docker Compose |

---

## 🚀 Quickstart & Installation

### Option A: Running Locally

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

### Option B: One-Command Docker Deployment 🐳

Deploy the complete stack (Frontend, Backend, and MongoDB) using Docker Compose:

```bash
docker-compose up --build -d
```

- **Frontend App**: `http://localhost:80`
- **Backend API Docs (Swagger)**: `http://localhost:8000/docs`

---

## 🧪 Verification & Audit Scripts

To verify backend endpoints and deployment readiness:

```bash
# Run backend API health audit
python backend/verify_backend.py

# Run deployment readiness audit
python backend/verify_deployment_readiness.py

# Run AI answer capability test
python backend/test_ai_answers.py
```

---

## 🛡️ Observational Support Notice & Disclaimer

> **IMPORTANT DISCLAIMER:**
> This application is strictly an **educational and observational support tool**. It does **NOT** claim to diagnose autism, diagnose mental health conditions, or medically evaluate internal psychological states. All facial cue statistics are model-generated estimates to be reviewed in context by parents, caregivers, educators, or qualified healthcare professionals.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
