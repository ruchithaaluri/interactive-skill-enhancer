import cv2
import time
import numpy as np
import tensorflow as tf

# ---------------------------------------------------
# Constants
# ---------------------------------------------------

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

# ---------------------------------------------------
# Load Model
# ---------------------------------------------------

def load_model(model_path):

    print("Loading Model...")

    model = tf.keras.models.load_model(model_path)

    print("Model Loaded Successfully!")

    return model


# ---------------------------------------------------
# Preprocess Face
# ---------------------------------------------------

def preprocess_face(face):

    face = cv2.cvtColor(

        face,

        cv2.COLOR_BGR2RGB

    )

    face = cv2.resize(

        face,

        (IMG_SIZE, IMG_SIZE)

    )

    face = face.astype(np.float32)

    face = tf.keras.applications.mobilenet_v2.preprocess_input(face)

    face = np.expand_dims(

        face,

        axis=0

    )

    return face


# ---------------------------------------------------
# Predict Emotion
# ---------------------------------------------------

def predict_emotion(model, face):

    prediction = model.predict(

        face,

        verbose=0

    )[0]

    emotion_index = np.argmax(prediction)

    emotion = EMOTIONS[emotion_index]

    confidence = prediction[emotion_index]

    return emotion, confidence, prediction


# ---------------------------------------------------
# Draw Bounding Box
# ---------------------------------------------------

def draw_prediction(

    frame,

    x,

    y,

    w,

    h,

    emotion,

    confidence

):

    color = (255,255,0)

    if emotion == "Happy":
        color = (0,255,0)

    elif emotion == "Sad":
        color = (255,0,0)

    elif emotion == "Angry":
        color = (0,0,255)

    elif emotion == "Surprise":
        color = (0,255,255)

    cv2.rectangle(

        frame,

        (x,y),

        (x+w,y+h),

        color,

        2

    )

    text = f"{emotion} ({confidence*100:.1f}%)"

    cv2.putText(

        frame,

        text,

        (x,y-10),

        cv2.FONT_HERSHEY_SIMPLEX,

        0.7,

        color,

        2

    )


# ---------------------------------------------------
# Probability Bars
# ---------------------------------------------------

def draw_probability_bars(

    frame,

    probabilities

):

    start_y = 30

    for i, emotion in enumerate(EMOTIONS):

        probability = probabilities[i]

        bar = int(probability * 180)

        y = start_y + i * 30

        cv2.putText(

            frame,

            emotion,

            (10,y),

            cv2.FONT_HERSHEY_SIMPLEX,

            0.5,

            (255,255,255),

            1

        )

        cv2.rectangle(

            frame,

            (90,y-12),

            (90+bar,y),

            (0,255,0),

            -1

        )

        cv2.rectangle(

            frame,

            (90,y-12),

            (270,y),

            (255,255,255),

            1

        )


# ---------------------------------------------------
# FPS
# ---------------------------------------------------

def calculate_fps(previous_time):

    current_time = time.time()

    fps = 1 / (current_time - previous_time)

    return fps, current_time


# ---------------------------------------------------
# Print Probabilities
# ---------------------------------------------------

def print_probabilities(probabilities):

    print("\nPrediction Probabilities\n")

    for emotion, probability in zip(

        EMOTIONS,

        probabilities

    ):

        print(

            f"{emotion:<10}: {probability*100:.2f}%"

        )