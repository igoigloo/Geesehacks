import os
import sqlite3
import requests
from time import sleep

# Paths and constants
db_path = r"backend\data\filtered_cameras.db"  # Update this to your database path
images_folder = r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\data\images"
base_image_url = "https://511on.ca/map/Cctv/"

# Ensure the images folder exists
os.makedirs(images_folder, exist_ok=True)

def download_image(image_url, save_path, retries=3, delay=5):
    """
    Download an image from a URL with retries and save it locally.

    Args:
        image_url (str): The URL of the image to download.
        save_path (str): The local path where the image will be saved.
        retries (int): Number of retry attempts on failure.
        delay (int): Delay in seconds between retries.
    """
    for attempt in range(retries):
        try:
            response = requests.get(image_url, stream=True, timeout=10)
            response.raise_for_status()  # Raise an error for HTTP failures
            with open(save_path, 'wb') as image_file:
                for chunk in response.iter_content(1024):
                    image_file.write(chunk)
            print(f"Image downloaded and saved to {save_path}")
            return
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                sleep(delay)
            else:
                print(f"Failed to download image from {image_url} after {retries} attempts.")

# Connect to the database
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

# Fetch all camera IDs from the Cameras table
cursor.execute("SELECT Id FROM Cameras")
camera_ids = cursor.fetchall()  # List of tuples

# Loop through each camera ID and download its corresponding image
for camera_id_tuple in camera_ids:
    camera_id = camera_id_tuple[0]
    image_url = f"{base_image_url}{camera_id}"
    save_path = os.path.join(images_folder, f"camera_{camera_id}.jpg")
    
    print(f"Processing camera ID {camera_id}...")
    download_image(image_url, save_path)

# Close the database connection
connection.close()

print("Image download process completed.")
