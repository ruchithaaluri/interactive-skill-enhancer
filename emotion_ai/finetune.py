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

# -----------------------------------------
# Load Stage 1 Model
# -----------------------------------------

print("Loading Stage 1 Model...")

model = tf.keras.models.load_model(
    "saved_models/mobilenet_stage1.keras"
)

print("Model Loaded Successfully!")

# -----------------------------------------
# Find MobileNetV2 Backbone
# -----------------------------------------

base_model = None

for layer in model.layers:
    if isinstance(layer, tf.keras.Model):
        base_model = layer
        break

if base_model is None:
    raise ValueError("Could not find MobileNetV2 base model.")

print(f"Backbone: {base_model.name}")

# -----------------------------------------
# Unfreeze Last Layers
# -----------------------------------------

base_model.trainable = True

fine_tune_at = len(base_model.layers) - 40

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

print(f"Fine-tuning last {len(base_model.layers)-fine_tune_at} layers")

# -----------------------------------------
# Recompile
# -----------------------------------------

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=1e-5
    ),

    loss="categorical_crossentropy",

    metrics=[
        "accuracy"
    ]

)

# -----------------------------------------
# Callbacks
# -----------------------------------------

checkpoint = tf.keras.callbacks.ModelCheckpoint(

    filepath="saved_models/mobilenet_final.keras",

    monitor="val_accuracy",

    save_best_only=True,

    verbose=1

)

early_stop = tf.keras.callbacks.EarlyStopping(

    monitor="val_loss",

    patience=5,

    restore_best_weights=True,

    verbose=1

)

reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(

    monitor="val_loss",

    factor=0.3,

    patience=2,

    min_lr=1e-7,

    verbose=1

)

# -----------------------------------------
# Fine Tune
# -----------------------------------------

print("\nStarting Fine-Tuning...\n")

history = model.fit(

    train_dataset,

    validation_data=validation_dataset,

    epochs=10,

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
    "saved_models/mobilenet_final.keras"
)

# -----------------------------------------
# Accuracy Graph
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

plt.title("Fine-Tuning Accuracy")

plt.savefig(
    "graphs/finetune_accuracy.png"
)

plt.close()

# -----------------------------------------
# Loss Graph
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

plt.title("Fine-Tuning Loss")

plt.savefig(
    "graphs/finetune_loss.png"
)

plt.close()

print("\nFine-Tuning Completed Successfully!")

print("\nFinal model saved to:")
print("saved_models/mobilenet_final.keras")