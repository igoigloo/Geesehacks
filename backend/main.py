import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the SQLite database
DATABASE_PATH = "/Users/manveersohal/Geesehacks/backend/data/cameras.db"

# Function to connect to the database
def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row  # Allows column access by name
    return connection

# Route to get all cameras
@app.get("/cameras/")
def read_all_cameras():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM Cameras")
        cameras = cursor.fetchall()
        return [dict(row) for row in cameras]  # Convert rows to dictionaries
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        connection.close()

# Route to get a camera by ID
@app.get("/cameras/{camera_id}")
def read_camera_by_id(camera_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM Cameras WHERE Id = ?", (camera_id,))
        camera = cursor.fetchone()
        if camera is None:
            raise HTTPException(status_code=404, detail="Camera not found")
        return dict(camera)  # Convert row to dictionary
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        connection.close()
