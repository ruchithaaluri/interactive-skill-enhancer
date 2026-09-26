import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import cv2
import time
import numpy as np
import tensorflow as tf
import mediapipe as mp
from collections import deque

# -----------------------------
# Configuration
# -----------------------------

IMG_SIZE = 224

EMOTIONS = [

    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Neutral",
    "Sad",
    "Surprise"

]

# -----------------------------
# Load Model
# -----------------------------

print("Loading model...")

model = tf.keras.models.load_model(
    "saved_models/mobilenet_final.keras"
)

print("Model Loaded!")

# -----------------------------
# MediaPipe Face Detection
# -----------------------------

mp_face = mp.solutions.face_detection

face_detector = mp_face.FaceDetection(

    model_selection=1,

    min_detection_confidence=0.6

)

# -----------------------------
# Webcam
# -----------------------------

camera = cv2.VideoCapture(0)

if not camera.isOpened():

    raise RuntimeError("Cannot open webcam")

# -----------------------------
# Prediction Smoothing
# -----------------------------

history = deque(maxlen=7)

# -----------------------------
# FPS
# -----------------------------

prev_time = time.time()

# -----------------------------
# Loop
# -----------------------------

while True:

    ret, frame = camera.read()

    if not ret:

        break

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    results = face_detector.process(rgb)

    if results.detections:

        for detection in results.detections:

            bbox = detection.location_data.relative_bounding_box

            h, w, _ = frame.shape

            x = int(bbox.xmin * w)

            y = int(bbox.ymin * h)

            width = int(bbox.width * w)

            height = int(bbox.height * h)

            x = max(0, x)
            y = max(0, y)

            face = frame[y:y+height, x:x+width]

            if face.size == 0:

                continue

            face = cv2.resize(

                face,

                (IMG_SIZE, IMG_SIZE)

            )

            face = cv2.cvtColor(

                face,

                cv2.COLOR_BGR2RGB

            )

            face = face.astype(np.float32)

            face = tf.keras.applications.mobilenet_v2.preprocess_input(face)

            face = np.expand_dims(face, axis=0)

            prediction = model.predict(

                face,

                verbose=0

            )[0]

            history.append(prediction)

            avg_prediction = np.mean(

                history,

                axis=0

            )

            emotion_index = np.argmax(avg_prediction)

            confidence = avg_prediction[emotion_index]

            emotion = EMOTIONS[emotion_index]

            # Box Color

            if emotion == "Happy":

                color = (0,255,0)

            elif emotion == "Sad":

                color = (255,0,0)

            elif emotion == "Angry":

                color = (0,0,255)

            elif emotion == "Surprise":

                color = (0,255,255)

            else:

                color = (255,255,0)

            cv2.rectangle(

                frame,

                (x,y),

                (x+width,y+height),

                color,

                2

            )

            text = f"{emotion} ({confidence*100:.1f}%)"

            cv2.putText(

                frame,

                text,

                (x,y-10),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.8,

                color,

                2

            )

            # -----------------------------
            # Probability Bars
            # -----------------------------

            start_y = 30

            for i, emo in enumerate(EMOTIONS):

                prob = avg_prediction[i]

                bar_width = int(prob * 180)

                yy = start_y + i * 30

                cv2.putText(

                    frame,

                    emo,

                    (10,yy),

                    cv2.FONT_HERSHEY_SIMPLEX,

                    0.5,

                    (255,255,255),

                    1

                )

                cv2.rectangle(

                    frame,

                    (90,yy-12),

                    (90+bar_width,yy),

                    (0,255,0),

                    -1

                )

                cv2.rectangle(

                    frame,

                    (90,yy-12),

                    (270,yy),

                    (255,255,255),

                    1

                )

    # -----------------------------
    # FPS
    # -----------------------------

    current = time.time()

    fps = 1 / (current - prev_time)

    prev_time = current

    cv2.putText(

        frame,

        f"FPS : {fps:.1f}",

        (10, frame.shape[0]-15),

        cv2.FONT_HERSHEY_SIMPLEX,

        0.7,

        (0,255,255),

        2

    )

    cv2.imshow(

        "Emotion Recognition",

        frame

    )

    key = cv2.waitKey(1)

    if key == ord("q"):

        break

camera.release()

cv2.destroyAllWindows()