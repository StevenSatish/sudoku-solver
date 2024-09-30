package com.example.backend.api.model;

import com.example.backend.service.SudokuService;

public class Tester {
    public static void main(String[] args) {
        SudokuService service = new SudokuService();
        int[][] board = service.fetchSudokuPuzzle();
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                System.out.print(board[i][j] + " ");
                if ((j + 1) % 3 == 0 && j != 8) {
                    System.out.print("| ");
                }
            }
            System.out.println();  // Move to the next line after printing each row
            if ((i + 1) % 3 == 0 && i != 8) {
                System.out.println("---------------------");
            }
        }
        System.out.println();
        SudokuSolver solver = new SudokuSolver(3, board);
        solver.solve();
        solver.print();
    }
}

