package com.example.backend.api.controller;

import com.example.backend.service.SudokuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
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
    public int[][] solveSudoku(@RequestBody int[][] board) {
        return sudokuService.solveSudoku(board);
    }
}
