# Global Seismic Monitor (GSM)

> A production-ready Full-Stack seismic monitoring platform, integrating USGS real-time data with interactive geospatial visualization.

![Status](https://img.shields.io/badge/status-production_ready-success)
![Docker](https://img.shields.io/badge/docker-compose-blue)
![Python](https://img.shields.io/badge/backend-FastAPI-green)
![React](https://img.shields.io/badge/frontend-React_%7C_Tailwind-blue)
![Postgres](https://img.shields.io/badge/database-PostgreSQL-336791)

## System Architecture

The project utilizes a containerized microservices architecture orchestrated via Docker Compose. The data flow follows an external API ingestion pattern (USGS) with local persistence to ensure high-performance visualization.

```mermaid
flowchart TD
    %% Styles
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef container fill:#f0fdf4,stroke:#16a34a,stroke-width:2px;
    classDef db fill:#fefce8,stroke:#ca8a04,stroke-width:2px;
    classDef external fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,stroke-dasharray: 5 5;

    subgraph External_Services ["External Services"]
        USGS["📡 USGS API<br/>(Earthquake Feed)"]:::external
    end

    subgraph Client_Side ["Client Side"]
        Browser["User Browser<br/>(React Dashboard)"]:::client
    end

    subgraph Docker_Infrastructure ["Docker Infrastructure"]
        direction TB
        
        Frontend["Frontend Service<br/>(Vite + React + Tailwind)<br/>Port: 5173"]:::container
        
        Backend["Backend API<br/>(FastAPI + Pydantic)<br/>Port: 8000"]:::container
        
        DB[("Database<br/>PostgreSQL 15)<br/>Port: 5432")]:::db
    end

    %% Data Flow
    Browser -- "1. Access Interface" --> Frontend
    Browser -- "2. Request Data (Axios)" --> Backend
    
    Backend -- "3. Query / Persistence (SQLAlchemy)" --> DB
    Backend -- "4. Sync Job (Requests)" --> USGS
```

## Database Schema (ERD)

```mermaid
erDiagram
    EARTHQUAKE {
        string id PK "Unique USGS ID (e.g., 'us1000abcd')"
        float magnitude "Richter Scale Value"
        string place "Description of location"
        datetime time "Event timestamp (UTC)"
        datetime updated "Last update timestamp"
        float latitude "Decimal Degrees"
        float longitude "Decimal Degrees"
        float depth "Depth in km"
        string url "USGS Event Page"
        json raw_data "Full original payload"
    }
```
## Synchronization Flow (Sequence)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as ⚛️ Frontend (React)
    participant API as 🐍 Backend (FastAPI)
    participant DB as 🐘 Database (Postgres)
    participant USGS as 📡 USGS API

    Note over User, UI: User initiates update
    User->>UI: Clicks "Sync Data" Button
    UI->>API: POST /api/v1/earthquakes/sync
    
    activate API
    Note right of API: Start ETL Process
    API->>USGS: GET /summary/all_hour.geojson
    activate USGS
    USGS-->>API: Returns GeoJSON FeatureCollection
    deactivate USGS

    loop For each Event
        API->>API: Validate Data (Pydantic)
        API->>DB: Upsert (Check ID -> Insert/Update)
    end

    API-->>UI: 200 OK { status: "success", new: 12 }
    deactivate API

    UI->>UI: Invalidate React Query Cache
    UI->>API: GET /api/v1/earthquakes
    activate API
    API->>DB: Select * FROM earthquakes
    DB-->>API: Return Records
    API-->>UI: Return JSON List
    deactivate API

    UI-->>User: Show Toast "Sync Completed"
    UI->>UI: Re-render Map & Charts
```

## Technical Design (Backend Classes)

```mermaid
classDiagram
    direction LR
    
    class EarthquakeBase {
        <<Pydantic Schema>>
        +str id
        +float magnitude
        +str place
        +datetime time
        +float lat
        +float lon
    }

    class EarthquakeCreate {
        <<DTO>>
        +validate()
    }

    class EarthquakeModel {
        <<SQLAlchemy ORM>>
        +String id PK
        +Float magnitude
        +String place
        +DateTime time
        +Float latitude
        +Float longitude
        +JSON raw_data
        +save()
    }

    EarthquakeBase <|-- EarthquakeCreate : Inherits
    EarthquakeCreate ..> EarthquakeModel : Transforms into
```

## Key Features

### Data Ingestion (Backend)
- Automated ETL: Dedicated Python service to fetch, clean, and normalize seismic data from USGS.

- Strict Validation: powered by Pydantic v2 to ensure geospatial data integrity.

- RESTful API: Endpoints automatically documented via Swagger UI.

### Visualization (Frontend)
- Geospatial Map: High-performance rendering with Leaflet and Dark Mode tiles.

- Analytical Dashboard: Time-series trends and magnitude distribution charts via Recharts.

- Reactive UX: Instant visual feedback (Toasts with Sonner) and client-side filtering.

- Design System: Modern UI built with Tailwind CSS v3.

## Tech Stack

Layer,Technology,Details
Infrastructure,Docker,"Docker Compose, Multi-stage builds"
Backend,Python 3.11,"FastAPI, SQLAlchemy, Alembic (Structure)"
Frontend,React 18,"Vite, TypeScript, React Query (TanStack)"
Database,PostgreSQL,Relational Geospatial Persistence


## Quick Start Guide

Prerequisites: Docker and Git only.

1.

```bash
git clone https://github.com/pablomigueldias/seismic-monitor
cd seismic-monitor
```
2.

```bash
docker compose up --build
```
3.

Access the Application:

- Main Dashboard: http://localhost:5173

- API Documentation: http://localhost:8000/docs


## Developed by Pablo Ortiz • 2026
