package com.example.backend.api.controller;

import com.example.backend.service.SudokuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "https://master.di6ym6l9re7e7.amplifyapp.com")
@RequestMapping("/api/sudoku")
public class SudokuController {

    private final SudokuService sudokuService;

    @Autowired
    public SudokuController(SudokuService sudokuService) {
        this.sudokuService = sudokuService;
    }

    // Endpoint to generate a new Sudoku puzzle
    @GetMapping("/generate")
    public int[][] generateSudoku() {
        return sudokuService.fetchSudokuPuzzle();
    }

    // Endpoint to solve a given Sudoku puzzle
    @PostMapping("/solve")
    public ResponseEntity<int[][]> solveSudoku(@RequestBody int[][] board) {
        if (board == null || board.length != 9 || !isValidSudokuBoard(board)) {
            return ResponseEntity.badRequest().build(); // Return 400 Bad Request if the board is invalid
        }
        int[][] solvedBoard = sudokuService.solveSudoku(board);
        return ResponseEntity.ok(solvedBoard); // Return 200 OK with the solved board
    }

    private boolean isValidSudokuBoard(int[][] board) {
        for (int[] row : board) {
            if (row == null || row.length != 9) {
                return false;
            }
        }
        return true;
    }
}
