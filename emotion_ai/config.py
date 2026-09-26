import os

# =====================================================
# Dataset Configuration
# =====================================================

# Base dataset directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

# Training and Testing directories
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
TEST_DIR = os.path.join(DATASET_DIR, "test")

# Verify directories exist
if not os.path.exists(TRAIN_DIR):
    print(f"WARNING: TRAIN_DIR does not exist: {TRAIN_DIR}")

if not os.path.exists(TEST_DIR):
    print(f"WARNING: TEST_DIR does not exist: {TEST_DIR}")

# =====================================================
# Model Configuration
# =====================================================

IMG_SIZE = 224
BATCH_SIZE = 32
NUM_CLASSES = 7

# =====================================================
# Training Configuration
# =====================================================

EPOCHS_STAGE1 = 20
EPOCHS_STAGE2 = 10
LEARNING_RATE_STAGE1 = 0.001
LEARNING_RATE_STAGE2 = 0.0001

# =====================================================
# Model Save Configuration
# =====================================================

MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_STAGE1_PATH = os.path.join(MODELS_DIR, "mobilenet_stage1.keras")
MODEL_FINAL_PATH = os.path.join(MODELS_DIR, "mobilenet_final.keras")

# =====================================================
# Graphs/History Configuration
# =====================================================

GRAPHS_DIR = os.path.join(BASE_DIR, "graphs")
os.makedirs(GRAPHS_DIR, exist_ok=True)

# =====================================================
# Emotion Classes
# =====================================================

EMOTIONS = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]
