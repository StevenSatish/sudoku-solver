import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./SudokuStyles.css";
import SudokuRow from "./SudokuRow";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const SudokuBoard = forwardRef(({ puzzle }, ref) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [errorCells, setErrorCells] = useState([]);
  const [board, setBoard] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0)),
  );
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
  // Check the board for errors when it changes
  useEffect(() => {
    runBoardCheck();
  }, [board]);

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
      if (arraysAreEqual(data, board)) {
        handleClickOpen();
        throw new Error("Invalid Sudoku Configuration");
      }
      setBoard(data); // Update your board state with the solved puzzle
    } catch (error) {
      console.error("Error sending board to backend:", error);
    }
  }

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
        // Recursively check nested arrays
        if (!arraysAreEqual(arr1[i], arr2[i])) return false;
      } else if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
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

  function runBoardCheck() {
    let errors = [];

    // Helper function to check if an array has duplicates
    const hasDuplicates = (array) => {
      let seen = new Map(); // Use a Map to store the number and its first occurrence index
      for (let i = 0; i < 9; i++) {
        const num = array[i];
        if (num !== 0) {
          // Ignore empty cells (0)
          if (seen.has(num)) {
            return { first: seen.get(num), duplicate: i }; // Return both the first occurrence and the duplicate
          }
          seen.set(num, i);
        }
      }
      return null; // No duplicates found
    };

    // Check each row
    for (let i = 0; i < 9; i++) {
      const result = hasDuplicates(board[i]);
      if (result !== null) {
        errors.push(i * 9 + result.first); // First occurrence in the row
        errors.push(i * 9 + result.duplicate); // Duplicate in the row
      }
    }

    // Check each column
    for (let i = 0; i < 9; i++) {
      let col = [];
      for (let j = 0; j < 9; j++) {
        col.push(board[j][i]);
      }
      const result = hasDuplicates(col);
      if (result !== null) {
        errors.push(result.first * 9 + i); // First occurrence in the column
        errors.push(result.duplicate * 9 + i); // Duplicate in the column
      }
    }

    // Check each 3x3 square
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        let square = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            square.push(board[row + i][col + j]);
          }
        }
        const result = hasDuplicates(square);
        if (result !== null) {
          const squareFirstRow = row + Math.floor(result.first / 3);
          const squareFirstCol = col + (result.first % 3);
          const squareDupRow = row + Math.floor(result.duplicate / 3);
          const squareDupCol = col + (result.duplicate % 3);

          // First occurrence and duplicate in the 3x3 square
          errors.push(squareFirstRow * 9 + squareFirstCol);
          errors.push(squareDupRow * 9 + squareDupCol);
        }
      }
    }

    setErrorCells(errors); // Update the error cells state
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
      } else {
        switch (event.key) {
          case "ArrowUp":
            if (selectedCell >= 9) {
              setSelectedCell(selectedCell - 9);
            }
            break;
          case "ArrowDown":
            if (selectedCell < 72) {
              setSelectedCell(selectedCell + 9);
            }
            break;
          case "ArrowLeft":
            if (selectedCell % 9 !== 0) {
              setSelectedCell(selectedCell - 1);
            }
            break;
          case "ArrowRight":
            if (selectedCell % 9 !== 8) {
              setSelectedCell(selectedCell + 1);
            }
            break;
          case "Backspace":
          case "Delete":
            const newBoard = [...board];
            newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
            newBoard[rowIndex][colIndex] = 0; // Clear the value
            setBoard(newBoard); // Update the board state
            break;
          default:
            break;
        }
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
          errorCells={errorCells}
        />
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"This is an invalid Sudoku Configuration"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default SudokuBoard;
