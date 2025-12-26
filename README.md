# NCCPS: National Command Center for Patient Safety (MVP)

## Overview
NCCPS MVP is an advanced, AI-driven command center dashboard designed to enhance national medical resilience. The system utilizes machine learning algorithms to forecast Emergency Department (ED) loads, optimize hospital resource allocation in real-time, and coordinate disaster response across regional health networks.

Featuring a fully localized bilingual interface (English/Arabic), multi-region support (Riyadh & Jeddah), and an integrated AI Voice Assistant, NCCPS fuses data from seven distinct operational streams to transform reactive medical operations into proactive strategies.

## Strategic Roadmap 2030

### Phase 1: Foundation (Current MVP - Q1 2025)
* **Milestone:** Unified Command Dashboard for Riyadh & Jeddah.
* **Tech:** Real-time integration of weather, traffic, and hospital status.
* **Goal:** Predictive analytics for crisis management (90-min forecast).

### Phase 2: Integration (Q3 2025)
* **IoT Deployment:** Automated bed census and crowd monitoring using Edge Computing.
* **EMS Link:** Direct API integration with Red Crescent CAD systems for auto-dispatch.
* **Expansion:** Coverage of Eastern and Southern regions.

### Phase 3: Automation & Sovereign AI (2026)
* **Autonomous Dispatch:** AI-driven inter-facility transfers and evacuation protocols.
* **Blockchain:** Secure, immutable patient transfer records (HIPAA/GDPR compliant).
* **Digital Twins:** Virtual hospital simulations for disaster training.

## Key Features
* **Intelligent Command Center:** Monitoring of Riyadh & Jeddah sectors with inter-agency integration (Civil Defense, Red Crescent).
* **Predictive AI Engine:** 7-Point Data Fusion calculating Risk Scores and forecasting loads 90 minutes in advance.
* **Active Response:** AI Voice Assistant, timed alerts (T-90/T-45/T-15), and inter-facility transfer logic.

## Technical Stack
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Leaflet, Recharts.
* **Backend:** Python FastAPI, NumPy, Pandas.
* **DevOps:** Docker, Docker Compose.

## Installation
1.  Clone the repository.
2.  Run: `docker-compose up --build -d`
3.  Access: `http://localhost:8000`

---
**Disclaimer:** Prototype for demonstration purposes.