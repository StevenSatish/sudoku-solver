import React from "react";
import SudokuCell from "./SudokuCell";
import "./SudokuStyles.css";

const SudokuRow = ({ rowIndex, handleCellClick, selectedCell, board }) => {
  const row = board[rowIndex];
  return (
    <div className={"sudoku-row"}>
      {row.map((cell, cellIndex) => {
        const cellKey = rowIndex * 9 + cellIndex; // unique key for each cell
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
export default SudokuRow;
