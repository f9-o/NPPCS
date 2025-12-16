# NPPCS: National Predictive Patient Care System (Enterprise v3.3)

## Overview
NPPCS (National Predictive Patient Care System) is an advanced, AI-driven command center dashboard designed to enhance national medical resilience. The system utilizes machine learning algorithms to forecast Emergency Department (ED) loads, optimize hospital resource allocation in real-time, and coordinate disaster response across regional health networks.

Currently in version **v3.3 Enterprise**, NPPCS features a fully localized bilingual interface (English/Arabic), multi-region support (Riyadh & Jeddah), and an integrated AI Voice Assistant for hands-free critical alerts. It fuses data from seven distinct operational streams—including live traffic, weather hazards, and CAD (Computer Aided Dispatch) feeds—to transform reactive medical operations into proactive, data-driven strategies.

## Table of Contents
1.  [Key Features](#key-features)
2.  [System Architecture](#system-architecture)
3.  [Technical Stack](#technical-stack)
4.  [Prerequisites](#prerequisites)
5.  [Installation and Deployment](#installation-and-deployment)
6.  [Usage Guide](#usage-guide)
7.  [License](#license)

## Key Features

### 1. Intelligent Command Center
* **Multi-Region Support:** Simultaneous monitoring of critical sectors (e.g., Central Region/Riyadh and Western Region/Jeddah) with auto-centering geospatial visualization.
* **Inter-Agency Integration:** A unified status panel linking Health sectors with Civil Defense (Fire), Red Crescent (EMS), and National Center for Meteorology (NCM).
* **Live Ticker Feed:** A real-time, scrolling news ticker displaying operational updates, weather warnings, and system status without cluttering the map.

### 2. Predictive AI Engine
* **7-Point Data Fusion:** Synthesizes inputs from Weather, Traffic, Major Events, Bed Capacity, Historical Trends, Live CAD, and Seasonal Patterns to calculate Risk Scores (0-100).
* **Hospital-Specific Modeling:** Deploys distinct regression models trained on individual facility patterns (e.g., Trauma Centers vs. General Hospitals).
* **Predictive Quality Score (PQS):** Forecasts critical metrics including Time-to-Assessment (TTA) and Ambulance Offload Times up to 90 minutes in advance.

### 3. Active Response Systems
* **AI Voice Assistant:** An integrated Text-to-Speech (TTS) engine that audibly announces critical alerts (e.g., "Critical Status Detected at King Fahad Hospital") to ensure operator attention.
* **Timed Alert Logic:** Generates graduated alerts at T-90 (Advisory), T-45 (Warning), and T-15 (Critical) intervals.
* **Inter-facility Transfer Logic:** Algorithms analyze network-wide capacity to recommend load-balancing transfers during saturation events.

## System Architecture
The solution is architected as a containerized microservices application:
* **Frontend Service:** A React 19 application built with Vite and Tailwind CSS, featuring a darker, high-contrast "Dark Mode" UI optimized for 24/7 command centers.
* **Backend Service:** A Python FastAPI application acting as the orchestration layer and hosting the NumPy-based inference engine.
* **Data Simulation:** A built-in engine generating realistic synthetic streams for load testing and demonstration.

## Technical Stack

### Frontend
* **Framework:** React 19 with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (with PostCSS & Autoprefixer)
* **Mapping:** Leaflet & React-Leaflet (CartoDB Dark Matter tiles)
* **Visualization:** Recharts (Radar & Area Charts)

### Backend & AI
* **Runtime:** Python 3.9
* **API:** FastAPI (Uvicorn ASGI)
* **Data Processing:** NumPy, Pandas
* **Logic:** Weighted Linear Regression & Normal Distribution Simulation

### DevOps
* **Containerization:** Docker
* **Orchestration:** Docker Compose
* **Optimization:** .dockerignore implementation for clean builds

## Prerequisites
Ensure the following tools are installed on the host machine:
* Docker Engine (v20.10+)
* Docker Compose (v2.0+)

## Installation and Deployment

The project is configured for rapid local deployment using Docker.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/f9-o/NPPCS.git
    ```
    ```bash
    cd NPPCS
    ```

2.  **Clean Build & Run**
    Execute the following command to remove any cached layers and build the enterprise version:
    ```bash
    docker-compose down --rmi all
    ```
    ```bash
    docker-compose build --no-cache
    ```
    ```bash
    docker-compose up
    ```

3.  **Verify Deployment**
    The terminal will display:
    `NPPCS SYSTEM ONLINE`
    `ACCESS DASHBOARD: http://localhost:8000`

## Usage Guide

### Accessing the Dashboard
* **URL:** http://localhost:8000

### Operational Controls
* **Fullscreen Mode:** Click the maximize icon in the navbar to enter immersive command center mode.
* **Voice Assistant:** Toggle the speaker icon to enable/disable audible alerts.
* **Region Selection:** Use the sidebar to instantly navigate between hospital facilities.
* **Language:** Toggle between English (LTR) and Arabic (RTL) for full localization.

## License
This project is distributed under the MIT License. See the LICENSE file for more details.

---
**Disclaimer:** This software is a prototype developed for Hackathon demonstration purposes. It utilizes simulated data streams and is intended to showcase architectural capabilities for national medical resilience.
