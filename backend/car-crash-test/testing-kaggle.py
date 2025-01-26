import cv2
from ultralytics import YOLO  # For YOLOv8
# For YOLOv5, import torch and the detection script

# Load the model
model = YOLO(r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\car-crash-test\best.pt")  # Adjust path if necessary

# Load the video
input_video_path = r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\car-crash-test\accident.mp4"  # Replace with your video file
output_video_path = r"C:\Users\igodo\OneDrive\Desktop\Github-repos\Geesehacks\backend\car-crash-test\output_video.mp4"  # Name of the output file

# Initialize video capture and writer
cap = cv2.VideoCapture(input_video_path)
fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # Codec for mp4
out = cv2.VideoWriter(output_video_path, fourcc, int(cap.get(cv2.CAP_PROP_FPS)), 
                      (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))

# Process the video frame by frame
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Run YOLO inference
    results = model(frame)

    # Visualize the results
    annotated_frame = results[0].plot()  # Annotate the frame with bounding boxes

    # Write the annotated frame to the output video
    out.write(annotated_frame)

    # Optionally display the frame
    cv2.imshow("Frame", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to quit early
        break

# Release resources
cap.release()
out.release()
cv2.destroyAllWindows()
