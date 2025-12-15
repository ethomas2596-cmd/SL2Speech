### Sign-Language to Speech Interpreter Application ###

This document provides instructions for installing, accessing, and managing the Sign-Language to Speech Interpreter Application. The purpose of this web application is to host the core service that interprets sign language gestures captured via a webcam and converts them into spoken speech.

Any mention of "sl2speech" as a directory refers to the root directory containing the project files.

### Installation Instructions ###

    Please follow the steps below to install and start the web service.

        1. Navigate to the configuration directory:
    
                sl2Speech\Apache24\conf

        2. Edit the httpd.conf file.
            Change the SRVROOT value to the absolute local path of your sl2speech directory.
     
            Example:
            
                Define SRVROOT "C:\sl2speech"

        3. Save the changes to httpd.conf.
        4. Open Command Prompt with Administrator privileges.
        5. Navigate to the Apache binary directory in the Command Prompt:
            
                sl2Speech\Apache24\bin

        6. Execute the following command to install and start the Apache service:
            
                httpd.exe -k install && sc start Apache2.4

### Accessible Web Pages ###

    https://localhost 

        The link above will route the user to the main interface of the web application. It will prompt the user to access their web camera in the web browser and begin extracting the hand landmarks to translate the gesture. Translation will be displayed in text below the camera display and read aloud.
    
    https://localhost/GRecord

        The link above will be used to record new gestures for the prediction model. Landmarks of the hand gesture will be extracted and stored as samples. The interface allows the user to record the gesture and extract the hand landmarks into a JSON file. In testing, approximately 1500-2000 samples provide accurate predictions. 

### Service Management ###

    You can manage (Stop, Start, Restart, Uninstall) the Apache web service using the Command Prompt, Task Manager, or the Windows Services panel. 
    
                *** All Command Prompt commands require Administrator privileges ***

        #### 1. Using Command Prompt (httpd.exe and sc commands) ###

            ***Navigate to the Apache binary directory (sl2Speech\Apache24\bin) before running these commands.

            Start Service
                
                httpd.exe -k start OR sc start Apache2.4

            Stop Service  
                
                httpd.exe -k stop OR sc stop Apache2.4

            Restart Service  
                
                httpd.exe -k restart OR sc stop Apache2.4 && sc start Apache2.4 

            Uninstall Service 

                httpd.exe -k uninstall OR sc delete Apache2.4 

        #### 2. Using Windows Services ###

            1. Open Start menu and type services, and press Enter.
            2. Locate the service named Apache2.4
            3. Right-click on the service and select Start, Stop, or Restart

        #### 3. Using Task Manager (To stop a running process) ###

            1. Press Ctrl + Shift + Esc to open Task Manager.
            2. Go to the Services tab.
            3. Look for any running processes named httpd.exe.
            4. Right-click on the service and select Start, Stop, or Restart

        #### 4. Using Bat files ###
            
            ### Create ###

            1. Navigate to the application directory
            2. Right click the create_service.bat file and run as Administrator

            ### Start ###

            1. Navigate to the application directory
            2. Right click the start_services.bat file and run as Administrator

            ### Stop ###

            1. Navigate to the application directory
            2. Right click stop_services.bat file and run as Administrator

### Model Training ###

        ### Building Training Environment ###

            1. Navigate to application directory and execute install_anaconda.bat as Administrator
            2. Open Anaconda Prompt
            3. Navigate to application directory in Anaconda Prompt and execute build_env.bat

                - If Anaconda Prompt displays (base) C:\sl2speech, execute the commands below:

                    conda activate Project_Env
                    pip install Keras==2.10.0 Numpy==1.23.5 Tensorflow==2.10.0 Tensorflowjs==3.11.0 scikit-learn==1.7.2 matplotlib

        ### Training the Model ###

            1. Open Anaconda Prompt and navigate to the application directory

                - If Anaconda prompt is not available in the Start Menu, please refer to the "Build Training Environment" instructions above

            2. Execute the CTE.bat as Administrator

                Combine, Train, and Export Workflow:

                    1. Merge_JSON.py
                        - Merges all source JSON files located in the Gestures directory into a single JSON file
                        - Source data will be used to train prediction model in the Model_Training.py

                    2. Model_Training.py
                        - Retrieves source JSON file exported from Merge_JSON.py script to compile and train prediction model
                        - Exports Gesture Map JSON, Scalar Stats JSON, Model Files, and Accuracy plot to Apache24/htdocs once complete. File Paths will be displayed upon completion 

                    3. Create_WAV_Files.py
                        - Retrieves Gesture Map JSON file to create audio recordings using pyttsx3

                        - Recordings will be exported to Apache24/htdocs/TTSRecodings once complete
