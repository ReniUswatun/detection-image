import { useState } from "react";
import ClassCard from "./items/ClassCard";

const ClassManager = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
  ]);

  const addClass = () => {
    setClasses((prevClasses) => [
      ...prevClasses,
      { id: Date.now(), name: `Class ${prevClasses.length + 1}` },
    ]);
  };

  // Fungsi untuk mengupdate nama kelas
  const handleNameChange = (id, newName) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === id ? { ...cls, name: newName } : cls
      )
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          name={cls.name}
          onNameChange={(newName) => handleNameChange(cls.id, newName)}
        />
      ))}
      <button
        onClick={addClass}
        className="border-dashed border-2 border-gray-400 p-4 w-full mt-4 text-gray-600">
        + Add a class
      </button>
    </div>
  );
};

export default ClassManager;
