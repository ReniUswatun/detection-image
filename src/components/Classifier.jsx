import { useRef, useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

const Classifier = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const setupModel = async () => {
      try {
        // Tunggu sampai backend WebGL siap
        await tf.setBackend("webgl");
        console.log("Backend set to WebGL");

        // Load model MobileNet
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("Model Loaded Successfully");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    setupModel();
  }, []);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    getCamera();
  }, []);

  const classifyImage = async () => {
    if (!model) {
      console.error("Model belum dimuat!");
      return;
    }

    if (!videoRef.current || !videoRef.current.srcObject) {
      console.error("Video belum siap!");
      return;
    }

    try {
      const predictions = await model.classify(videoRef.current);
      setPrediction(
        predictions[0]?.className || "Tidak dapat mengklasifikasikan"
      );
    } catch (error) {
      console.error("Error during classification:", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="640" height="480"></video>
      <button onClick={classifyImage} disabled={!model}>
        {model ? "Classify" : "Loading Model..."}
      </button>
      <p>Prediction: {prediction}</p>
    </div>
  );
};

export default Classifier;
