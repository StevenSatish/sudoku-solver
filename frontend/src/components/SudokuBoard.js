import React, { useState } from "react";
import "./SudokuStyles.css";
import SudokuSquare from "./SudokuSquare";

const SudokuBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        height: "360px",
        width: "360px",
      }}
    >
      {board.map((square, index) => (
        <div key={index}>
          <SudokuSquare />
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
