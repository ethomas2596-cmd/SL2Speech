# -*- coding: utf-8 -*-
# === Unit test for loading JSON files===
# Author: Kian Lewis
# Description: tests for basic functionality used to load JSON files
# Uses the same method of loading JSON files that we use elsewhere

import json
import unittest
from pathlib import Path

class TestLoadJson(unittest.TestCase):
    # set file paths and the test data
    def setUp(self):
        self.test_path = Path("test_files")
        self.test_path.mkdir(exist_ok=True)
        self.test_file = self.test_path / 'test_load_json.json'

        # set the test data to write and load
        self.test_data = [{"features": [1.1, 2.2, 3.3], "label": "A"}]

    # test the load json functionality
    def test_load_json(self):
        # write test data to json
        with open(self.test_file, 'w') as f:
            json.dump(self.test_data, f)

        # load data from json
        with open(self.test_file, 'r') as f:
            loaded_data = json.load(f)
        
        # Assert test that the loaded data matches
        print("\n\n==== Load JSON Test ====\n")
        self.assertEqual(loaded_data, self.test_data)

if __name__ == "__main__":
    unittest.main()