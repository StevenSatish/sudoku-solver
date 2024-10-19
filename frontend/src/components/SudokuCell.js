import "./SudokuStyles.css";
import Note from "./Note";
import React from "react";

function SudokuCell({
  notes,
  cellKey,
  selectedCell,
  handleCellClick,
  value,
  errorCell,
}) {
  const notePositions = {
    1: "1 / 1 / 2 / 2", // Top-left
    2: "1 / 2 / 2 / 3", // Top-center
    3: "1 / 3 / 2 / 4", // Top-right
    4: "2 / 1 / 3 / 2", // Middle-left
    5: "2 / 2 / 3 / 3", // Middle-center
    6: "2 / 3 / 3 / 4", // Middle-right
    7: "3 / 1 / 4 / 2", // Bottom-left
    8: "3 / 2 / 4 / 3", // Bottom-center
    9: "3 / 3 / 4 / 4", // Bottom-right
  };
  // Check if this cell is the selected one
  const isSelected = selectedCell === cellKey;
  const isError = errorCell ? "red" : "black";
  const cellStyle = {
    backgroundColor: isSelected ? "#00b8ff" : isError, // Highlight if selected
    borderRight:
      cellKey % 9 === 8
        ? "none"
        : cellKey % 9 === 2 || cellKey % 9 === 5
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
    borderBottom:
      cellKey > 72
        ? "none"
        : (cellKey >= 18 && cellKey < 27) ||
            (cellKey >= 45 && cellKey < 54) ||
            cellKey >= 72
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
  };

  return value === 0 ? (
    <div style={cellStyle} className="notes-cell">
      {Object.keys(notePositions).map((key) => {
        const noteValue = parseInt(key);
        return notes.includes(noteValue) ? ( // Check if the note is in the selected notes array
          <Note
            key={key}
            note={noteValue}
            position={notePositions[noteValue]}
          />
        ) : null; // Return null if the note is not selected
      })}
    </div>
  ) : (
    <div
      className={"sudoku-cell"}
      style={cellStyle}
      onClick={() => handleCellClick(cellKey)} // Handle click to select the cell
    >
      <span className={"cell-text"}>
        {value || ""} {/* Display the value of the cell */}
      </span>
    </div>
  );
}

export default SudokuCell;
