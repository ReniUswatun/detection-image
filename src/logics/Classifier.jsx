import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const Classifier = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [trainingData, setTrainingData] = useState({}); // Dataset untuk training
  const [labels, setLabels] = useState([]); // Label kategori
  const [isTraining, setIsTraining] = useState(false);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const getCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    getCamera();
  }, []);

  // Inisialisasi model
  useEffect(() => {
    const createModel = () => {
      const newModel = tf.sequential();
      newModel.add(
        tf.layers.conv2d({
          inputShape: [64, 64, 3],
          filters: 16,
          kernelSize: 3,
          activation: "relu",
        })
      );
      newModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
      newModel.add(tf.layers.flatten());
      newModel.add(tf.layers.dense({ units: 64, activation: "relu" }));
      newModel.add(tf.layers.dense({ units: 3, activation: "softmax" })); // 3 kelas (gunting, batu, kertas)

      newModel.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });
      setModel(newModel);
      console.log("Model created!");
    };

    createModel();
  }, []);

  // Fungsi untuk menangkap gambar
  const captureImage = (label) => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 64, 64);

    const imageData = ctx.getImageData(0, 0, 64, 64);
    const tensor = tf.browser
      .fromPixels(imageData)
      .toFloat()
      .div(tf.scalar(255));

    setTrainingData((prev) => ({
      ...prev,
      [label]: [...(prev[label] || []), tensor],
    }));

    if (!labels.includes(label)) {
      setLabels((prev) => [...prev, label]);
    }

    console.log(`Image captured for label: ${label}`);
  };

  // Fungsi untuk melatih model
  const trainModel = async () => {
    if (!model || Object.keys(trainingData).length === 0) {
      console.error("No training data available!");
      return;
    }

    setIsTraining(true);

    const xs = [];
    const ys = [];

    labels.forEach((label, index) => {
      if (trainingData[label]) {
        trainingData[label].forEach((tensor) => {
          xs.push(tensor);
          ys.push(index);
        });
      }
    });

    const xTrain = tf.stack(xs);
    const yTrain = tf.tensor1d(ys, "int32");
    const yTrainOneHot = tf.oneHot(yTrain, labels.length);

    await model.fit(xTrain, yTrainOneHot, { epochs: 10 });

    setIsTraining(false);
    console.log("Training complete!");
  };

  // Fungsi untuk prediksi
  const classifyImage = async () => {
    if (!model || !videoRef.current || !videoRef.current.srcObject) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 64, 64);
    const imageData = ctx.getImageData(0, 0, 64, 64);
    const tensor = tf.browser
      .fromPixels(imageData)
      .toFloat()
      .div(tf.scalar(255))
      .expandDims(0);

    const predictionTensor = model.predict(tensor);
    const predictedIndex = predictionTensor.argMax(1).dataSync()[0];
    setPrediction(labels[predictedIndex]);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="640" height="480"></video>
      <canvas
        ref={canvasRef}
        width="64"
        height="64"
        style={{ display: "none" }}></canvas>

      <h3>Tambahkan Data Training</h3>
      <button onClick={() => captureImage("Gunting")}>Tambah Gunting</button>
      <button onClick={() => captureImage("Batu")}>Tambah Batu</button>
      <button onClick={() => captureImage("Kertas")}>Tambah Kertas</button>

      <h3>Train Model</h3>
      <button onClick={trainModel} disabled={isTraining}>
        {isTraining ? "Training..." : "Train Model"}
      </button>

      <h3>Prediksi</h3>
      <button onClick={classifyImage}>Classify</button>
      <p>Prediction: {prediction}</p>
    </div>
  );
};

export default Classifier;
