import "./Play.css";
import SideNav from "../components/SideNav";
import SudokuBoard from "../components/SudokuBoard";
import { useEffect, useState } from "react";

function Play() {
  const initialPuzzle = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: 0,
      notes: [],
    })),
  );

  const [puzzle, setPuzzle] = useState(initialPuzzle);
  const [fetchedStartingCells, setStartingCells] = useState(new Set());
  const savedBoard = JSON.parse(localStorage.getItem("sudokuGame"));
  useEffect(() => {
    console.log("savedBoard on re-render at Play", savedBoard);
    // Check if savedBoard exists and is properly formatted
    if (savedBoard && Array.isArray(savedBoard) && savedBoard.length === 9) {
      const isBoardEmpty = savedBoard.every((row) =>
        row.every((cell) => cell.value === 0),
      );
      if (isBoardEmpty) {
        console.log("board empty");
        fetchSudokuPuzzle(); // Fetch a new puzzle if the saved one is empty
      } else {
        setPuzzle(savedBoard); // Use the saved board
      }
    } else {
      console.log("no board");
      fetchSudokuPuzzle(); // Fetch a new puzzle if there's no valid and saved board
    }
  }, []);

  const fetchSudokuPuzzle = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/sudoku/generate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Sudoku puzzle");
      }
      console.log("Fetching puzzle...");
      const puzzleData = await response.json(); // The puzzle is a 2D array (int[][])
      const board = puzzleData.map((row) =>
        row.map((cellValue) => ({
          value: cellValue,
          notes: [],
        })),
      );

      localStorage.setItem(`sudokuGame`, JSON.stringify(board));
      const newStartingCells = new Set();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzleData[i][j] !== 0) {
            newStartingCells.add(i * 9 + j); // Store indices in an array
          }
        }
      }
      const startingCellsArr = Array.from(newStartingCells);
      localStorage.setItem("startingCells", JSON.stringify(startingCellsArr));
      setPuzzle(board);
      computeFinishedPuzzle(puzzleData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function computeFinishedPuzzle(puzzleData) {
    const requestBody = puzzleData; // Puzzle is the state holding the 2D array
    console.log("Sending fetched board:", requestBody); // Log what you're sending

    fetch("http://localhost:8080/api/sudoku/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Convert the board to JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to solve the puzzle");
        }
        return response.json(); // Return the JSON data as a Promise
      })
      .then((data) => {
        localStorage.setItem(`currentSolvedBoard`, JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error solving fetched board:", error);
      });
  }

  useEffect(() => {
    const startingCellsArr =
      JSON.parse(localStorage.getItem("startingCells")) || [];
    if (startingCellsArr) {
      const newStartingCells = new Set(startingCellsArr);
      setStartingCells(newStartingCells);
    }
  }, [puzzle]);
  return (
    <SideNav className="App">
      <SudokuBoard
        className="board"
        puzzle={puzzle}
        instanceName={"Game"}
        startingCells={fetchedStartingCells}
        fetchPuzzle={fetchSudokuPuzzle}
      />
    </SideNav>
  );
}

export default Play;
