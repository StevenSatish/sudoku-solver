import "./Play.css";
import SideNav from "../components/SideNav";
import SudokuBoard from "../components/SudokuBoard";

function Play() {
  return (
    <SideNav>
      <div className="App"></div>
      <SudokuBoard />
    </SideNav>
  );
}

export default Play;
