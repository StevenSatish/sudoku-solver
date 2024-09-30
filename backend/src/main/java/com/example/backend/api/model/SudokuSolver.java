package com.example.backend.api.model;

import java.util.*;
//code from https://github.com/ShivanKaul/Sudoku-DLX/blob/master/Sudoku.java

public class SudokuSolver {
    /* SIZE is the size parameter of the Sudoku puzzle, and N is the square of the size.  For
     * a standard Sudoku puzzle, SIZE is 3 and N is 9. */
    int SIZE, N;

    /* The grid contains all the numbers in the Sudoku puzzle.  Numbers which have
     * not yet been revealed are stored as 0. */
    int[][] Grid;

    /* Default constructor.  This will initialize all positions to the default 0
     * value.  Use the read() function to load the Sudoku puzzle from a file or
     * the standard input. */
    public SudokuSolver(int size, int[][] grid) {
        SIZE = size;
        N = size * size;

        Grid = grid;

    }

    /* The main function reads in a Sudoku puzzle from the standard input,
     * unless a file name is provided as a run-time argument, in which case the
     * Sudoku puzzle is loaded from that file.  It then solves the puzzle, and
     * outputs the completed puzzle to the standard output. */
    public static void main(String[] args) {
        int[][] grid = {
                {9, 6, 0, 0, 1, 0, 0, 3, 0},
                {0, 0, 0, 0, 8, 0, 0, 1, 0},
                {3, 0, 1, 0, 0, 9, 7, 0, 0},
                {0, 7, 0, 0, 0, 0, 0, 0, 1},
                {0, 9, 6, 0, 0, 0, 3, 8, 0},
                {1, 0, 0, 0, 0, 0, 0, 2, 0},
                {0, 0, 4, 9, 0, 0, 2, 0, 6},
                {0, 8, 0, 0, 5, 0, 0, 0, 0},
                {0, 3, 0, 0, 2, 0, 0, 5, 9}
        };
        SudokuSolver s = new SudokuSolver(3, grid);

        // Solve the puzzle.  We don't currently check to verify that the puzzle can be
        // successfully completed.  You may add that check if you want to, but it is not
        // necessary.
        long startTime = System.currentTimeMillis(); // test
        s.solve();
        long endTime = System.currentTimeMillis(); // test
        System.out.println(endTime - startTime); // test
        //  s.solve();
        // Print out the (hopefully completed!) puzzle
        s.print();
    }

    public int[][] getBoard() {
        return this.Grid;
    }

    public void solve() {
        AlgorithmXSolver solver = new AlgorithmXSolver();
        solver.run(Grid);
    }

    /* Helper function for the printing of Sudoku puzzle.  This function will print
     * out text, preceded by enough ' ' characters to make sure that the printint out
     * takes at least width characters.  */
    void printFixedWidth(String text, int width) {
        for (int i = 0; i < width - text.length(); i++)
            System.out.print(" ");
        System.out.print(text);
    }

    public void print() {
        // Compute the number of digits necessary to print out each number in the Sudoku puzzle
        int digits = (int) Math.floor(Math.log(N) / Math.log(10)) + 1;

        // Create a dashed line to separate the boxes
        int lineLength = (digits + 1) * N + 2 * SIZE - 3;
        StringBuffer line = new StringBuffer();
        for (int lineInit = 0; lineInit < lineLength; lineInit++)
            line.append('-');

        // Go through the Grid, printing out its values separated by spaces
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                printFixedWidth(String.valueOf(Grid[i][j]), digits);
                // Print the vertical lines between boxes
                if ((j < N - 1) && ((j + 1) % SIZE == 0))
                    System.out.print(" |");
                System.out.print(" ");
            }
            System.out.println();

            // Print the horizontal line between boxes
            if ((i < N - 1) && ((i + 1) % SIZE == 0))
                System.out.println(line.toString());
        }
    }

    public class AlgorithmXSolver {
        private ColumnNode root = null; // this is the starting node of the linked list
        private ArrayList solution = new ArrayList(); // a raw Array List for dynamically storing the solutions. It slows things
        // down a bit, but this how I started and ran out of time before I could come up with a more efficient way to do it.

        // the run method. We pass the Grid[][] as input
        private void run(int[][] initialMatrix) {
            byte[][] matrix = createMatrix(initialMatrix); // create the sparse matrix. We use the type byte to speed things up. I tried using
            ColumnNode doubleLinkedList = createDoubleLinkedLists(matrix);   // create the circular doubly-linked toroidal list
            search(0); // start the Dancing Links process of searching and covering and uncovering recursively
        }

        // create a sparse matrix for Grid
        private byte[][] createMatrix(int[][] initialMatrix) {
            int[][] clues = null; // stores the numbers that are already given on the board i.e. the 'clues'
            ArrayList cluesList = new ArrayList(); // the list used to get the clues. Because we use a raw ArrayList, we later have to cast to int[] before storing in clues
            int counter = 0;
            for (int r = 0; r < N; r++) // iterates over the rows of Grid
            {
                for (int c = 0; c < N; c++) // iterates over the columns of Grid
                {
                    if (initialMatrix[r][c] > 0) // if the number on the Grid is != 0 (the number is a clue and not a blank space to solved for), then store it
                    {
                        cluesList.add(new int[]{initialMatrix[r][c], r, c}); // store the number, the row number and the column number
                        counter++;
                    }
                }
            }
            clues = new int[counter][]; // store the clues once we've gotten them
            for (int i = 0; i < counter; i++) {
                clues[i] = (int[]) cluesList.get(i);
            }

            // Now, we build our sparse matrix
            byte[][] matrix = new byte[N * N * N][4 * N * N];

            for (int d = 0; d < N; d++) {
                // iterate over all the possible rows r
                for (int r = 0; r < N; r++) {
                    // iterator over all the possible columns c
                    for (int c = 0; c < N; c++) {
                        if (!filled(d, r, c, clues)) // if the cell is not already filled
                        {
                            int rowIndex = c + (N * r) + (N * N * d);
                            // there are four 1s in each row, one for each constraint
                            int blockIndex = ((c / SIZE) + ((r / SIZE) * SIZE));
                            int colIndexRow = 3 * N * d + r;
                            int colIndexCol = 3 * N * d + N + c;
                            int colIndexBlock = 3 * N * d + 2 * N + blockIndex;
                            int colIndexSimple = 3 * N * N + (c + N * r);
                            // fill in the 1's
                            matrix[rowIndex][colIndexRow] = 1;
                            matrix[rowIndex][colIndexCol] = 1;
                            matrix[rowIndex][colIndexBlock] = 1;
                            matrix[rowIndex][colIndexSimple] = 1;
                        }
                    }
                }
            }
            return matrix;
        }

        // check if the cell to be filled is already filled with a digit. The idea for this is credited to Alex Rudnick as cited above
        private boolean filled(int digit, int row, int col, int[][] prefill) {
            boolean filled = false;
            if (prefill != null) {
                for (int i = 0; i < prefill.length; i++) {
                    int d = prefill[i][0] - 1;
                    int r = prefill[i][1];
                    int c = prefill[i][2];
                    // calculate the block indices
                    int blockStartIndexCol = (c / SIZE) * SIZE;
                    int blockEndIndexCol = blockStartIndexCol + SIZE;
                    int blockStartIndexRow = (r / SIZE) * SIZE;
                    int blockEndIndexRow = blockStartIndexRow + SIZE;
                    if (d != digit && row == r && col == c) {
                        filled = true;
                    } else if ((d == digit) && (row == r || col == c) && !(row == r && col == c)) {
                        filled = true;
                    } else if ((d == digit) && (row > blockStartIndexRow) && (row < blockEndIndexRow) && (col > blockStartIndexCol) && (col < blockEndIndexCol) && !(row == r && col == c)) {
                        filled = true;
                    }
                }
            }
            return filled;
        }

        private ColumnNode createDoubleLinkedLists(byte[][] matrix) {
            root = new ColumnNode(); // the root is used as an entry-way to the linked list i.e. we access the list through the root
            // create the column heads
            ColumnNode curColumn = root;
            for (int col = 0; col < matrix[0].length; col++) // getting the column heads from the sparse matrix and filling in the information about the
            // constraints. We iterate for all the column heads, thus going through all the items in the first row of the sparse matrix
            {
                // We create the ColumnID that will store the information. We will later map this ID to the current curColumn
                ColumnID id = new ColumnID();
                if (col < 3 * N * N) {
                    // identifying the digit
                    int digit = (col / (3 * N)) + 1;
                    id.number = digit;
                    // is it for a row, column or block?
                    int index = col - (digit - 1) * 3 * N;
                    if (index < N) {
                        id.constraint = 0; // we're in the row constraint
                        id.position = index;
                    } else if (index < 2 * N) {
                        id.constraint = 1; // we're in the column constraint
                        id.position = index - N;
                    } else {
                        id.constraint = 2; // we're in the block constraint
                        id.position = index - 2 * N;
                    }
                } else {
                    id.constraint = 3; // we're in the cell constraint
                    id.position = col - 3 * N * N;
                }
                curColumn.right = new ColumnNode();
                curColumn.right.left = curColumn;
                curColumn = (ColumnNode) curColumn.right;
                curColumn.info = id; // the information about the column is set to the new column
                curColumn.head = curColumn;
            }
            curColumn.right = root; // making the list circular i.e. the right-most ColumnHead is linked to the root
            root.left = curColumn;

            // Once all the ColumnHeads are set, we iterate over the entire matrix
            // Iterate over all the rows
            for (int row = 0; row < matrix.length; row++) {
                // iterator over all the columns
                curColumn = (ColumnNode) root.right;
                Node lastCreatedElement = null;
                Node firstElement = null;
                for (int col = 0; col < matrix[row].length; col++) {
                    if (matrix[row][col] == 1)  // i.e. if the sparse matrix element has a 1 i.e. there is a clue here i.e. we were given this value in the Grid
                    {
                        // create a new data element and link it
                        Node colElement = curColumn;
                        while (colElement.down != null) {
                            colElement = colElement.down;
                        }
                        colElement.down = new Node();
                        if (firstElement == null) {
                            firstElement = colElement.down;
                        }
                        colElement.down.up = colElement;
                        colElement.down.left = lastCreatedElement;
                        colElement.down.head = curColumn;
                        if (lastCreatedElement != null) {
                            colElement.down.left.right = colElement.down;
                        }
                        lastCreatedElement = colElement.down;
                        curColumn.size++;
                    }
                    curColumn = (ColumnNode) curColumn.right;
                }
                // link the first and the last element, again making it circular
                if (lastCreatedElement != null) {
                    lastCreatedElement.right = firstElement;
                    firstElement.left = lastCreatedElement;
                }
            }
            curColumn = (ColumnNode) root.right;
            // link the last column elements with the corresponding columnHeads
            for (int i = 0; i < matrix[0].length; i++) {
                Node colElement = curColumn;
                while (colElement.down != null) {
                    colElement = colElement.down;
                }
                colElement.down = curColumn;
                curColumn.up = colElement;
                curColumn = (ColumnNode) curColumn.right;
            }
            return root; // We've made the doubly-linked list; we return the root of the list
        }

        private void search(int k) {
            if (root.right == root) // if we've run out of columns, we've solved the exact cover problem!
            {
                mapSolvedToGrid(); // map the solved linked list to the grid
                return;
            }
            ColumnNode c = choose(); // we choose a column to cover
            cover(c);
            Node r = c.down;
            while (r != c) {
                if (k < solution.size()) {
                    solution.remove(k); // if we had to enter this loop again
                }
                solution.add(k, r); // the solution is added

                Node j = r.right;
                while (j != r) {
                    cover(j.head);
                    j = j.right;
                }
                search(k + 1); //recursively search

                Node r2 = (Node) solution.get(k);
                Node j2 = r2.left;
                while (j2 != r2) {
                    uncover(j2.head);
                    j2 = j2.left;
                }
                r = r.down;
            }
            uncover(c);
        }

        // this allows us to map the solved linked list to the Grid
        private void mapSolvedToGrid() {
            int[] result = new int[N * N];
            for (Iterator it = solution.iterator(); it.hasNext(); )  // we use Iterators to iterate over every single element of the ArrayList
            // we stop iterating once we run out of elements in the list
            {
                // for the first step, we pull all the values of the solved Sudoku board from the linked list to an array result[] in order
                int number = -1; // initialize number and cell number to be a value that can't occur
                int cellNo = -1;
                Node element = (Node) it.next();
                Node next = element;
                do {
                    if (next.head.info.constraint == 0) { // if we're in the row constraint
                        number = next.head.info.number;
                    } else if (next.head.info.constraint == 3) { // if we're in the cell constraint
                        cellNo = next.head.info.position;
                    }
                    next = next.right;
                } while (element != next);
                result[cellNo] = number; // feed values into result[]
            }
            // for the second step, we feed all the values of the array result[] (in order) to the Grid
            int resultCounter = 0;
            for (int r = 0; r < N; r++) // iterates for the rows
            {
                for (int c = 0; c < N; c++) // iterates for the columns
                {
                    Grid[r][c] = result[resultCounter];
                    resultCounter++;
                }
            }
        }

        private ColumnNode choose() {
            // According to Donald Knuth's paper, it is most efficient to choose the column with the smallest possible size.
            // That is what we do.
            ColumnNode rightOfRoot = (ColumnNode) root.right; // we cast the node to the right of the root to be a ColumnNode
            ColumnNode smallest = rightOfRoot;
            while (rightOfRoot.right != root) {
                rightOfRoot = (ColumnNode) rightOfRoot.right;
                if (rightOfRoot.size < smallest.size) // choosing which column has the lowest size
                {
                    smallest = rightOfRoot;
                }
            }
            return smallest;
        }

        // covers the column; used as a helper method for the search method. Pseudocode by Jonathan Chu (credited above)
        private void cover(Node column) {

            column.right.left = column.left;
            column.left.right = column.right;

            // We also have to do this covering for all the rows in the column
            Node curRow = column.down;
            while (curRow != column) // because it's circular!
            {
                Node curNode = curRow.right;
                while (curNode != curRow) {
                    curNode.down.up = curNode.up;
                    curNode.up.down = curNode.down;
                    curNode.head.size--;
                    curNode = curNode.right;
                }
                curRow = curRow.down;
            }
        }

        // uncovers the column i.e. adds back all the nodes of the column to the linked list
        private void uncover(Node column) {
            Node curRow = column.up;
            while (curRow != column) // do this for all the nodes of the column to be uncovered first, and then reinsert the columnHead
            {
                Node curNode = curRow.left;
                while (curNode != curRow) {
                    curNode.head.size++;
                    curNode.down.up = curNode; // reinserts node into linked list
                    curNode.up.down = curNode;
                    curNode = curNode.left;
                }
                curRow = curRow.up;
            }
            column.right.left = column; // reinserts column head
            column.left.right = column;
        }

        class Node  // we define a node that knows about four other nodes, as well as its column head
        {
            Node left;
            Node right;
            Node up;
            Node down;
            ColumnNode head;
        }

        class ColumnNode extends Node // a special kind of node that contains information about that column
        {
            int size = 0;
            ColumnID info;
        }

        class ColumnID  // helps us store information about that column
        {
            int constraint = -1;
            int number = -1;
            int position = -1;
        }

    }
}
