import React, { useState } from "react";
import SudokuCell from "./SudokuCell";
import "./SudokuStyles.css";

const SudokuSquare = ({
  squareIndex,
  handleCellClick,
  selectedCell,
  board,
}) => {
  const square = board[squareIndex];
  return (
    <div className={"sudoku-square"}>
      {square.map((cell, cellIndex) => {
        const cellKey = squareIndex * 9 + cellIndex; // unique key for each cell
        return (
          <SudokuCell
            key={cellKey}
            cellKey={cellKey}
            selectedCell={selectedCell}
            handleCellClick={handleCellClick} // Pass the click handler
            value={cell}
          />
        );
      })}
    </div>
  );
};
export default SudokuSquare;
