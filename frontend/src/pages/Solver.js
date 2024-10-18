import SideNav from "../components/SideNav";
import SudokuBoard from "../components/SudokuBoard";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";

function Solver() {
  const [puzzle, setPuzzle] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0)),
  );
  const savedBoard = JSON.parse(localStorage.getItem("sudokuSolver"));
  const startingCells = new Set();
  useEffect(() => {
    console.log("savedBoard on re-render at Play", savedBoard);
    // Check if savedBoard exists and is properly formatted
    if (savedBoard && Array.isArray(savedBoard) && savedBoard.length === 9) {
      const isBoardEmpty = savedBoard.every((row) =>
        row.every((cell) => cell === 0),
      );
      if (!isBoardEmpty) {
        setPuzzle(savedBoard); // Use the saved board
      }
    }
  }, []);
  const ref = useRef();
  return (
    <SideNav>
      <div>
        <SudokuBoard
          ref={ref}
          puzzle={puzzle}
          instanceName={"Solver"}
          startingCells={startingCells}
        />
        <Button
          variant="text"
          onClick={() => {
            ref.current?.solveBoard();
          }}
        >
          SOLVE!
        </Button>
      </div>
    </SideNav>
  );
}

export default Solver;
