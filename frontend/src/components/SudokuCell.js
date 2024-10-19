import "./SudokuStyles.css";
import Note from "./Note";
import React from "react";

function SudokuCell({
  cell,
  cellIndex,
  selectedCell,
  handleCellClick,
  errorCell,
}) {
  // Check if this cell is the selected one
  const isSelected = selectedCell === cellIndex;
  const isError = errorCell ? "red" : "black";
  const cellStyle = {
    backgroundColor: isSelected ? "#00b8ff" : isError, // Highlight if selected
    borderRight:
      cellIndex % 9 === 8
        ? "none"
        : cellIndex % 9 === 2 || cellIndex % 9 === 5
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
    borderBottom:
      cellIndex > 72
        ? "none"
        : (cellIndex >= 18 && cellIndex < 27) ||
            (cellIndex >= 45 && cellIndex < 54) ||
            cellIndex >= 72
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
  };

  return (
    <div
      className={cell.value === 0 ? "notes-cell" : "sudoku-cell"}
      style={cellStyle}
      onClick={() => handleCellClick(cellIndex)}
    >
      {cell.value === 0 ? (
        // Render notes grid
        <div className="notes-grid">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((noteValue) => (
            <div key={noteValue} className="note">
              {cell.notes.includes(noteValue) ? noteValue : null}
            </div>
          ))}
        </div>
      ) : (
        <span className="cell-text">{cell.value}</span>
      )}
    </div>
  );
}

export default SudokuCell;
