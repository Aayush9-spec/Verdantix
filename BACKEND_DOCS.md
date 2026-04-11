# 🌱 Verdantix — Backend Documentation

Welcome to the technical documentation for the EarthLedger Agro backend. This system is a high-performance Flask-based API designed to provide carbon intelligence, weather insights, and agricultural optimization for farmers.

---

## 🏗️ Technical Architecture

The backend is built using **Python 3.10+** and **Flask**. It follows a modular service-oriented architecture where specialized logic is isolated into the `services/` directory.

### Core Components
- **Framework**: Flask (with CORS support)
- **ML Engine**: scikit-learn (Linear Regression)
- **Data Handling**: Pandas & NumPy
- **Persistence**: Joblib (for ML model), Local CSV (for training)
- **Integrations**: OpenWeather, Mapbox, Groq/OpenAI, ISRIC SoilGrids

---

## 🧠 ML Intelligence Pipeline

Version 5.0.0 of the backend uses a **Kaggle-Grounded ML Pipeline**.

1.  **Dataset**: The model is trained on `data.csv`, which contains real-world agricultural parameters (temperature, humidity, rainfall).
2.  **Feature Engineering**:
    -   `crop_id`: Encoded crop types (Rice, Wheat, Maize, Soybean).
    -   `fertilizer`: Binary flag based on humidity thresholds.
    -   `water`: Binary flag based on rainfall thresholds.
3.  **Model**: A **Linear Regression** model predicts a `carbon_score` (0-100) based on environmental and practice data.
4.  **Auto-Training**: The system automatically trains and saves `model.pkl` on its first run or if the model file is missing.

---

## 📡 API Reference

All requests should be sent to `http://localhost:5000`.

### 1. Health & Status
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Returns system health, version, and ML status. |
| `GET` | `/` | Core status and latest model accuracy. |

### 2. Core Intelligence
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/predict` | **Carbon Prediction**: Calculates credits and score for a specific farm configuration. |
| `POST` | `/optimize` | **Optimization**: Compares current practices vs. optimal (Organic + Irrigation) and shows % improvement. |
| `POST` | `/simulate` | **Multi-Scenario**: Batch process multiple farm configurations to find the best outcome. |

### 3. Environmental Services
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/weather` | **Weather & Recommendations**: Live weather data + 5 specific agricultural tips. |
| `GET` | `/dashboard` | **Analytics**: Historical trends, top crops, and total credit summary. |

### 4. Interactive Services
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chat` | **Multilingual Assistant**: AI-powered advice on soil, carbon, and crop management. |
| `POST` | `/sync` | **Offline Sync**: Processes a queue of pending predictions from the mobile client. |

---

## 🛠️ Setup & Execution

### Prerequisites
- Python 3.10+
- Virtual Environment (recommended)

### Installation
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Running the Server
```bash
python app.py
```
The server will start at `http://localhost:5000`.

---

## 🔌 Service Integrations

| Service | File | External API Used |
| :--- | :--- | :--- |
| **Weather** | `weather_service.py` | OpenWeatherMap |
| **Carbon** | `carbon_service.py` | Climate TRACE & Climatiq |
| **Chatbot** | `chatbot_service.py` | Groq (Llama 3) / OpenAI |
| **Soil** | `soil_service.py` | ISRIC SoilGrids |
| **Maps** | `maps_service.py` | Mapbox |

---

## 🧪 Testing

A validation script is provided in `test_backend.py`. To run all tests:
```bash
python test_backend.py
```

---

*Documentation Version: 5.0.0 | Last Updated: April 10, 2026*
