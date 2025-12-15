# -*- coding: utf-8 -*-
# === Model Training Script ===
# Author: Jaeden de Graft
# Description: Trains and exports a TensorFlow model for the gesture-to-speech project.
#
#  Pre-Reqs:
# Python 3.10, Keras 2.10.0, Numpy 1.23.5, Tensorflow 2.10.0, Tensorflowjs 3.11.0, scikit-learn 1.7.2 
#
# Current release of Tensorflowjs uses a deprecated method not available in Numpy 2+
# Downgrade required in order to train tensorflowjs model 

import os
import json
import numpy as np
import matplotlib.pyplot as plot
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow import keras
import tensorflow as tflow
import tensorflowjs

#Begins the hand gesture process#
print("\n\nExecuting Hand Gesture Training...")
print('-'*30)

#1) Loading the JSON datafile 
web_root="htdocs"
src_data = "Training_Model.json"
file_gesture_map=f"{web_root}/gestureMap.json"
file_scaler_stats=f"{web_root}/scaler_stats.json"
model_export_path = f"{web_root}/gestureModel"
labels, features = [], []

try:
    with open(src_data, "r") as p:
        data = json.load(p)
    for item in data:
        labels.append(item["label"])
        features.append(item["features"])
    print("\n\n")
    print('-'*30)
    print(f"{len(features)} gesture samples loaded...")
    print('-'*30)
except FileNotFoundError:
    print(F"Unable to find source JSON: {src_data}")

    
#2) Encoding data
gesture_map ={label: ids for ids, label in enumerate(sorted(set(labels)))}
features=np.array(features)
unique_labels = np.array([gesture_map[l] for l in labels ])

scaling = StandardScaler()
features = scaling.fit_transform(features)
scaler_stats = {
    "mean": scaling.mean_.tolist(),
    "std": scaling.scale_.tolist()
}


#3) Separating data to training and validation
features_data, features_eval, label_data, label_eval = train_test_split(features, unique_labels, test_size=0.25, random_state=42)

#4) Building the model
model = keras.Sequential([
    keras.layers.Dense(126, activation="relu"),
    keras.layers.Dense(126, activation="relu"),
    keras.layers.Dense(len(gesture_map), activation="softmax")
    ])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
    )


#5) Training the model
history = model.fit(features_data, label_data, epochs=25, validation_data=(features_eval, label_eval), verbose=1 )

#6) Exporting the model, Gesture Map, and Scalar Stats

tensorflowjs.converters.save_keras_model(model, model_export_path)

rev_map={str(v): k for k, v in gesture_map.items()}
with open(file_gesture_map,'w') as t:
    json.dump(rev_map,t)

with open(file_scaler_stats, "w") as s:
    json.dump(scaler_stats, s)

#7) Training & Visualization stats
statistics = {
"loss": history.history["loss"],
"val_loss": history.history["val_loss"],
"accuracy": history.history["accuracy"],
"val_accuracy": history.history["val_accuracy"]
}

plot.figure(figsize=(8, 5))
plot.plot(history.history["accuracy"], label="Train Accuracy", color="red")
plot.plot(history.history["val_accuracy"], label="Validation Accuracy", color="yellow")
plot.title("Model Accuracy Across Epochs")
plot.xlabel("Epoch")
plot.ylabel("Accuracy")
plot.legend()
plot.tight_layout()
plot.savefig("accuracy_plot.png")
plot.close()

currentDir = os.getcwd().replace('\\','/')
print("\n\nExports Complete!")
print('-'*30)
print(f"\nModel Files: {currentDir}/{model_export_path}\nGesture Map: {currentDir}/{file_gesture_map}\nScalar Stats: {currentDir}/{file_scaler_stats}\nTraining Plot: {currentDir}/accuracy_plot.png")



