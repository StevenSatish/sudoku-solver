import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./SudokuStyles.css";
import SudokuRow from "./SudokuRow";
import Confetti from "react-confetti";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Drawer,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const SudokuBoard = forwardRef(
  ({ puzzle, instanceName, startingCells }, ref) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [confetti, setConfetti] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [errorCells, setErrorCells] = useState(new Set());
    const [board, setBoard] = useState(
      Array.from({ length: 9 }, () => Array(9).fill(0)),
    );
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [victoryOpen, setVictoryOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const countNonZeroCells = (board) => {
      return board.reduce(
        (total, row) => total + row.filter((cell) => cell !== 0).length,
        0,
      );
    };
    const handleClickOpen = (errorIndex) => {
      setErrorOpen(true);
      if (errorIndex !== undefined && errorIndex === 1) {
        setErrorMessage("There is no solution for this puzzle.");
      } else if (errorIndex !== undefined && errorIndex === 2) {
        setErrorMessage(
          "With this amount of filled cells, the solver may take a long time.",
        );
      }
    };

    const handleClose = () => {
      setErrorOpen(false);
    };
    const handleVictoryOpen = () => {
      setVictoryOpen(true);
      setConfetti(true);
      setFadeOut(false);
      setTimeout(() => {
        setFadeOut(true); // Start fading out after a delay
        setTimeout(() => {
          setConfetti(false); // Hide confetti after fading out
        }, 1000); // Wait for the fade-out duration
      }, 3000); // Confetti duration before fading out
    };
    const handleVictoryClose = () => {
      setVictoryOpen(false);
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
        localStorage.setItem(`sudoku${instanceName}`, JSON.stringify(puzzle));
        setBoard(puzzle); // Update board if puzzle is valid
      }
    }, [puzzle]);

    // Check the board for errors when it changes, and save it to localStorage
    useEffect(() => {
      localStorage.setItem(`sudoku${instanceName}`, JSON.stringify(board));
      runCellErrorCheck();
      const solution = JSON.parse(localStorage.getItem("currentSolvedBoard"));
      if (solution) {
        if (arraysAreEqual(board, solution) && instanceName === "Game") {
          handleVictoryOpen();
        }
      }
    }, [board, instanceName]);

    // Define the async function to solve the board
    async function fillBoard() {
      try {
        const requestBody = board; // Puzzle is the state holding the 2D array
        console.log("Sending board:", requestBody); // Log what you're sending
        if (countNonZeroCells(board) < 22) {
          handleClickOpen(2);
        }
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

    function runCellErrorCheck() {
      let errors = new Set(); // Initialize a set to hold errors

      // Iterate through each cell in the board
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          let value = board[row][col];
          if (value === 0) {
            continue; // Skip empty cells
          }
          // Check for errors in the current value
          let rowErrors = rowCheck(row, col, value);
          let colErrors = colCheck(col, row, value);
          let squareErrors = squareCheck(row, col, value);

          // Add all found errors to the main errors set
          errors = new Set([
            ...errors,
            ...rowErrors,
            ...colErrors,
            ...squareErrors,
          ]);
        }
      }
      setErrorCells(errors); // Update the error cells state

      // Functions to check for duplicates in rows, columns, and squares
      function rowCheck(rowIndex, colIndex, value) {
        let rowErrors = new Set();
        for (let i = 0; i < 9; i++) {
          if (i !== colIndex && board[rowIndex][i] === value) {
            rowErrors.add(rowIndex * 9 + i);
          }
        }
        return rowErrors;
      }

      function colCheck(colIndex, rowIndex, value) {
        let colErrors = new Set();
        for (let i = 0; i < 9; i++) {
          if (i !== rowIndex && board[i][colIndex] === value) {
            colErrors.add(i * 9 + colIndex);
          }
        }
        return colErrors;
      }

      function squareCheck(rowIndex, colIndex, value) {
        let squareErrors = new Set();
        let squareRow = Math.floor(rowIndex / 3) * 3;
        let squareCol = Math.floor(colIndex / 3) * 3;

        for (let i = squareRow; i < squareRow + 3; i++) {
          for (let j = squareCol; j < squareCol + 3; j++) {
            // Skip the current cell
            if ((i !== rowIndex || j !== colIndex) && board[i][j] === value) {
              squareErrors.add(i * 9 + j);
            }
          }
        }
        return squareErrors;
      }
    }

    const handleKeyDown = (event) => {
      if (selectedCell !== null) {
        const rowIndex = Math.floor(selectedCell / 9); // Get the row index
        const colIndex = selectedCell % 9; // Get the column index
        if (/^[1-9]$/.test(event.key) && !startingCells.has(selectedCell)) {
          const newBoard = [...board];
          newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
          newBoard[rowIndex][colIndex] = parseInt(event.key); // Set the new value
          setBoard(newBoard); // Update the board state
          //addErrorCells(selectedCell, newBoard);
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
              if (
                !startingCells.has(selectedCell) &&
                board[rowIndex][colIndex] !== 0
              ) {
                const newBoard = [...board];
                newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
                newBoard[rowIndex][colIndex] = 0; // Clear the value
                setBoard(newBoard); // Update the board state
                //removeErrorCells(selectedCell);
              }
              break;
            default:
              break;
          }
        }
      }
    };
    //highlight and select a cell when clicked
    const handleCellClick = (cellIndex) => {
      setSelectedCell(cellIndex);
    };
    return (
      <div tabIndex={0} className={"sudoku-board"} onKeyDown={handleKeyDown}>
        {confetti && <Confetti className={` ${fadeOut ? "fade-out" : ""}`} />}
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
        <Dialog open={errorOpen} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">{errorMessage}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              dismiss
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={victoryOpen} onClose={handleVictoryClose}>
          <DialogTitle id="alert-dialog-title">
            Congratulations! You've conquered this Sudoku Board
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleVictoryClose} autoFocus>
              dismiss
            </Button>
            <Button onClick={handleVictoryClose}>Play Again</Button>
          </DialogActions>
        </Dialog>
        <Drawer anchor="right" variant="permanent" sx={{ width: 40 }}>
          <Typography variant="h4" component="h4">
            Sudoku Tools
          </Typography>
          <Divider />
          <List>
            <ListItem>
              <Switch />
              <ListItemText primary="Turn on Notes" />
            </ListItem>

            {/* Check Cell */}
            <ListItem>
              <ListItemText primary="Check Cell" />
            </ListItem>

            {/* Check Puzzle */}
            <ListItem>
              <ListItemText primary="Check Puzzle" />
            </ListItem>

            <Divider />

            {/* Reveal Cell */}
            <ListItem>
              <ListItemText primary="Reveal Cell" />
            </ListItem>

            {/* Reveal Puzzle */}
            <ListItem>
              <ListItemText primary="Reveal Puzzle" />
            </ListItem>
            <Divider />
            {/* Reset Puzzle */}
            <ListItem>
              <ListItemText primary="Reset Puzzle" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  },
);

export default SudokuBoard;
