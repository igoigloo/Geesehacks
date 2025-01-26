import sqlite3
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

TWILIO_ACCOUNT_SID = os.getenv("ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TOW_NUMBER= os.getenv("TOW_NUMBER")

# Enable CORS for the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the SQLite database
DATABASE_PATH = "data/cameras.db"

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


app.mount("/images", StaticFiles(directory="data/images"), name="images")

# Endpoint to list image filenames
@app.get("/image-list")
def get_image_list():
    image_folder = "data/images"
    try:
        # List all files in the directory
        images = [f for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
        return images
    except FileNotFoundError:
        return {"error": "Image folder not found."}
    

@app.post("/make-txt")
async def text_me(request: Request):
    data = await request.json()
    latitude = data.get("lat")
    longitude = data.get("lng")
    description = data.get("description")

    
    print("fire")
    # Twilio credentials
    account_sid = TWILIO_ACCOUNT_SID
    auth_token = TWILIO_AUTH_TOKEN
    client = Client(account_sid, auth_token)

    body_message = (
    f"Accident reported at location: {description}\n"
    f"Latitude: {latitude}\n"
    f"Longitude: {longitude}"
)
    try:
        # Sending the SMS
        message = client.messages.create(
            body=body_message,
            to=TOW_NUMBER,  # Your phone number
            from_=TWILIO_PHONE_NUMBER,  # Your Twilio phone number
        )
        return {"message": "Message sent successfully!", "sid": message.sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))