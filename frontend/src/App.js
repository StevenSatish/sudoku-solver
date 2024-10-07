import Play from "./pages/Play.js";
import About from "./pages/About.js";
import Solver from "./pages/Solver.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Play />} />
        <Route path="/about" element={<About />} />
        <Route path="/solver" element={<Solver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
