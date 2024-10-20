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
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Switch,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
    Check,
    Delete,
    Extension,
    Lightbulb,
    Visibility,
} from "@mui/icons-material";

const SudokuBoard = forwardRef(
    ({puzzle, instanceName, startingCells, fetchPuzzle}, ref) => {
        const [selectedCell, setSelectedCell] = useState(null);
        const [notesMode, setNotesMode] = useState(false);
        const [confetti, setConfetti] = useState(false);
        const [fadeOut, setFadeOut] = useState(false);
        const [errorCells, setErrorCells] = useState(new Set());
        const [confirmedAction, setConfirmedAction] = useState(null);
        const [board, setBoard] = useState(() => {
            const savedBoard = JSON.parse(
                localStorage.getItem(`sudoku${instanceName}`),
            );
            if (savedBoard && Array.isArray(savedBoard) && savedBoard.length === 9) {
                // Optionally validate the structure further
                return savedBoard;
            } else {
                // Initialize as before
                const initialBoard = [];
                for (let row = 0; row < 9; row++) {
                    const currentRow = [];
                    for (let col = 0; col < 9; col++) {
                        currentRow.push({
                            value: 0,
                            notes: [],
                        });
                    }
                    initialBoard.push(currentRow);
                }
                return initialBoard;
            }
        });
        const [errorOpen, setErrorOpen] = React.useState(false);
        const [victoryOpen, setVictoryOpen] = React.useState(false);
        const [confirmOpen, setConfirmOpen] = React.useState(false);
        const [errorMessage, setErrorMessage] = useState("");
        const [confirmMessage, setConfirmMessage] = useState("");
        const countNonZeroCells = (board) => {
            return board.reduce(
                (total, row) => total + row.filter((cell) => cell.value !== 0).length,
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
        const handleConfirmOpen = (confirmIndex) => {
            if (confirmIndex !== undefined && confirmIndex === 0) {
                setConfirmMessage("You will not be able to return to this puzzle");
                setConfirmedAction(() => fetchPuzzle); // Pass the function without invoking it
            } else if (confirmIndex !== undefined && confirmIndex === 1) {
                setConfirmMessage("You will not be able to regain your progress");
                setConfirmedAction(() => resetPuzzle); // Pass the function without invoking it
            }
            setConfirmOpen(true);
        };

        const handleClose = () => {
            setErrorOpen(false);
        };
        const handleConfirmClose = () => {
            setConfirmOpen(false);
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
        const handleNotesModeChange = (event) => {
            setNotesMode(event.target.checked); // Update state on change
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
                // Check if the elements in puzzle are cell objects
                const isPuzzleCellObjects = puzzle.every((row) =>
                    row.every(
                        (cell) =>
                            typeof cell === "object" &&
                            cell !== null &&
                            "value" in cell &&
                            "notes" in cell,
                    ),
                );

                if (isPuzzleCellObjects) {
                    // Puzzle is already an array of cell objects
                    setBoard(puzzle);
                } else {
                    // Puzzle is an array of numbers, map over it to create cell objects
                    const newBoard = puzzle.map((row) =>
                        row.map((cellValue) => ({
                            value: cellValue,
                            notes: [],
                        })),
                    );
                    setBoard(newBoard);
                }
                localStorage.setItem(`sudoku${instanceName}`, JSON.stringify(puzzle));
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
                const requestBody = board.map((row) => row.map((cell) => cell.value));
                console.log("Sending board:", requestBody); // Log what you're sending
                if (countNonZeroCells(board) < 22) {
                    handleClickOpen(2);
                }
                const response = await fetch("http://sudoku-solver-backend.us-east-2.elasticbeanstalk.com/api/sudoku/solve", {
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
                if (arraysAreEqual(board, data)) {
                    handleClickOpen();
                    throw new Error("Invalid Sudoku Configuration");
                }
                const newBoard = board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => ({
                        ...cell,
                        value: data[rowIndex][colIndex],
                        notes: [],
                    })),
                );
                setBoard(newBoard);
            } catch (error) {
                console.error("Error sending board to backend:", error);
            }
        }

        function arraysAreEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;

            for (let i = 0; i < arr1.length; i++) {
                const elem1 = arr1[i];
                const elem2 = arr2[i];

                if (Array.isArray(elem1) && Array.isArray(elem2)) {
                    // Recursively check nested arrays
                    if (!arraysAreEqual(elem1, elem2)) return false;
                } else {
                    const value1 =
                        typeof elem1 === "object" && elem1 !== null ? elem1.value : elem1;
                    const value2 =
                        typeof elem2 === "object" && elem2 !== null ? elem2.value : elem2;

                    if (value1 !== value2) {
                        return false;
                    }
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
                    let value = board[row][col].value;
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
                    if (i !== colIndex && board[rowIndex][i].value === value) {
                        rowErrors.add(rowIndex * 9 + i);
                    }
                }
                return rowErrors;
            }

            function colCheck(colIndex, rowIndex, value) {
                let colErrors = new Set();
                for (let i = 0; i < 9; i++) {
                    if (i !== rowIndex && board[i][colIndex].value === value) {
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
                        if (
                            (i !== rowIndex || j !== colIndex) &&
                            board[i][j].value === value
                        ) {
                            squareErrors.add(i * 9 + j);
                        }
                    }
                }
                return squareErrors;
            }
        }

        function resetPuzzle() {
            const tempBoard = board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (startingCells.has(rowIndex * 9 + colIndex)) {
                        return {
                            ...cell,
                            value: puzzle[rowIndex][colIndex].value,
                            notes: [],
                        };
                    } else {
                        return {...cell, value: 0, notes: []};
                    }
                }),
            );
            setBoard(tempBoard);
        }

        function resetBoard() {
            // Initialize as before
            const initialBoard = [];
            for (let row = 0; row < 9; row++) {
                const currentRow = [];
                for (let col = 0; col < 9; col++) {
                    currentRow.push({
                        value: 0,
                        notes: [],
                    });
                }
                initialBoard.push(currentRow);
            }
            setBoard(initialBoard);
        }

        function revealPuzzle() {
            const solvedBoard = JSON.parse(
                localStorage.getItem("currentSolvedBoard"),
            );
            if (solvedBoard) {
                const newBoard = board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => ({
                        ...cell,
                        value: solvedBoard[rowIndex][colIndex],
                        notes: [],
                    })),
                );
                setBoard(newBoard);
                setSelectedCell(null);
            }
        }

        function revealCell() {
            const solvedBoard = JSON.parse(
                localStorage.getItem("currentSolvedBoard"),
            );
            const rowIndex = Math.floor(selectedCell / 9);
            const colIndex = selectedCell % 9;
            const newBoard = board.map((row) => row.map((cell) => ({...cell})));
            newBoard[rowIndex][colIndex].value = solvedBoard[rowIndex][colIndex];
            setBoard(newBoard);
        }

        function checkCell() {
            if (selectedCell !== null) {
                const solvedBoard = JSON.parse(
                    localStorage.getItem("currentSolvedBoard"),
                );
                const rowIndex = Math.floor(selectedCell / 9);
                const colIndex = selectedCell % 9;
                if (
                    solvedBoard[rowIndex][colIndex] !== board[rowIndex][colIndex].value
                ) {
                    let tempErrors = new Set(errorCells);
                    tempErrors.add(selectedCell);
                    setErrorCells(tempErrors);
                    setSelectedCell(null);
                }
            }
        }

        function checkPuzzle() {
            const solvedBoard = JSON.parse(
                localStorage.getItem("currentSolvedBoard"),
            );
            let tempErrors = new Set(errorCells);
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (
                        board[row][col].value !== 0 &&
                        solvedBoard[row][col] !== board[row][col].value
                    ) {
                        tempErrors.add(row * 9 + col);
                        setErrorCells(tempErrors);
                    }
                }
            }
            setSelectedCell(null);
        }

        const handleKeyDown = (event) => {
            if (selectedCell !== null) {
                const rowIndex = Math.floor(selectedCell / 9);
                const colIndex = selectedCell % 9;

                if (/^[1-9]$/.test(event.key) && !startingCells.has(selectedCell)) {
                    const num = parseInt(event.key);

                    const newBoard = board.map((row) => row.map((cell) => ({...cell})));
                    const newCell = {...newBoard[rowIndex][colIndex]};

                    if (notesMode) {
                        // Toggle note
                        if (newCell.notes.includes(num)) {
                            newCell.notes = newCell.notes.filter((n) => n !== num);
                        } else {
                            newCell.notes = [...newCell.notes, num];
                        }
                    } else {
                        // Set value and clear notes
                        newCell.value = num;
                    }

                    newBoard[rowIndex][colIndex] = newCell;
                    setBoard(newBoard);
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
                                board[rowIndex][colIndex].value !== 0
                            ) {
                                const newBoard = [...board];
                                newBoard[rowIndex] = [...newBoard[rowIndex]]; // Create a copy of the row
                                newBoard[rowIndex][colIndex].value = 0; // Clear the value
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
            <div tabIndex={0} className="container" onKeyDown={handleKeyDown}>
                {confetti && <Confetti className={` ${fadeOut ? "fade-out" : ""}`}/>}
                <div className="sudoku-board-wrapper">
                    <div className="sudoku-board">
                        {board.map((row, rowIndex) => (
                            <SudokuRow
                                key={rowIndex}
                                rowIndex={rowIndex}
                                selectedCell={selectedCell}
                                handleCellClick={handleCellClick}
                                row={row}
                                errorCells={errorCells}
                            />
                        ))}
                    </div>

                    {/* Dialogs */}
                    <Dialog
                        sx={{
                            "& .MuiDialog-paper": {
                                backgroundColor: "black", // Black dialog background
                                color: "#00b8ff", // White text color
                            },
                        }}
                        open={errorOpen}
                        onClose={handleClose}
                    >
                        <DialogTitle id="alert-dialog-title">{errorMessage}</DialogTitle>
                        <DialogActions>
                            <Button sx={{color: "#00b8ff"}} onClick={handleClose} autoFocus>
                                Dismiss
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        sx={{
                            "& .MuiDialog-paper": {
                                backgroundColor: "black", // Black dialog background
                                color: "#00b8ff", // Pink text color
                            },
                        }}
                        open={confirmOpen}
                        onClose={handleConfirmClose}
                    >
                        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                sx={{color: "#00b8ff"}}
                                id="alert-dialog-description"
                            >
                                {confirmMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                sx={{color: "#00b8ff"}}
                                onClick={handleConfirmClose}
                                autoFocus
                            >
                                No
                            </Button>
                            <Button
                                sx={{color: "#00b8ff"}}
                                onClick={() => {
                                    if (confirmedAction) {
                                        confirmedAction();
                                    }
                                    handleConfirmClose();
                                }}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        sx={{
                            "& .MuiDialog-paper": {
                                backgroundColor: "black", // Black dialog background
                                color: "#00b8ff", // White text color
                            },
                        }}
                        open={victoryOpen}
                        onClose={handleVictoryClose}
                    >
                        <DialogTitle id="alert-dialog-title">
                            Congratulations! You've completed this Sudoku Board!
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                sx={{color: "#00b8ff"}}
                                onClick={handleVictoryClose}
                                autoFocus
                            >
                                Dismiss
                            </Button>
                            <Button
                                sx={{color: "#00b8ff"}}
                                onClick={() => {
                                    fetchPuzzle();
                                    handleVictoryClose();
                                }}
                            >
                                Play Again
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                {instanceName === "Solver" && (
                    <div className="tools-list">
                        <List>
                            <ListItemButton onClick={resetBoard}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Delete/>
                                </ListItemIcon>
                                <ListItemText primary="Reset Board"/>
                            </ListItemButton>
                            <Divider className={"tool-icon-divider"}/>
                            <ListItemButton onClick={solveBoard}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Check/>
                                </ListItemIcon>
                                <ListItemText primary="Solve"/>
                            </ListItemButton>
                        </List>
                    </div>
                )}
                {instanceName === "Game" && (
                    <div className="tools-list">
                        <List>
                            <ListItem>
                                <Switch
                                    checked={notesMode}
                                    onChange={handleNotesModeChange}
                                    sx={{
                                        "& .MuiSwitch-thumb": {
                                            backgroundColor: "white",
                                        },
                                        "& .MuiSwitch-track": {
                                            backgroundColor: "gray",
                                        },
                                    }}
                                />
                                <ListItemText primary="Notes Mode"/>
                            </ListItem>
                            <Divider className={"tool-icon-divider"}/>
                            <ListItemButton onClick={checkCell}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Check/>
                                </ListItemIcon>
                                <ListItemText primary="Check Cell"/>
                            </ListItemButton>
                            <ListItemButton onClick={checkPuzzle}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Check/>
                                </ListItemIcon>
                                <ListItemText primary="Check Puzzle"/>
                            </ListItemButton>
                            <Divider className={"tool-icon-divider"}/>
                            <ListItemButton onClick={revealCell}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Visibility/>
                                </ListItemIcon>
                                <ListItemText primary="Reveal Cell"/>
                            </ListItemButton>
                            <ListItemButton onClick={revealPuzzle}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Lightbulb/>
                                </ListItemIcon>
                                <ListItemText primary="Reveal Puzzle"/>
                            </ListItemButton>
                            <Divider className={"tool-icon-divider"}/>
                            <ListItemButton onClick={() => handleConfirmOpen(0)}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Extension/>
                                </ListItemIcon>
                                <ListItemText primary="New Puzzle"/>
                            </ListItemButton>
                            <ListItemButton onClick={() => handleConfirmOpen(1)}>
                                <ListItemIcon className={"tool-icons"}>
                                    <Delete/>
                                </ListItemIcon>
                                <ListItemText primary="Reset Puzzle"/>
                            </ListItemButton>
                        </List>
                    </div>
                )}
            </div>
        );
    },
);

export default SudokuBoard;
