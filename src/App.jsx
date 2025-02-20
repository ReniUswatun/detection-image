import "./App.css";
import Classifier from "./logics/Classifier";
// import { useState } from "react";
// import ClassManager from "./components/ClassManager";
// import Camera from "./components/Camera";
// import Classifier from "./components/Classifier";

function App() {
  // const { classes, setClasses } = useState(0);
  return (
    <>
      <div>
        <div>
          <h1>Object Detection</h1>
        </div>
        <div>{/* <ClassManager /> */}</div>
        {/* <Camera /> */}
        <Classifier />
      </div>
    </>
  );
}

export default App;
