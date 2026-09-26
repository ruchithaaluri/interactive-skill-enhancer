import os
import tensorflow as tf
import numpy as np
from sklearn.utils.class_weight import compute_class_weight

from config import (
    TRAIN_DIR,
    TEST_DIR,
    IMG_SIZE,
    BATCH_SIZE,
    NUM_CLASSES
)

AUTOTUNE = tf.data.AUTOTUNE

print("\n" + "="*60)
print("DATASET LOADING AND PREPROCESSING")
print("="*60)

# =====================================================
# Verify Directories Exist
# =====================================================

if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(f"Training directory not found: {TRAIN_DIR}")

if not os.path.exists(TEST_DIR):
    raise FileNotFoundError(f"Testing directory not found: {TEST_DIR}")

print(f"\n✓ Training directory: {TRAIN_DIR}")
print(f"✓ Testing directory: {TEST_DIR}")

# =====================================================
# Data Augmentation
# =====================================================

data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.10),
    tf.keras.layers.RandomZoom(0.10),
    tf.keras.layers.RandomContrast(0.10),
])

print("\n✓ Data augmentation pipeline created")

# =====================================================
# Training Dataset (with 80-20 split)
# =====================================================

print("\nLoading training dataset...")

train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    TRAIN_DIR,
    validation_split=0.20,
    subset="training",
    seed=42,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=True
)

print("✓ Training dataset loaded")

# =====================================================
# Validation Dataset (from 20% of training)
# =====================================================

print("Loading validation dataset...")

validation_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    TRAIN_DIR,
    validation_split=0.20,
    subset="validation",
    seed=42,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=True
)

print("✓ Validation dataset loaded")

# =====================================================
# Test Dataset
# =====================================================

print("Loading test dataset...")

test_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    TEST_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=False
)

print("✓ Test dataset loaded")

# =====================================================
# Get Class Names
# =====================================================

class_names = train_dataset.class_names

print("\n" + "="*60)
print("EMOTION CLASSES:")
print("="*60)
for i, emotion in enumerate(class_names):
    print(f"  {i}: {emotion}")

# =====================================================
# Preprocessing Function
# =====================================================

def preprocess(images, labels):
    """Preprocess images for MobileNetV2"""
    images = tf.cast(images, tf.float32)
    images = tf.keras.applications.mobilenet_v2.preprocess_input(images)
    return images, labels

# =====================================================
# Apply Preprocessing Pipeline
# =====================================================

print("\n" + "="*60)
print("APPLYING PREPROCESSING PIPELINE")
print("="*60)

# Training: augmentation + preprocessing + caching
train_dataset = train_dataset.map(
    lambda x, y: (data_augmentation(x, training=True), y),
    num_parallel_calls=AUTOTUNE
)

train_dataset = train_dataset.map(
    preprocess,
    num_parallel_calls=AUTOTUNE
)

train_dataset = train_dataset.cache().prefetch(AUTOTUNE)

print("✓ Training pipeline: augmentation → preprocess → cache → prefetch")

# Validation: preprocessing only
validation_dataset = validation_dataset.map(
    preprocess,
    num_parallel_calls=AUTOTUNE
)

validation_dataset = validation_dataset.cache().prefetch(AUTOTUNE)

print("✓ Validation pipeline: preprocess → cache → prefetch")

# Testing: preprocessing only
test_dataset = test_dataset.map(
    preprocess,
    num_parallel_calls=AUTOTUNE
)

test_dataset = test_dataset.cache().prefetch(AUTOTUNE)

print("✓ Test pipeline: preprocess → cache → prefetch")

# =====================================================
# Compute Class Weights (for imbalanced data)
# =====================================================

print("\n" + "="*60)
print("COMPUTING CLASS WEIGHTS")
print("="*60)

labels = []

# Load raw dataset to extract labels
raw_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    shuffle=False,
    label_mode="int"
)

for _, y in raw_dataset:
    labels.extend(y.numpy())

labels = np.array(labels)

# Compute balanced class weights
weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)

class_weights = {
    i: float(weights[i])
    for i in range(len(weights))
}

print("\nClass Weights (for handling imbalanced data):")
for k, v in sorted(class_weights.items()):
    print(f"  Class {k} ({class_names[k]:<8}): {v:.4f}")

# =====================================================
# Print Dataset Summary
# =====================================================

print("\n" + "="*60)
print("DATASET SUMMARY")
print("="*60)

print(f"\nTraining batches   : {len(train_dataset)}")
print(f"Validation batches : {len(validation_dataset)}")
print(f"Testing batches    : {len(test_dataset)}")

print(f"\nImage size         : {IMG_SIZE}x{IMG_SIZE}")
print(f"Batch size         : {BATCH_SIZE}")
print(f"Number of classes  : {NUM_CLASSES}")

print("\n✓ Dataset Loaded Successfully!")
print("="*60 + "\n")