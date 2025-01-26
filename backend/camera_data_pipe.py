import requests
import json
import sqlite3

def get_cameras(api_url, format='json', lang='en'):
    """
    Fetch camera data from the Ontario 511 API.

    Args:
        api_url (str): The base URL of the API.
        format (str): The response format ('json' or 'xml'). Default is 'json'.
        lang (str): The language ('en' or 'fr'). Default is 'en'.

    Returns:
        dict or None: Parsed JSON data if successful, None otherwise.
    """
    params = {
        'format': format,
        'lang': lang
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None

def display_camera_data(cameras):
    """
    Display information about cameras.

    Args:
        cameras (list): List of camera data dictionaries.
    """
    if not cameras:
        print("No camera data available.")
        return

    for camera in cameras:
        print(f"ID: {camera.get('Id')}")
        print(f"Source: {camera.get('Source')}")
        print(f"Roadway: {camera.get('Roadway')}")
        print(f"Direction: {camera.get('Direction')}")
        print(f"Location: {camera.get('Location')}")
        print(f"Coordinates: ({camera.get('Latitude')}, {camera.get('Longitude')})")
        print("Views:")
        for view in camera.get('Views', []):
            print(f"  - View ID: {view.get('Id')}")
            print(f"    URL: {view.get('Url')}")
            print(f"    Status: {view.get('Status')}")
            print(f"    Description: {view.get('Description')}\n")
        print("-" * 40)

def save_to_database(cameras, db_name=r"backend\data\cameras.db"):
    """
    Save camera data to a SQLite database.

    Args:
        cameras (list): List of camera data dictionaries.
        db_name (str): Name of the SQLite database file. Default is 'cameras.db'.
    """
    connection = sqlite3.connect(db_name)
    cursor = connection.cursor()

    # Create tables if they do not exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Cameras (
            Id INTEGER PRIMARY KEY,
            Source TEXT,
            Roadway TEXT,
            Direction TEXT,
            Latitude REAL,
            Longitude REAL,
            Location TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Views (
            ViewId INTEGER PRIMARY KEY,
            CameraId INTEGER,
            Url TEXT,
            Status TEXT,
            Description TEXT,
            FOREIGN KEY (CameraId) REFERENCES Cameras (Id)
        )
    ''')

    # Insert camera data
    for camera in cameras:
        cursor.execute('''
            INSERT OR IGNORE INTO Cameras (Id, Source, Roadway, Direction, Latitude, Longitude, Location)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            camera.get('Id'), #*
            camera.get('Source'),
            camera.get('Roadway'),
            camera.get('Direction'),
            camera.get('Latitude'), #*
            camera.get('Longitude'), #*
            camera.get('Location')
        ))

        for view in camera.get('Views', []):
            cursor.execute('''
                INSERT OR IGNORE INTO Views (ViewId, CameraId, Url, Status, Description)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                view.get('Id'),
                camera.get('Id'),
                view.get('Url'),
                view.get('Status'),
                view.get('Description')
            ))

    # Commit changes and close the connection
    connection.commit()
    connection.close()

if __name__ == "__main__":
    API_URL = "https://511on.ca/api/v2/get/cameras"

    print("Fetching camera data from the Ontario 511 API...")
    camera_data = get_cameras(API_URL)

    if camera_data:
        print("\nCamera Data:")
        display_camera_data(camera_data)
        print("\nSaving camera data to database...")
        save_to_database(camera_data)
        print("Camera data saved successfully.")
    else:
        print("Failed to retrieve camera data.")