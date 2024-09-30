import "./Play.css";
import SideNav from "../components/SideNav";
import SudokuBoard from "../components/SudokuBoard";
import { useEffect, useState } from "react";

function Play() {
  const [puzzle, setPuzzle] = useState([]);

  useEffect(() => {
    fetchSudokuPuzzle();
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
      console.log("Puzzle fetched:", puzzleData);
      setPuzzle(puzzleData); // Set the puzzle state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SideNav>
      <div className="App"></div>
      {!puzzle && <p>Loading...</p>}{" "}
      {/* Display a loading message if puzzle is not available */}
      {puzzle && <SudokuBoard puzzle={puzzle} />}{" "}
      {/* Render SudokuBoard only if puzzle is available */}
    </SideNav>
  );
}

export default Play;
