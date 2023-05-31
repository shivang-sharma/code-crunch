import java.util.Scanner;
import sourceCode.Submission;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Instant;;

public class P101 {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        final String testResultFilePath = "/java_sandbox/testEngine/submission/testResult.txt";
        // final String testResultFilePath =
        // "/home/shivang/Projects/peetcode/testResult.txt";
        File testResultFile = new File(testResultFilePath);
        try {
            if (!testResultFile.exists()) {
                boolean created = testResultFile.createNewFile();
                if (!created) {
                    if (!testResultFile.createNewFile()) {
                        scanner.close();
                        throw new Exception("Error while creating testResultFile");
                    }
                }
            }
            FileWriter fileWriter = new FileWriter(testResultFile);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            while (scanner.hasNextLine()) {
                String testCaseName = scanner.nextLine();
                bufferedWriter.append("TEST_CASE:" + testCaseName);
                bufferedWriter.newLine();
                String input = scanner.nextLine();
                int a = Integer.parseInt(input.split("\t")[0]);
                int b = Integer.parseInt(input.split("\t")[1]);
                Submission submission = new Submission();
                long beforeExecution = Instant.now().toEpochMilli();
                int actual = submission.solution(a, b);
                long afterExecution = Instant.now().toEpochMilli();
                input = scanner.nextLine();
                int expected = Integer.parseInt(input);
                bufferedWriter.append("ACTUAL:" + actual);
                bufferedWriter.newLine();
                bufferedWriter.append("EXPECTED:" + expected);
                bufferedWriter.newLine();
                bufferedWriter.append("STATUS:" + (actual == expected));
                bufferedWriter.newLine();
                bufferedWriter.append("EXECUTION_TIME:" + (afterExecution - beforeExecution));
                bufferedWriter.newLine();
            }
            bufferedWriter.close();
            scanner.close();
        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }
}
