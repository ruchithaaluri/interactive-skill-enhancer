import os

# -----------------------------------------
# CPU Only
# -----------------------------------------
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import matplotlib.pyplot as plt

from preprocess import (
    train_dataset,
    validation_dataset,
    class_weights
)

from model import build_model

# -----------------------------------------
# Create folders
# -----------------------------------------

os.makedirs("saved_models", exist_ok=True)
os.makedirs("graphs", exist_ok=True)

# -----------------------------------------
# Build Model
# -----------------------------------------

model = build_model(training=True)

model.summary()

# -----------------------------------------
# Callbacks
# -----------------------------------------

checkpoint = tf.keras.callbacks.ModelCheckpoint(

    filepath="saved_models/mobilenet_stage1.keras",

    monitor="val_accuracy",

    save_best_only=True,

    verbose=1

)

early_stop = tf.keras.callbacks.EarlyStopping(

    monitor="val_loss",

    patience=6,

    restore_best_weights=True,

    verbose=1

)

reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(

    monitor="val_loss",

    factor=0.5,

    patience=3,

    min_lr=1e-6,

    verbose=1

)

# -----------------------------------------
# Train
# -----------------------------------------

print("\nStarting Stage 1 Training...\n")

history = model.fit(

    train_dataset,

    validation_data=validation_dataset,

    epochs=20,

    class_weight=class_weights,

    callbacks=[

        checkpoint,

        early_stop,

        reduce_lr

    ]

)

# -----------------------------------------
# Save Final Model
# -----------------------------------------

model.save(

    "saved_models/mobilenet_stage1_final.keras"

)

# -----------------------------------------
# Plot Accuracy
# -----------------------------------------

plt.figure(figsize=(8,5))

plt.plot(
    history.history["accuracy"],
    label="Training Accuracy"
)

plt.plot(
    history.history["val_accuracy"],
    label="Validation Accuracy"
)

plt.legend()

plt.grid(True)

plt.title("Stage 1 Accuracy")

plt.savefig("graphs/stage1_accuracy.png")

plt.close()

# -----------------------------------------
# Plot Loss
# -----------------------------------------

plt.figure(figsize=(8,5))

plt.plot(
    history.history["loss"],
    label="Training Loss"
)

plt.plot(
    history.history["val_loss"],
    label="Validation Loss"
)

plt.legend()

plt.grid(True)

plt.title("Stage 1 Loss")

plt.savefig("graphs/stage1_loss.png")

plt.close()

print("\nStage 1 Training Completed Successfully!")

print("\nBest model saved to:")
print("saved_models/mobilenet_stage1.keras")