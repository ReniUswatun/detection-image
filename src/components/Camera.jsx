import { useRef, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const Camera = ({ width = 640, height = 480 }) => {
  const videoRef = useRef(null);

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
      // Matikan kamera saat komponen tidak digunakan
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return <video ref={videoRef} width={width} height={height} autoPlay />;
};

export default Camera;
