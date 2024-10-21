package com.example.backend.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Objects;

import com.example.backend.api.model.SudokuSolver;
import org.springframework.stereotype.Service;

@Service
public class SudokuService {

    // This method fetches a new Sudoku puzzle
    public int[][] fetchSudokuPuzzle() {
        int lineNumber = (int) (Math.random() * 9000) + 2;
        int[][] board = new int[9][9];
        String line = null;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getResourceAsStream("/sudokuBoards.csv"))))) {

            // Skip lines until the target line is reached
            for (int i = 0; i < lineNumber; i++) {
                line = br.readLine();
            }

            // Now, 'line' contains the desired line from the file
            if (line != null) {
                for (int row = 0; row < 9; row++) {
                    for (int col = 0; col < 9; col++) {
                        board[row][col] = Character.getNumericValue(line.charAt(row * 9 + col));
                    }
                }
            } else {
                throw new IOException("Reached end of file before finding the desired line.");
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return board;
    }


    // This method should implement the logic to solve a given Sudoku puzzle
    public int[][] solveSudoku(int[][] board) {
        SudokuSolver solver = new SudokuSolver(3, board);
        solver.solve();
        return solver.getBoard();
    }
}

