import { useState } from "react";
const ClassCard = ({ className }) => {
  const { name, setName } = useState(className);
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      {/* Nama kelas bisa diedit */}
      <div className="flex justify-start">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-lg font-semibold border-none focus:outline-none"
        />
      </div>

      {/* Tombol Webcam & Upload */}
      <div className="mt-3 flex gap-2">
        <button className="bg-blue-500 px-4 py-2 rounded flex items-center gap-2">
          <span role="img" aria-label="Webcam">
            📷
          </span>{" "}
          Webcam {/* Added aria-label for accessibility */}
        </button>
        <button className="bg-blue-500 px-4 py-2 rounded flex items-center gap-2">
          <span role="img" aria-label="Upload">
            ⬆️
          </span>{" "}
          Upload {/* Added aria-label for accessibility */}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
