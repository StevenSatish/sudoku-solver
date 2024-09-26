const SudokuCell = () => {
  return (
    <div
      style={{
        border: "1px solid #000", // border for individual cells
        textAlign: "center",
        fontSize: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {"X"}
    </div>
  );
};

export default SudokuCell;
