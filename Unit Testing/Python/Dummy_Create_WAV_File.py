# -*- coding: utf-8 -*-
# === Create WAV Files Script ===
# Author: Raynold J Dalton
# Description: Converts text values from the Gesture Map into WAV files.
#
import pyttsx3
import json
import os

print("\n\nCreating WAV Files...")
print('-'*30)


# Folder where WAV files will be saved
recording_path = "htdocs/TTSRecordings"

# Location of gesture map JSON file
gmap_path = "htdocs/gestureMap.json"

# --- Open the JSON file in read-only mode ---
with open(gmap_path, 'r') as file:
    data = json.load(file)  # Load JSON data into a Python variable

# --- Extract all the gesture labels (values) from the JSON ---
labels = list(data.values())

# --- Initialize the Text-to-Speech engine ---
engine = pyttsx3.init()

# --- Export each label into a WAV file ---
for label in labels:
    filename = os.path.join(recording_path, f"{label}.wav")
    filename=filename.replace('\\','/')
    engine.save_to_file(label, filename)
    print(f"Saved {filename}")

# --- Run and wait for all conversions to finish ---
engine.runAndWait()