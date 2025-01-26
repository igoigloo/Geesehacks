import requests

def download_image(image_url, save_path):
    """
    Download an image from a URL and save it locally.

    Args:
        image_url (str): The URL of the image to download.
        save_path (str): The local path where the image will be saved.
    """
    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()  # Raise an error for bad responses

        with open(save_path, 'wb') as image_file:
            for chunk in response.iter_content(1024):
                image_file.write(chunk)
        
        print(f"Image downloaded and saved to {save_path}")
    except requests.exceptions.RequestException as e:
        print(f"Error downloading the image: {e}")

if __name__ == "__main__":
    image_url = "https://511on.ca/map/Cctv/785"
    save_path = "camera_785.jpg"

    print(f"Downloading image from {image_url}...")
    download_image(image_url, save_path)
