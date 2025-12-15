# -*- coding: utf-8 -*-
# === Unit test for Merge_JSON.py script ===
# Author: Kian Lewis
# Description: unit tests the Merge_JSON.py script functionality
#

import json
import sys
import unittest
import tempfile
import subprocess
from pathlib import Path

class TestMergeJson(unittest.TestCase):

    def test_merge_JSON(self):
        # Temporary directory for the test
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            # the Merge_JSON.py script specifically looks for this file in the 
            # active directory
            test_gestures = temp_path / "Gestures"
            test_gestures.mkdir()
            outfile = temp_path / "Training_Model.json"

            # test files to merge
            test_file_1 = test_gestures / "test_file_1.json"
            test_file_2 = test_gestures / "test_file_2.json"

            # test data to insert in the test files
            test_data_1 = [{"features": [1, 2, 3], "label": "A"}]
            test_data_2 = [{"features": [4, 5, 6], "label": "B"}]

            # write the data to file
            with open(test_file_1, 'w') as f:
                json.dump(test_data_1, f)
            with open(test_file_2, 'w') as f:
                json.dump(test_data_2, f)

            # sets a path to the Merge_JSON.py script directory
            base_directory = Path(__file__).parent

            # Run the Merge_JSON.py script
            subprocess.run([sys.executable, str(base_directory / "Dummy_Merge_JSON.py")], cwd=temp_path, check=True)

            # verify merged JSON
            with open(outfile, 'r') as f:
                test_data_merge = json.load(f)

            # assert the merge data
            print("==== Merge JSON Test ====\n")
            self.assertEqual(test_data_merge, test_data_1 + test_data_2)

if __name__ == "__main__":
    unittest.main()