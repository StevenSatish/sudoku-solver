import React from "react";
import SudokuCell from "./SudokuCell";
import "./SudokuStyles.css";

const SudokuRow = ({
  rowIndex,
  handleCellClick,
  selectedCell,
  board,
  errorCells,
}) => {
  const row = board[rowIndex];

  function isErrorCell(cellIndex) {
    return errorCells.some((cell) => cell === cellIndex);
  }

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
            errorCell={isErrorCell(cellKey)}
          />
        );
      })}
    </div>
  );
};
export default SudokuRow;
