import SideNav from "../components/SideNav";
import SudokuBoard from "../components/SudokuBoard";
import { useRef, useState } from "react";
import { Button } from "@mui/material";

function Solver() {
  const [puzzle, setPuzzle] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0)),
  );
  const ref = useRef();
  return (
    <SideNav>
      <div>
        <SudokuBoard ref={ref} puzzle={puzzle} />
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
