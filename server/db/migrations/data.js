const userData = [
  "INSERT INTO P_USER (USERNAME, USER_EMAIL, USER_PASSWORD) VALUES ('test_account', 'test@gmail.com', 'testing')",
];
const languageData = [
  "INSERT INTO P_LANGUAGE (LANGUAGE_NAME, LANGUAGE_SANDBOX) VALUES ('JAVA', 'java_sandbox')",
];
const problemData = [
  "INSERT INTO P_PROBLEM (PROBLEM_NAME, PROBLEM_DESCRIPTION, PROBLEM_TESTCASE, PROBLEM_DIFFICULTY, PROBLEM_ACCEPTANCE, PROBLEM_TIMEOUT, PROBLEM_TEMPLATE) VALUES ('Sum of Two Numbers', 'Given two numbers, add them and return the sum of the integers.\n\nSample Test Case:\n5, 9\n13', '1\n3\t4\n7\n2\n7\t2\n9\n3\n5\t2\n7\n4\n82\t18\n100\n5\n934\t453\n1387\n', 'EASY', '97', 500, 'package sourceCode;\npublic class Submission {\n    public int solution(int a, int b) {\n        return 0;\n    }\n}')",
];
module.exports = {
  userData: userData,
  languageData: languageData,
  problemData: problemData,
};
