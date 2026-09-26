import os

# -----------------------------------------
# CPU Only
# -----------------------------------------

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

from preprocess import (
    test_dataset,
    class_names
)

# -----------------------------------------
# Load Model
# -----------------------------------------

print("Loading Model...")

model = tf.keras.models.load_model(
    "saved_models/mobilenet_final.keras"
)

print("Model Loaded!")

# -----------------------------------------
# Evaluate
# -----------------------------------------

loss, accuracy = model.evaluate(
    test_dataset,
    verbose=1
)

print("\n====================================")
print(f"Test Accuracy : {accuracy:.4f}")
print(f"Test Loss     : {loss:.4f}")
print("====================================")

# -----------------------------------------
# Predictions
# -----------------------------------------

y_true = []
y_pred = []

for images, labels in test_dataset:

    predictions = model.predict(
        images,
        verbose=0
    )

    y_true.extend(
        np.argmax(labels.numpy(), axis=1)
    )

    y_pred.extend(
        np.argmax(predictions, axis=1)
    )

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# -----------------------------------------
# Classification Report
# -----------------------------------------

print("\nClassification Report\n")

print(

    classification_report(

        y_true,

        y_pred,

        target_names=class_names,

        digits=4

    )

)

# -----------------------------------------
# Confusion Matrix
# -----------------------------------------

cm = confusion_matrix(
    y_true,
    y_pred
)

disp = ConfusionMatrixDisplay(

    confusion_matrix=cm,

    display_labels=class_names

)

plt.figure(figsize=(9,9))

disp.plot(
    cmap="Blues",
    xticks_rotation=45
)

plt.tight_layout()

os.makedirs(
    "graphs",
    exist_ok=True
)

plt.savefig(
    "graphs/confusion_matrix.png"
)

plt.show()

print("\nConfusion matrix saved in graphs/")