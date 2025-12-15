# Sentinel: National Predictive Medical Response System

## Overview
Sentinel is a comprehensive, AI-driven command center dashboard designed to enhance national medical resilience. The system utilizes advanced predictive analytics to forecast Emergency Department (ED) loads, manage hospital resources in real-time, and coordinate disaster response across regional networks.

Developed as a bilingual platform (English and Arabic), Sentinel integrates seven distinct data streams—including live traffic, weather patterns, and historical admission data—to provide operational insights up to 90 minutes in advance. The system aims to transform reactive medical responses into proactive resource management strategies.

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
* **Hospital-Specific Modeling:** Utilizes distinct regression models trained for individual facility patterns rather than generic regional averages.
* **Seasonal Forecasting:** Incorporates seasonal coefficients to account for viral outbreaks (e.g., influenza seasons) and environmental factors.
* **Predictive Quality Score (PQS):** Forecasts critical performance metrics such as Time-to-Assessment (TTA) and Ambulance Offload Times, beyond simple census counts.

### Live Tactical Operations
* **Real-Time Geospatial Mapping:** Features a fully interactive map (v3.0) rendering live ambulance positions (CAD integration), hospital operational status, and dynamic weather hazard zones.
* **7-Point Data Fusion:** Synthesizes data from Weather, Traffic, Major Events, Bed Capacity, Historical Trends, Live CAD, and Seasonal Patterns.

### Decision Support
* **Inter-facility Transfer Logic:** Algorithms analyze network-wide capacity to recommend patient transfers from strained facilities to those with available specialized care.
* **Timed Alert System:** Generates graduated operational alerts at T-90 minutes (Advisory), T-45 minutes (Warning), and T-15 minutes (Critical) intervals.

## System Architecture
The solution is architected as a containerized microservices application:
* **Frontend Service:** A React-based Single Page Application (SPA) serving the dashboard and map interfaces.
* **Backend Service:** A Python FastAPI application acting as the orchestration layer and AI inference engine.
* **Data Simulation:** A built-in engine that generates realistic synthetic data streams for demonstration and stress testing purposes.

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

The project is designed for rapid local deployment using Docker.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/f9-o/NPPCS
    ```
    ```bash
    cd sentinel-platform
    ```

2.  **Build and Run Services**
    Execute the following command to build the containers and start the application in detached mode:
    ```bash
    docker-compose up --build -d
    ```

3.  **Verify Deployment**
    Ensure all containers are running:
    ```bash
    docker-compose ps
    ```

## Usage Guide

### Accessing the Dashboard
Once the containers are running, access the application via a web browser:
* **URL:** http://localhost:8000

### Operational Views
1.  **Command Center:** The landing page provides a high-level view of all regional hospitals, weather conditions, and active EMS units.
2.  **Hospital Detail View:** Select any hospital from the map to view detailed predictive analytics, including the 90-minute load forecast and specific operational alerts.
3.  **Language Toggling:** Use the toggle button in the navigation bar to switch the interface between English (LTR) and Arabic (RTL).

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

---
**Disclaimer:** This software is a prototype designed for demonstration and hackathon purposes. It uses simulated data and is not intended for use in actual clinical or emergency response environments without further validation and integration with live production systems.
