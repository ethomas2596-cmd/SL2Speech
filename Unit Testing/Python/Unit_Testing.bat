@echo off
CALL conda activate Project_env
SET TF_CPP_MIN_LOG_LEVEL=3

python -m UT1_Load_JSON -v
python -m UT2_Merge_JSON -v
python -m UT3_Tensor_Scaler_Stats -v
python -m UT4_Create_WAV_File -v
pause