import "./SudokuStyles.css";

function SudokuCell({
  cellKey,
  selectedCell,
  handleCellClick,
  value,
  errorCell,
}) {
  // Check if this cell is the selected one
  const isSelected = selectedCell === cellKey;
  const isError = errorCell ? "red" : "black";
  const cellStyle = {
    backgroundColor: isSelected ? "#00b8ff" : isError, // Highlight if selected
    borderRight:
      cellKey % 9 === 8
        ? "none"
        : cellKey % 9 === 2 || cellKey % 9 === 5
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
    borderBottom:
      cellKey > 72
        ? "none"
        : (cellKey >= 18 && cellKey < 27) ||
            (cellKey >= 45 && cellKey < 54) ||
            cellKey >= 72
          ? "2px solid #00b8ff"
          : "1px solid lightgray",
  };

  return (
    <div
      className={"sudoku-cell"}
      style={cellStyle}
      onClick={() => handleCellClick(cellKey)} // Handle click to select the cell
    >
      <span className={"cell-text"}>
        {value || ""} {/* Display the value of the cell */}
      </span>
    </div>
  );
}

export default SudokuCell;
