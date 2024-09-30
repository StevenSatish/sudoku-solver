import java.io.*;

public class CsvProcessor {

    public static void processCsv(String inputFile, String outputFile) {
        String line;
        BufferedReader reader = null;
        BufferedWriter writer = null;

        try {
            reader = new BufferedReader(new FileReader(inputFile));
            writer = new BufferedWriter(new FileWriter(outputFile));

            int rowCounter = 0;  // Counter to track row number

            while ((line = reader.readLine()) != null) {
                rowCounter++;

                // Split the line by comma (or another delimiter)
                String[] columns = line.split(",");

                if (columns.length > 0 && rowCounter % 1000 == 0) {
                    // Take only the first column and trim any whitespace
                    String trimmedColumn = columns[0].trim();

                    // Write the result to the output file (only every 1000th row)
                    writer.write(trimmedColumn);
                    writer.newLine(); // Move to the next line
                }
            }

            System.out.println("Processing completed successfully.");

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (reader != null) reader.close();
                if (writer != null) writer.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        // Provide the input and output file paths
        String inputFile = "C:/Users/steve/Downloads/sudoku.csv/sudoku.csv";
        String outputFile = "C:/Users/steve/sudoku-solver/backend/src/main/resources/sudokuBoards.csv";

        // Process the CSV file
        processCsv(inputFile, outputFile);
    }
}
