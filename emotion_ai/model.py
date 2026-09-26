import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.models import Model

IMG_SIZE = 224
NUM_CLASSES = 7


def build_model(training=True):

    # -----------------------------
    # MobileNetV2 Backbone
    # -----------------------------
    base_model = tf.keras.applications.MobileNetV2(

        input_shape=(IMG_SIZE, IMG_SIZE, 3),

        include_top=False,

        weights="imagenet"

    )

    # Freeze backbone (Stage 1)
    base_model.trainable = False

    # -----------------------------
    # Input Layer
    # -----------------------------
    inputs = tf.keras.Input(

        shape=(IMG_SIZE, IMG_SIZE, 3)

    )

    # MobileNet preprocessing
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)

    # Feature extractor
    x = base_model(x, training=False)

    # Global Average Pooling
    x = layers.GlobalAveragePooling2D()(x)

    # Dense Head
    x = layers.Dropout(0.4)(x)

    x = layers.Dense(

        256,

        activation="relu"

    )(x)

    x = layers.BatchNormalization()(x)

    x = layers.Dropout(0.3)(x)

    outputs = layers.Dense(

        NUM_CLASSES,

        activation="softmax"

    )(x)

    model = Model(inputs, outputs)

    # Store backbone for fine-tuning later
    model.base_model = base_model

    if training:

        model.compile(

            optimizer=tf.keras.optimizers.Adam(

                learning_rate=0.001

            ),

            loss="categorical_crossentropy",

            metrics=[

                "accuracy"

            ]

        )

    return model