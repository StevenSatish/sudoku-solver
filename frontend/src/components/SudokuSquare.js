import React, { useState } from "react";
import SudokuCell from "./SudokuCell";

const SudokuSquare = () => {
  const [square, setSquare] = useState(Array(9).fill(""));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        height: "120px",
        width: "120px",
        border: "2px solid #000", // Border for the entire square
      }}
    >
      {square.map((cell, index) => (
        <div key={index}>
          <SudokuCell />
        </div>
      ))}
    </div>
  );
};
export default SudokuSquare;
