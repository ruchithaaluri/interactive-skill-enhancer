import os
import sys
import cv2
import numpy as np

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from utils import (
    load_model,
    preprocess_face,
    predict_emotion,
    print_probabilities
)

# ---------------------------------------
# Configuration
# ---------------------------------------

MODEL_PATH = "saved_models/mobilenet_final.keras"

# ---------------------------------------
# Check Arguments
# ---------------------------------------

if len(sys.argv) != 2:

    print("\nUsage:")
    print("python predict.py image.jpg\n")
    sys.exit()

image_path = sys.argv[1]

# ---------------------------------------
# Check Image
# ---------------------------------------

if not os.path.exists(image_path):

    print(f"Image not found: {image_path}")
    sys.exit()

# ---------------------------------------
# Load Model
# ---------------------------------------

model = load_model(MODEL_PATH)

# ---------------------------------------
# Load Image
# ---------------------------------------

image = cv2.imread(image_path)

if image is None:

    print("Could not read image.")
    sys.exit()

display = image.copy()

# ---------------------------------------
# Face Detection
# ---------------------------------------

face_cascade = cv2.CascadeClassifier(

    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"

)

gray = cv2.cvtColor(

    image,

    cv2.COLOR_BGR2GRAY

)

faces = face_cascade.detectMultiScale(

    gray,

    scaleFactor=1.2,

    minNeighbors=5,

    minSize=(80,80)

)

if len(faces) == 0:

    print("No face detected.")
    sys.exit()

# ---------------------------------------
# Largest Face
# ---------------------------------------

largest = max(

    faces,

    key=lambda f: f[2] * f[3]

)

x, y, w, h = largest

face = image[y:y+h, x:x+w]

# ---------------------------------------
# Prediction
# ---------------------------------------

processed = preprocess_face(face)

emotion, confidence, probabilities = predict_emotion(

    model,

    processed

)

# ---------------------------------------
# Print Result
# ---------------------------------------

print("\nPrediction")
print("---------------------------")

print(f"Emotion    : {emotion}")
print(f"Confidence : {confidence*100:.2f}%")

print_probabilities(probabilities)

# ---------------------------------------
# Draw
# ---------------------------------------

cv2.rectangle(

    display,

    (x,y),

    (x+w,y+h),

    (0,255,0),

    2

)

cv2.putText(

    display,

    f"{emotion} ({confidence*100:.1f}%)",

    (x,y-10),

    cv2.FONT_HERSHEY_SIMPLEX,

    0.8,

    (0,255,0),

    2

)

cv2.imshow(

    "Prediction",

    display

)

cv2.waitKey(0)

cv2.destroyAllWindows()