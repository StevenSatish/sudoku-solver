package com.example.backend.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

import com.example.backend.api.model.SudokuSolver;
import org.springframework.stereotype.Service;

@Service
public class SudokuService {

    // This method fetches a new Sudoku puzzle
    public int[][] fetchSudokuPuzzle() {
        int lineNumber = (int) (Math.random() * 9000) + 2;
        int[][] board = new int[9][9];
        try (BufferedReader br = new BufferedReader(new FileReader(
                "C:/Users/steve/sudoku-solver/backend/src/main/resources/sudokuBoards.csv"))) {
            // Skip lines until the target line is reached
            for (int i = 0; i < lineNumber - 1; i++) {
                br.readLine();  // Skip line
            }
            // Read the target line
            String line = br.readLine();
            for (int row = 0; row < 9; row++) {
                for (int col = 0; col < 9; col++) {
                    board[row][col] = Character.getNumericValue(line.charAt(row * 9 + col));
                }
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

