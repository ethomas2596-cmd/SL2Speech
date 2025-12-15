@echo off
conda create --name "Project_env" Python=3.10.0
CALL conda activate Project_env
pip install Keras==2.10.0 Numpy==1.23.5 Tensorflow==2.10.0 Tensorflowjs==3.11.0 scikit-learn==1.7.2 matplotlib