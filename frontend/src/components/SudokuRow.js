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
  const exampleNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function isErrorCell(cellIndex) {
    return errorCells.has(cellIndex);
  }

  return (
    <div className={"sudoku-row"}>
      {row.map((cell, cellIndex) => {
        const cellKey = rowIndex * 9 + cellIndex; // unique key for each cell
        return (
          <SudokuCell
            notes={exampleNotes}
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
