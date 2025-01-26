We are creating a crash detector web app that will be used to detect crashes on roads, prodominantly on highways in Canada.

The app will be used to detect crashes on highways in Canada and will be used to alert the authorities to the location of the crash. For now, we will be using a static map of Canada and will be using the coordinates of the crash to alert the authorities to the location of the crash.

The backend can be run locally or on a cloud server. The backend will consist of python code that will be run on a cloud server or locally, for now all development will be done locally as to ensure the integrity of the code.

-sqlite
-python
-fastAPI
-uvicorn
-geopy

please refer to requirements.txt for more information.

for backend:
uvicorn main:app --reload


```mermaid
graph TD
    A[Start]:::start --> B[Fetch Camera Data]:::process
    B -->|API Call| C[Ontario 511 API]:::api
    C -->|Response| D[Parse JSON Data]:::process
    D --> E[Display Camera Data]:::display
    D --> F[Save to SQLite Database]:::database
    F --> G{Database Tables Exist?}:::decision
    G -->|No| H[Create Tables]:::database
    G -->|Yes| I[Insert Data into Tables]:::database
    H --> I
    I --> J[Commit and Close Database]:::database
    E --> K[End]:::ending
    J --> K

    classDef start fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#FFFFFF;
    classDef ending fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#FFFFFF;
    classDef process fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#FFFFFF;
    classDef api fill:#1976D2,stroke:#0D47A1,stroke-width:2px,color:#FFFFFF;
    classDef database fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#FFFFFF;
    classDef decision fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#FFFFFF;
    classDef display fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#FFFFFF;
