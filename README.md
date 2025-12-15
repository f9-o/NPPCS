# NPPCS: National Predictive Patient Care System

## Overview
NPPCS (National Predictive Patient Care System) is an advanced, AI driven command center dashboard designed to enhance national medical resilience. The system utilizes machine learning algorithms to forecast Emergency Department (ED) loads, optimize hospital resource allocation in real-time, and coordinate disaster response across regional health networks.

Developed as a bilingual platform (English and Arabic), NPPCS integrates seven distinct operational data streams—including live traffic, weather patterns, and historical admission data to provide actionable insights up to 90 minutes in advance. The system transforms reactive medical operations into proactive, data driven strategies.

## Table of Contents
1.  [Key Features](#key-features)
2.  [System Architecture](#system-architecture)
3.  [Technical Stack](#technical-stack)
4.  [Prerequisites](#prerequisites)
5.  [Installation and Deployment](#installation-and-deployment)
6.  [Usage Guide](#usage-guide)
7.  [License](#license)

## Key Features

### Predictive AI Engine
* **Hospital-Specific Modeling:** Deploys distinct regression models trained on individual facility data patterns, accounting for local variables rather than regional averages.
* **Seasonal Forecasting:** Incorporates seasonal coefficients to adjust predictions for periodic health trends (e.g., influenza seasons) and environmental factors.
* **Predictive Quality Score (PQS):** Forecasts critical performance metrics including Time-to-Assessment (TTA) and Ambulance Offload Times, providing a deeper metric than simple census counts.

### Live Tactical Operations
* **Real-Time Geospatial Mapping:** Features a dynamic tactical map (v3.0) that renders live ambulance positions via CAD integration, visualizes hospital operational status, and overlays dynamic weather hazard zones.
* **7-Point Data Fusion:** Synthesizes data from Weather services, Traffic feeds, Major Events calendars, Bed Capacity logs, Historical Trends, Live CAD streams, and Seasonal Patterns.

### Decision Support
* **Inter-facility Transfer Logic:** Algorithms analyze network-wide capacity to identify saturation points and recommend patient transfers to facilities with available specialized care.
* **Timed Alert System:** Generates graduated operational alerts at T-90 minutes (Advisory), T-45 minutes (Warning), and T-15 minutes (Critical) intervals to preempt overcrowding.

## System Architecture
The solution is architected as a containerized microservices application:
* **Frontend Service:** A React-based Single Page Application (SPA) providing the dashboard and geospatial visualizations.
* **Backend Service:** A Python FastAPI application serving as the orchestration layer and hosting the AI inference engine.
* **Data Simulation:** A built-in engine capable of generating realistic synthetic data streams for demonstration, load testing, and hackathon presentation purposes.

## Technical Stack

### Frontend
* **Framework:** React 19 with TypeScript
* **Build Tool:** Vite
* **State Management:** React Hooks
* **Visualization:** Recharts (Analytics), Leaflet & React-Leaflet (Mapping)
* **Styling:** Tailwind CSS

### Backend & AI
* **Runtime:** Python 3.9
* **API Framework:** FastAPI
* **Data Processing:** Pandas, NumPy
* **Machine Learning:** Scikit-learn (Regression & Time-series forecasting)

### DevOps & Infrastructure
* **Containerization:** Docker
* **Orchestration:** Docker Compose
* **Server:** Uvicorn (ASGI)

## Prerequisites
Ensure the following tools are installed on the host machine:
* Docker Engine (v20.10+)
* Docker Compose (v2.0+)

## Installation and Deployment

The project is configured for rapid local deployment using Docker containers.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/f9-o/NPPCS.git
    ```
    ```bash
    cd NPPCS
    ```

2.  **Build and Run Services**
    Execute the following command to build the images and start the application in detached mode:
    ```bash
    docker-compose up --build -d
    ```

3.  **Verify Deployment**
    Check the status of the containers to ensure they are active:
    ```bash
    docker-compose ps
    ```

## Usage Guide

### Accessing the Dashboard
Once the system is running, access the user interface via a web browser:
* **URL:** http://localhost:8000

### Operational Views
1.  **Command Center:** The primary dashboard provides a high-level view of all regional hospitals, current weather impact, and active EMS units.
2.  **Hospital Detail View:** Select any hospital facility from the map to access detailed predictive analytics, including the 90-minute load forecast and facility-specific alerts.
3.  **Language Toggling:** Use the toggle button in the navigation bar to switch the interface between English (LTR) and Arabic (RTL) modes.

## License
This project is distributed under the MIT License. See the LICENSE file for more details.

---
**Disclaimer:** This software is a prototype developed for demonstration purposes. It utilizes simulated data streams and is not intended for deployment in clinical or emergency response environments without rigorous validation and integration with production systems.
