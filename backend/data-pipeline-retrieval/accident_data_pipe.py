import requests
import sqlite3

def get_cameras(api_url, format='json', lang='en'):
    """
    Fetch camera data from the Ontario 511 API.

    Args:
        api_url (str): The base URL of the API.
        format (str): The response format ('json' or 'xml'). Default is 'json'.
        lang (str): The language ('en' or 'fr'). Default is 'en'.

    Returns:
        list: List of filtered camera data dictionaries.
    """
    params = {
        'format': format,
        'lang': lang
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        cameras = response.json()

        # Filter for cameras with source "City of Toronto"
        filtered_cameras = [
            {
                'Id': camera.get('Id'),
                'Source': camera.get('Source'),
                'Location': camera.get('Location'),
                'Latitude': camera.get('Latitude'),
                'Longitude': camera.get('Longitude'),
            }
            for camera in cameras if camera.get('Source') == "City of Toronto"
        ]

        return filtered_cameras
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None

def display_camera_data(cameras):
    """
    Display filtered camera information.

    Args:
        cameras (list): List of filtered camera data dictionaries.
    """
    if not cameras:
        print("No camera data available.")
        return

    for camera in cameras:
        print(f"ID: {camera.get('Id')}")
        print(f"Source: {camera.get('Source')}")
        print(f"Location: {camera.get('Location')}")
        print(f"Coordinates: ({camera.get('Latitude')}, {camera.get('Longitude')})")
        print("-" * 40)

def add_columns_to_table(db_name=r"backend\data\filtered_cameras.db"):
    """
    Add 'Accident' and 'last_updated' columns to the Cameras table if they don't exist.

    Args:
        db_name (str): Name of the SQLite database file. Default is 'filtered_cameras.db'.
    """
    connection = sqlite3.connect(db_name)
    cursor = connection.cursor()

    # Add 'Accident' column if it doesn't exist
    cursor.execute("PRAGMA table_info(Cameras)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'Accident' not in columns:
        cursor.execute("ALTER TABLE Cameras ADD COLUMN Accident TEXT DEFAULT NULL")
        print("Column 'Accident' added to Cameras table.")

    # Add 'last_updated' column if it doesn't exist
    if 'last_updated' not in columns:
        cursor.execute("ALTER TABLE Cameras ADD COLUMN last_updated TEXT DEFAULT NULL")
        print("Column 'last_updated' added to Cameras table.")

    connection.commit()
    connection.close()

def save_to_database(cameras, db_name=r"backend\data\filtered_cameras.db"):
    """
    Save filtered camera data to a SQLite database.

    Args:
        cameras (list): List of filtered camera data dictionaries.
        db_name (str): Name of the SQLite database file. Default is 'filtered_cameras.db'.
    """
    connection = sqlite3.connect(db_name)
    cursor = connection.cursor()

    # Create table if it does not exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Cameras (
            Id INTEGER PRIMARY KEY,
            Source TEXT,
            Location TEXT,
            Latitude REAL,
            Longitude REAL
        )
    ''')

    # Add new columns if necessary
    add_columns_to_table(db_name)

    # Insert filtered camera data
    for camera in cameras:
        cursor.execute('''
            INSERT OR IGNORE INTO Cameras (Id, Source, Location, Latitude, Longitude)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            camera.get('Id'),
            camera.get('Source'),
            camera.get('Location'),
            camera.get('Latitude'),
            camera.get('Longitude')
        ))

    # Commit changes and close the connection
    connection.commit()
    connection.close()

if __name__ == "__main__":
    API_URL = "https://511on.ca/api/v2/get/cameras"

    print("Fetching filtered camera data from the Ontario 511 API...")
    filtered_camera_data = get_cameras(API_URL)

    if filtered_camera_data:
        print("\nFiltered Camera Data:")
        display_camera_data(filtered_camera_data)
        print("\nSaving filtered camera data to database...")
        save_to_database(filtered_camera_data)
        print("Filtered camera data saved successfully.")
    else:
        print("Failed to retrieve or filter camera data.")
