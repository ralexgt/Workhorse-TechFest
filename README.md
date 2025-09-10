# Workhorse TechFest – Predictive Analytics for Vehicle Dismantling

A full-stack project that applies **machine learning predictive analytics** to support decision-making in dismantling end-of-life vehicles. The system recommends optimal actions for each vehicle component—**reuse, recycle, or dispose**—based on profitability, environmental impact, and time efficiency.

Built as part of **Endava TechFest 2025**, the solution combines **machine learning (XGBoost)** with a **React frontend** and **Flask backend**, deployed in the **Azure Cloud Environment**.

---

## 🚗 Problem Statement

End-of-life vehicles pose challenges in sustainability and profitability.  
This project addresses:

- **How to maximize profit** from dismantled components.
- **How to minimize environmental impact** by prioritizing recycling/reuse.
- **How to optimize dismantling time** given a limited budget.

---

## ✨ Features

- **Interactive Frontend (React)**

  - Input vehicle details: brand, mileage, accident severity, rust level, and dismantling budget.
  - Display predictions in an intuitive dashboard.

- **Machine Learning (XGBoost)**

  - Trained on a dataset of **5,000 records**.
  - Predicts dismantling outcomes with probabilities and expected values.

- **Backend API (Flask)**

  - Exposes RESTful endpoints for model inference.
  - Handles data flow between frontend and ML model.

- **Deployment (Azure)**
  - Containerized and deployed to Azure for scalability and availability.

---

## 📊 Sample Input & Output

## Input (Form)

- Brand
- Manufacture Year
- Odometer (km)
- Vehicle Type (Combustion | EV | Hybrid)
- Rust level (0-5)
- Accident zone (None | Front | Rear | Side)
- Accident severity (0-5)
- Time budget (min)
- Flooded (boolean)

## Output Prediction (Dashboard)

- **Mandatory safety steps** before dismantling.
- Recommended **components to disDashboardmantle**, along with:
  - Time required
  - Expected profit
  - CO₂ savings
  - Success probability
- **Skipped components** are explained (negative profit or over time budget).

---

## 🛠 Tech Stack

| Layer            | Technologies                                  |
| ---------------- | --------------------------------------------- |
| Frontend         | React                                         |
| Backend API      | Python, Flask                                 |
| Machine Learning | XGBoost, Pandas, Scikit-learn                 |
| Cloud            | Azure App Services, Static Web Apps           |
| Deployment CI/CD | Github Actions                                |

---

## ⚙️ Architecture

```text
[React Frontend] ⇄ [Flask API Backend] ⇄ [XGBoost Model]
            |                           |
          Azure                       Azure
```

1. User inputs vehicle details via **React UI**.
2. Flask API sends input to **XGBoost model**.
3. Model returns dismantling recommendations (profit, CO₂ savings, time).
4. Results displayed in dashboard.

---

## 🚀 Setup & Installation Locally

### Prerequisites

- Node.js & npm
- Python 3.10+
- Azure CLI & Docker (for deployment)

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Environment Variables

Create a `.env` file in the backend with:

```
AZURE_STORAGE_KEY=your_key_here
MODEL_PATH=models/xgboost_model.pkl
```

---

## 🔬 Model Training

- Dataset: **5,000 dismantling records**.
- Features: Vehicle type, age, mileage, accident severity, rust level, flood history.
- Target: Profitability, time feasibility, and CO₂ impact of component recovery.
- Algorithm: **XGBoost** (gradient boosting).
- Evaluation: Accuracy, F1-score, and profit optimization metrics.

---

## ☁️ Deployment on Azure

1. Deploy Static Web Application for React
2. Deploy Web App for API
3. Push to Azure through CI/CD workflows.
4. Configure scaling & monitoring.

---

⚡ Developed for **Endava TechFest 2025** by the **GIT&RUN TEAM**

🌐 Check it Out
The live demo lives on: https://calm-pebble-07af23d03.1.azurestaticapps.net/
