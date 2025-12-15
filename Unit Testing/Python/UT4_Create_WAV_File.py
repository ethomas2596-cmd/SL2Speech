# -*- coding: utf-8 -*-
# === Unit test for Create_WAV_File.py script ===
# Author: Kian Lewis
# Description: unit tests the Create_WAV_File.py script functionality
#

import json
import sys
import unittest
import tempfile
import subprocess
from pathlib import Path

class TestCreateWavFile(unittest.TestCase):

    def test_create_wav(self):
        # Temporary directory for the test
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            test_htdocs = temp_path / "htdocs"
            test_htdocs.mkdir()
            test_TTSrecordings = test_htdocs / "TTSrecordings"
            test_TTSrecordings.mkdir()

            # create test gesture map for unit test
            test_gmap = {"1000": "TTS", "1001": "Unit", "1002": "Test"}
            with open(test_htdocs / "gestureMap.json", 'w') as f:
                json.dump(test_gmap, f)

            # set the path to the Create_WAV_File.py script directory
            base_directory = Path(__file__).parent

            # Run the Create_WAV_File.py script
            subprocess.run([sys.executable, str(base_directory / "Dummy_Create_WAV_File.py")], cwd=temp_path, check=True)

            # assert that each test gesture generated a .wav file
            print("==== Create WAV File Test ====\n")
            self.assertTrue((test_TTSrecordings / "TTS.wav").exists(), "TTS.wav was not created")
            self.assertTrue((test_TTSrecordings / "Unit.wav").exists(), "Unit.wav was not created")
            self.assertTrue((test_TTSrecordings / "Test.wav").exists(), "Test.wav was not created")

if __name__ == "__main__":
    unittest.main()