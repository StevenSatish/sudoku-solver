import "./SudokuStyles.css";

function SudokuCell({ cellKey, selectedCell, handleCellClick, value }) {
  // Check if this cell is the selected one
  const isSelected = selectedCell === cellKey;

  const cellStyle = {
    backgroundColor: isSelected ? "#ADD8E6" : "white", // Highlight if selected
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
