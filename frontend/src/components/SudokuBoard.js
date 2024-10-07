import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./SudokuStyles.css";
import SudokuRow from "./SudokuRow";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const SudokuBoard = forwardRef(({ puzzle }, ref) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [board, setBoard] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0)),
  );
  const [open, setOpen] = React.useState(false);
  useImperativeHandle(ref, () => {
    return {
      solveBoard,
    };
  });
  // Update board when puzzle changes
  useEffect(() => {
    if (
      Array.isArray(puzzle) &&
      puzzle.length === 9 &&
      puzzle.every((row) => Array.isArray(row) && row.length === 9)
    ) {
      setBoard(puzzle); // Update board if puzzle is valid
    }
  }, [puzzle]);

  // Define the async function to solve the board
  async function fillBoard() {
    try {
      const requestBody = board; // Puzzle is the state holding the 2D array
      console.log("Sending board:", requestBody); // Log what you're sending

      const response = await fetch("http://localhost:8080/api/sudoku/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert the board to JSON
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the error message from server
        throw new Error(`Failed to send board data: ${errorText}`);
      }

      const data = await response.json();
      setBoard(data); // Update your board state with the solved puzzle
    } catch (error) {
      console.error("Error sending board to backend:", error);
    }
  }

  // This function will trigger fillBoard and wait for it to resolve
  function solveBoard() {
    fillBoard()
      .then(() => {
        console.log("Board solved!");
      })
      .catch((error) => {
        console.error("Error solving the board:", error);
      });
  }

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
        newBoard[rowIndex][colIndex] = parseInt(event.key); // Set the new value
        setBoard(newBoard); // Update the board state
      } else if (event.key === "Backspace" || event.key === "Delete") {
        const newBoard = [...board];
        newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
        newBoard[rowIndex][colIndex] = 0; // Clear the value
        setBoard(newBoard); // Update the board state
      }
    }
  };

  return (
    <div tabIndex={0} className={"sudoku-board"} onKeyDown={handleKeyDown}>
      {board.map((row, rowIndex) => (
        <SudokuRow
          key={rowIndex}
          rowIndex={rowIndex}
          selectedCell={selectedCell}
          handleCellClick={handleCellClick}
          board={board}
        />
      ))}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"This is an invalid Sudoku Configuration"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default SudokuBoard;
