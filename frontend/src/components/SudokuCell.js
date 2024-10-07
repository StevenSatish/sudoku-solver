import "./SudokuStyles.css";

function SudokuCell({ cellKey, selectedCell, handleCellClick, value }) {
  // Check if this cell is the selected one
  const isSelected = selectedCell === cellKey;

  const cellStyle = {
    backgroundColor: isSelected ? "#ADD8E6" : "white", // Highlight if selected
    borderRight:
      cellKey % 9 === 2 || cellKey % 9 === 5
        ? "2px solid black"
        : "1px solid lightgray",
    borderBottom:
      (cellKey >= 18 && cellKey < 27) || (cellKey >= 45 && cellKey < 54)
        ? "2px solid black"
        : "1px solid lightgray",
  };

  return (
    <div
      className={"sudoku-cell"}
      style={cellStyle}
      onClick={() => handleCellClick(cellKey)} // Handle click to select the cell
    >
      {value || ""} {/* Display the value of the cell */}
    </div>
  );
}

export default SudokuCell;
