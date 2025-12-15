# -*- coding: utf-8 -*-
# === Merge JSON Script ===
# Author: Earl Thomas
# Description: Merges JSON files from the Gesture directory into a single JSON.
#

import json
import os
from glob import glob


# Gathers Data from Gesture directory
#==============================================================================================
GDir = "Gestures" 
outfile = "Training_Model.json"
json_files = glob(os.path.join(GDir, '*.json'))

print("Merging JSON Files...")
#==============================================================================================

data = []
total_samples = 0

# Combines JSON Files
#==============================================================================================
for file in json_files:
    with open(file, 'r') as f:
        file_data = json.load(f)    
        if isinstance(file_data, list):
            data.extend(file_data)
            total_samples += len(file_data)
            print(f"  - Added {len(file_data)} samples from {file}")
        else:
            print(f"  - Skipping {file}. Invalid Data type.")
#==============================================================================================

# Export JSON
#==============================================================================================
with open(outfile, 'w') as f:
    json.dump(data, f)
#==============================================================================================

print("\n--- Merge Complete ---")
print(f"Successfully merged data into: {outfile}")
print(f"Total samples combined: {total_samples}")