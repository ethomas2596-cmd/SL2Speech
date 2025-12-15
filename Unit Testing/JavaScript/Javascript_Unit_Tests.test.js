/*
SL2Speech Javascript Functions Unit Testing
Author: Earl Thomas
CMSC 495 7385
University of Maryland Global Campus
Description: Unit testing for the SL2Speech Web Applications

*Note: Unit test does not include functions that require DOM Elements. 
*/

const tf = require('@tensorflow/tfjs');

const fs = require('fs');
const path = require('path');


let webRoot = path.resolve(__dirname, '../../Apache24/htdocs')
const scalarStats_path = path.join(webRoot, "scaler_stats.json")
const gestureMap_path = path.join(webRoot, "gestureMap.json")

// 2. Normalize the path separators BEFORE prepending the file scheme.


// 3. Prepend the file scheme using the now-normalized path.
let p_model_path = path.join(webRoot, "gestureModel","model.json")
let model
let gestureMap
let scalarMean
let scalarStd

test("Testing Loading Required JSON Files...", async () => {
    let res = false
    const files = [scalarStats_path, gestureMap_path]

    for (const filepath of files) {
        try {
            let json = JSON.parse(await fs.readFileSync(filepath, 'utf8'))
            if (json) {
                if (files.indexOf(filepath) == 0) {
                    scalarMean = json.mean
                    scalarStd = json.std
                }
                else { gestureMap = json }
                res = true
            }
        }
        catch (e) {
            res = false
            console.error("Unable to load file: ", e)
        }
    }
    expect(res).toBe(true)
})

test("Testing Gesture Prediction...", async () => {
    try {
        console.log("Final Model Path URL:", p_model_path)
        model = await tf.loadLayersModel(p_model_path)
        landmarks = [0.7647749781608582, 0.6777666211128235, -7.435215820805752e-07, 0.695650041103363, 0.6490625143051147, -0.01320875808596611, 0.6369174718856812, 0.5701939463615417, -0.017466114833950996, 0.6173442602157593, 0.5002853870391846, -0.023893414065241814, 0.6153250932693481, 0.4364161789417267, -0.02643200196325779, 0.6650857329368591, 0.4725349545478821, 0.00980165135115385, 0.6343176960945129, 0.4727557897567749, -0.01986124739050865, 0.65645831823349, 0.5363712310791016, -0.04024367779493332, 0.6762613654136658, 0.5915766954421997, -0.04832268878817558, 0.7043987512588501, 0.4587176442146301, 0.005258853081613779, 0.66998690366745, 0.4686679244041443, -0.02548108994960785, 0.6943510174751282, 0.5489979982376099, -0.03501076251268387, 0.7135453224182129, 0.6064321398735046, -0.03333000838756561, 0.74703049659729, 0.45800307393074036, -0.004762799013406038, 0.7090105414390564, 0.4605766236782074, -0.035566579550504684, 0.7252188324928284, 0.5436505079269409, -0.02609860897064209, 0.738756537437439, 0.6034085154533386, -0.010506478138267994, 0.7915660738945007, 0.46883517503738403, -0.016689956188201904, 0.7571778297424316, 0.46931084990501404, -0.03833544999361038, 0.7529573440551758, 0.5320967435836792, -0.029403991997241974, 0.7521454691886902, 0.5770089626312256, -0.015676362439990044]
        const coordinates = landmarks.map((val, i) =>
            (val - scalarMean[i]) / scalarStd[i]
        )
        const input = tf.tensor2d([coordinates])
        const output = model.predict(input)
        const predictions = output.dataSync()
        const predictedIndex = predictions.indexOf(Math.max(...predictions))
        const predictedGesture = labelMap[predictedIndex]
        expect(predictedGesture).toBe("A")
    } catch (error) {
        console.error("Unable to load prediction model", error)
    }


})
