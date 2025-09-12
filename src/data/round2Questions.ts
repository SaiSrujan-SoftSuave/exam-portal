import { CodeQuestion, SqlQuestion } from '../types/round2';

export const codingQuestions: CodeQuestion[] = [
  {
    id: 1,
    title: "Reverse a String",
    description: `Write a function that takes a string as input and returns the string reversed.\n\n**Requirements:**\n- Handle empty strings\n- Preserve original string (don't modify input)\n- Return type should match input type\n\n**Function signature:**\n\`\`\`javascript\nfunction reverseString(str) {\n  // Your code here\n}\n\`\`\``,
    visibleTestCases: [
      { input: '"hello"', expectedOutput: '"olleh"' },
      { input: '"123"', expectedOutput: '"321"' },
      { input: '""', expectedOutput: '""' }
    ],
    hiddenTestCaseCount: 2,
    language: 'javascript',
    placeholder: `function reverseString(str) {\n  // Write your solution here\n  \n}`
  },
  {
    id: 2,
    title: "Find Maximum in Array",
    description: `Write a function that finds the maximum number in an array of integers.\n\n**Requirements:**\n- Handle empty arrays (return null)\n- Handle negative numbers\n- Array will contain at least 0 elements\n\n**Function signature:**\n\`\`\`javascript\nfunction findMax(numbers) {\n  // Your code here\n}\n\`\`\``,
    visibleTestCases: [
      { input: '[1, 5, 3, 9, 2]', expectedOutput: '9' },
      { input: '[-1, -5, -2]', expectedOutput: '-1' },
      { input: '[]', expectedOutput: 'null' }
    ],
    hiddenTestCaseCount: 2,
    language: 'javascript',
    placeholder: `function findMax(numbers) {\n  // Write your solution here\n  \n}`
  }
];

export const sqlQuestion: SqlQuestion = {
  id: 3,
  title: "Find Employees with Salary > 50000",
  description: `Write a SELECT query to find all employees with a salary greater than 50,000.\n\n**Requirements:**\n- Return all columns for matching employees\n- Order results by salary in descending order\n- Use proper SQL syntax`,
  sampleTable: {
    name: 'employees',
    headers: ['id', 'name', 'salary', 'department'],
    rows: [
      ['1', 'Alice', '60000', 'Engineering'],
      ['2', 'Bob', '45000', 'Marketing'],
      ['3', 'Charlie', '55000', 'Engineering'],
      ['4', 'Diana', '48000', 'Sales'],
      ['5', 'Eve', '75000', 'Engineering']
    ]
  },
  placeholder: 'SELECT * FROM employees WHERE ...',
  testCaseCount: 3,
  hiddenTestCaseCount: 1
};