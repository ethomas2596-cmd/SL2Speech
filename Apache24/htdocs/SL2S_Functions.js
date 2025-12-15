/*
SL2Speech Javascript Functions
Author: Earl Thomas
CMSC 495 7385
University of Maryland Global Campus
Description: Supporting functions for the SL2Speech Web Applications

*Note: Initializing web camera and load required files functions still need to be created. Functions are currently still in index.html to 
       ensure the application functions properly. Due to the time constraints of Source Code I, functions will be added in next sprint prior 
       to Source Code II submission.
*/
import { FilesetResolver, HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js"


//Global Vars
let predictionOut
let confidenceOut
let values
let isPlaying
let handLandmarker
let trainingData = []
const mp_model_url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
let isRecording
let labelName
let lastVideoTime
let sampleCount
let downloadButton

//Refreshes elements for Main Interface
export async function initMainValues() {

    const p_model_path = "../gestureModel/model.json"
    const gesture_map_path = "../gestureMap.json"
    const scalar_stats_path = "../scaler_stats.json"
    const scalarStats = await loadJSON(scalar_stats_path)
    values = {
        "model": await tf.loadLayersModel(p_model_path),
        "player": document.getElementById('player'),
        "labelMap": await loadJSON(gesture_map_path),
        "scalarMean": scalarStats.mean,
        "scalarStd": scalarStats.std
    }
    predictionOut = document.getElementById("predictionOut")
    confidenceOut = document.getElementById("confidenceOut")
    isPlaying = false
    return values
}

//Refreshes elements for Gesture Recording Interface
export function initRecordValues(){
    isRecording=false
    record.disabled = false
    labelName = document.getElementById("gestureLabel")
    sampleCount = document.getElementById("sampleCount")
    downloadButton = document.getElementById("downloadButton")
}

//Checks to see if the Audio is playing
export function checkPlayState() {
    return isPlaying
}

//Checks to see if the Gesture Recording is in progress
export function checkRecordState() {
    return isRecording
}

//Loads JSON files 
export async function loadJSON(path) {
    try {
        const res = await fetch(path)
        return res.json()
    } catch (error) {
        console.error("Unable to load JSON file:", error)
    }
}

//Extracts Hand Landmarks read from the Canvas Element
export function extractLandmarks(landmarks) {
    const coordinates = []
    landmarks.forEach(val => {
        coordinates.push(val.x, val.y, val.z)
    })
    return coordinates
}

//Predicts gesture using extracted Hand Landmarks
export function predictGesture(landmarks) {
    const model = values["model"]
    const scalarMean = values["scalarMean"]
    const scalarStd = values["scalarStd"]
    const labelMap = values["labelMap"]

    if (!model || !scalarMean || !scalarStd) return
    const coordinates = landmarks.map((val, i) =>
        (val - scalarMean[i]) / scalarStd[i]
    )
    const input = tf.tensor2d([coordinates])
    const output = model.predict(input)
    const predictions = output.dataSync()
    const predictedIndex = predictions.indexOf(Math.max(...predictions))
    const confidence = Math.max(...predictions) * 100
    const predictedGesture = labelMap[predictedIndex]

    if (confidence.toFixed(2) > 95.50 && !checkPlayState() && predictedGesture != null) {
        isPlaying = true
        predictionOut.textContent = predictedGesture
        confidenceOut.textContent = confidence.toFixed(2)
        player.src = "./TTSRecordings/" + predictedGesture + ".wav"
        player.load()
        player.play()
        player.addEventListener("timeupdate", () => {
            if (player.currentTime >= player.duration) {
                player.pause()
                player.currentTime = 0
                isPlaying = false
            }
        })
    }
    else {
        predictionOut.textContent = "-"
        confidenceOut.textContent = "-%"
        player.currentTime = 0
        isPlaying = false
    }
    tf.dispose(output)
    tf.dispose(input)
}

//Loads the Media Pipe API and returns HandLandmarker Object
export async function loadMP() {
    try {
        handLandmarker = undefined
        console.log("Loading Media Pipe model...")
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        )

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: mp_model_url },
            runningMode: "VIDEO",
            numHands: 2,
        })
        console.log("Media Pipe model loaded!")
    }
    catch (error) {
        console.error("Failed to load Media Pipe Model: ", error)
    }
    return handLandmarker
}

//Initializes Web Camera
export async function initWebcam(video) {
    try {
        console.log("Initializing Webcam....")
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream
        lastVideoTime = -1
        console.log("Webcam enabled!")
    }
    catch (error) {
        console.error("Unable to load Webcam: ", error)
    }
}

//Updates elements to display recording status 
export function capture() {
    if (isRecording) {
        isRecording = false
        record.textContent = "Continue Recording"
        record.classList.remove('bg-red-600', 'hover:bg-red-700')
        record.classList.add('bg-green-600', 'hover:bg-green-700')
        recordingStatus.textContent = "PAUSED"
        recordingStatus.classList.remove('text-red-400')
        recordingStatus.classList.add('text-yellow-400')
        labelName.disabled = false
    } else {
        if (labelName.value == "") {
            alert("Please enter a label before starting")
            return
        }
        isRecording = true
        record.textContent = "Stop Recording"
        record.classList.remove('bg-green-600', 'hover:bg-green-700')
        record.classList.add('bg-red-600', 'hover:bg-red-700')
        recordingStatus.textContent = `RECORDING: ${labelName.value.trim()}`
        recordingStatus.classList.remove('text-yellow-400')
        recordingStatus.classList.add('text-red-400')
        labelName.disabled = true
    }
    downloadSize(trainingData)
}

//Downloads Data in JSON format
export function downloadData() {
    if (trainingData.length === 0) {
        alert("No data collected yet!")
        return
    }

    const dataStr = JSON.stringify(trainingData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const path = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = path
    a.download = `${gestureLabel.value}.json`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(path)
}

//Updates Download Size
export function downloadSize(data) {
    trainingData=data
    const size = (JSON.stringify(trainingData).length / 1024).toFixed(1)
    downloadButton.disabled = trainingData.length === 0 || isRecording
    downloadButton.textContent = `Download Data (${size} KB)`
}

//Resets Recording Data
export function resetData() {
    trainingData = []
    isRecording = false
    labelName.textContent=""
    record.textContent = "Start Recording"
    downloadButton.textContent = "Download Data (0 KB)"
    recordingStatus.textContent = "IDLE"
    sampleCount.textContent = trainingData.length
    recordingStatus.classList.remove('text-yellow-400')
    recordingStatus.classList.add('text-red-400')
}