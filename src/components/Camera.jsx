/* eslint-disable react/prop-types */
// import { useRef, useEffect } from "react";

// // eslint-disable-next-line react/prop-types
// const Camera = ({ width = 640, height = 480 }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     let stream = null;

//     const getCamera = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     getCamera();

//     return () => {
//       // Matikan kamera saat komponen tidak digunakan
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   return <video ref={videoRef} width={width} height={height} autoPlay />;
// };

// export default Camera;

import { useRef, useEffect, useState } from "react";

const Camera = ({ width = 640, height = 480 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let stream = null;

    const getCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    getCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);

    // Simpan hasil foto sebagai base64
    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
    localStorage.setItem("capturedPhoto", imageData); // Simpan ke localStorage
  };

  return (
    <div>
      <h2>Live Camera</h2>
      <video ref={videoRef} width={width} height={height} autoPlay />
      <br />
      <button onClick={capturePhoto}>Capture</button>

      <h2>Captured Image</h2>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {photo && (
        <img src={photo} alt="Captured" width={width} height={height} />
      )}
    </div>
  );
};

export default Camera;
