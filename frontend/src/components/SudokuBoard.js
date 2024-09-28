import React, { useState } from "react";
import "./SudokuStyles.css";
import SudokuSquare from "./SudokuSquare";

const SudokuBoard = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  //highlight and select a cell when clicked
  const handleCellClick = (cellIndex) => {
    setSelectedCell(cellIndex);
  };
  const handleKeyDown = (event) => {
    if (selectedCell !== null) {
      const rowIndex = Math.floor(selectedCell / 9); // Get the row index
      const colIndex = selectedCell % 9; // Get the column index
      if (/^[1-9]$/.test(event.key)) {
        const newBoard = [...board];
        newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
        newBoard[rowIndex][colIndex] = event.key; // Set the new value
        setBoard(newBoard); // Update the board state
      } else if (event.key === "Backspace" || event.key === "Delete") {
        const newBoard = [...board];
        newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
        newBoard[rowIndex][colIndex] = ""; // Clear the value
        setBoard(newBoard); // Update the board state
      }
    }
  };
  //board representing all cells
  const [board, setBoard] = useState(Array(9).fill(Array(9).fill("")));
  return (
    <div tabIndex={0} className={"sudoku-board"} onKeyDown={handleKeyDown}>
      {board.map((square, squareIndex) => (
        <SudokuSquare
          key={squareIndex}
          squareIndex={squareIndex}
          selectedCell={selectedCell}
          handleCellClick={handleCellClick}
          board={board}
        />
      ))}
    </div>
  );
};

export default SudokuBoard;
