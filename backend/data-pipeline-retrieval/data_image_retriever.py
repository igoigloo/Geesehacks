import os
import sqlite3
import requests
import cv2
import torch
from ultralytics import YOLO
from time import sleep, strftime

# Paths and constants
db_path = r"backend\data\filtered_cameras.db"
images_folder = r"backend\data\images"
results_folder = r"backend\data\results"
base_image_url = "https://511on.ca/map/Cctv/"
model_path = r"backend\best.pt"

# Ensure the results folder exists
os.makedirs(results_folder, exist_ok=True)

# Load the YOLO model
model = YOLO(model_path)

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

def detect_car_crash(image_path, save_result_path):
    """
    Detect car crash in an image based on the presence of any detected objects using YOLO model.

    Args:
        image_path (str): Path to the image file.
        save_result_path (str): Path to save the detection results.
    Returns:
        bool: True if any object is detected, False otherwise.
    """
    results = model(image_path, save=True, save_txt=True, project=results_folder, name="detections")
    detections = results[0].boxes.data if results else []

    # Detect a crash if any objects are detected
    car_crash_detected = len(detections) > 0

    # Save the result image
    result_img_path = os.path.join(save_result_path, f"result_{os.path.basename(image_path)}")
    if car_crash_detected:
        cv2.imwrite(result_img_path, results[0].plot())
    return car_crash_detected


def update_database(camera_id, is_crash):
    """
    Update the database with accident status and the last updated time.

    Args:
        camera_id (int): ID of the camera.
        is_crash (bool): True if a crash is detected, False otherwise.
    """
    accident_status = "TRUE" if is_crash else "FALSE"
    last_updated_time = strftime("%H:%M")  # Current time in military format (HH:MM)

    cursor.execute("""
        UPDATE Cameras
        SET Accident = ?, last_updated = ?
        WHERE Id = ?
    """, (accident_status, last_updated_time, camera_id))
    connection.commit()

# Continuous loop for periodic updates
while True:
    print("Starting image processing and crash detection cycle...")

    # Connect to the database
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # Fetch all camera IDs from the Cameras table
    cursor.execute("SELECT Id FROM Cameras")
    camera_ids = cursor.fetchall()  # List of tuples

    # Process each camera
    for camera_id_tuple in camera_ids:
        camera_id = camera_id_tuple[0]
        image_url = f"{base_image_url}{camera_id}"
        image_save_path = os.path.join(images_folder, f"camera_{camera_id}.jpg")
        result_save_path = results_folder

        print(f"Processing camera ID {camera_id}...")

        # Download the image
        download_image(image_url, image_save_path)

        # Detect car crash in the image
        if os.path.exists(image_save_path):
            is_crash = detect_car_crash(image_save_path, result_save_path)
            update_database(camera_id, is_crash)
            status = "Crash Detected" if is_crash else "No Crash Detected"
            print(f"Camera ID {camera_id}: {status}")
        else:
            print(f"Image for Camera ID {camera_id} could not be processed.")

    # Close the database connection
    connection.close()

    print("Image processing and crash detection cycle completed.")
    print("Waiting for 8 minutes before the next cycle...")
    sleep(480)  # Wait for 8 minutes before the next update
