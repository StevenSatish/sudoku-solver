import SideNav from "../components/SideNav";
import "./About.css";

function About() {
  return (
    <SideNav>
      <div className="about-container">
        <div className="sections-container">
          <section className="rules-section">
            <h2>Sudoku Rules</h2>
            <ol>
              <li>
                The game is played on a 9x9 grid divided into nine 3x3 subgrids.
              </li>
              <li>
                Some cells are pre-filled with numbers. Your task is to fill the
                empty cells using numbers from 1 to 9.
              </li>
              <li>
                Each row must contain the numbers from 1 to 9 without
                repetition.
              </li>
              <li>
                Each column must contain the numbers from 1 to 9 without
                repetition.
              </li>
              <li>
                Each 3x3 subgrid must contain the numbers from 1 to 9 without
                repetition.
              </li>
            </ol>
          </section>

          <section className="notes-section">
            <h2>Sudoku Notes</h2>
            <p>
              Sudoku notes, also known as pencil marks, are a helpful tool that
              allow players to keep track of possible numbers for each empty
              cell. By noting down potential candidates, you can systematically
              eliminate numbers and solve the puzzle more efficiently.
            </p>
            <ul>
              <li>
                <strong>Recording Possibilities:</strong> For each empty cell,
                write down all possible numbers (from 1 to 9) that do not
                violate the Sudoku rules based on the current state of the grid.
              </li>
              <li>
                <strong>Updating Notes:</strong> As you fill in numbers, update
                your notes to remove numbers that are no longer possible in
                related rows, columns, and subgrids.
              </li>
              <li>
                <strong>Identifying Singles:</strong> If a cell has only one
                possible number in its notes, you can confidently fill in that
                number.
              </li>
              <li>
                <strong>Eliminating Candidates:</strong> Use logical deductions
                to eliminate candidates from notes, such as looking for numbers
                that appear only once in a row, column, or subgrid's notes.
              </li>
              <li>
                <strong>Enhancing Strategy:</strong> Notes help prevent mistakes
                and are especially useful in more challenging puzzles where the
                next move isn't immediately obvious.
              </li>
            </ul>
          </section>

          <section className="about-me-section">
            <h2>About Me</h2>
            <p>
              Hello! I'm Steven Satish, the developer of this Sudoku app. I'm a
              current student at the University of Wisconsin, Madison, pursuing
              a B.S. in Computer Science and Data Science. I created this
              project to practice my web development skills and share my passion
              for Sudoku with others. Check out this project on Github @{" "}
              <a href="https://github.com/StevenSatish/sudoku-solver">
                https://github.com/StevenSatish/sudoku-solver
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </SideNav>
  );
}

export default About;
