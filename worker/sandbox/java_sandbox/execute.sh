#!/bin/bash

testCase=$1
echo TESTCASE_FILE=$testCase.java
mkdir sourceCode
chmod -R 755 sourceCode
cp ./submission/sourceCode/Submission.java ./sourceCode/
javac $testCase.java
cat testData/testData.txt |java $testCase
