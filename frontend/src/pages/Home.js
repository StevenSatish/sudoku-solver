import "./Home.css";
import logo from "../logo.svg";
import Button from "@mui/material/Button";
import SideNav from "../components/SideNav";

function Home() {
  return (
    <SideNav>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button variant="contained">Contained</Button>
        </header>
      </div>
    </SideNav>
  );
}

export default Home;
