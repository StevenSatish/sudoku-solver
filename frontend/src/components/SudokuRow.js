import React from "react";
import SudokuCell from "./SudokuCell";
import "./SudokuStyles.css";

const SudokuRow = ({
  rowIndex,
  row,
  selectedCell,
  handleCellClick,
  errorCells,
}) => {
  return (
    <div className="sudoku-row">
      {row.map((cell, colIndex) => {
        const cellIndex = rowIndex * 9 + colIndex;
        return (
          <SudokuCell
            key={cellIndex}
            cell={cell}
            cellIndex={cellIndex}
            selectedCell={selectedCell}
            handleCellClick={handleCellClick}
            errorCell={errorCells.has(cellIndex)}
          />
        );
      })}
    </div>
  );
};
export default SudokuRow;
