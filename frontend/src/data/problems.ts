import type { Difficulty, Problem } from '../types'

const xpByDifficulty: Record<Difficulty, number> = {
  Beginner: 10,
  Easy: 10,
  Medium: 20,
  Challenge: 30
}

const starterCode = '#include <stdio.h>\n\nint main(void) {\n  // write your solution\n  return 0;\n}'

const seed: Array<Omit<Problem, 'id' | 'starterCode' | 'xpReward'>> = [
  { title: 'Print Hello World', difficulty: 'Beginner', topic: 'Basics', description: 'Print Hello World exactly once.', exampleInput: '-', exampleOutput: 'Hello World' },
  { title: 'Print Your Name', difficulty: 'Beginner', topic: 'Basics', description: 'Print your name on one line.', exampleInput: '-', exampleOutput: 'Codenix' },
  { title: 'Add Two Numbers', difficulty: 'Beginner', topic: 'Operators', description: 'Read two integers and print their sum.', exampleInput: '2 3', exampleOutput: '5' },
  { title: 'Subtract Two Numbers', difficulty: 'Beginner', topic: 'Operators', description: 'Read two integers and print subtraction.', exampleInput: '9 4', exampleOutput: '5' },
  { title: 'Multiply Two Numbers', difficulty: 'Beginner', topic: 'Operators', description: 'Read two integers and print product.', exampleInput: '3 7', exampleOutput: '21' },
  { title: 'Divide Two Numbers', difficulty: 'Beginner', topic: 'Operators', description: 'Read two integers and print quotient.', exampleInput: '8 2', exampleOutput: '4' },
  { title: 'Swap Two Variables', difficulty: 'Easy', topic: 'Variables', description: 'Swap two numbers using third variable.', exampleInput: '2 9', exampleOutput: '9 2' },
  { title: 'Largest of Two Numbers', difficulty: 'Easy', topic: 'Conditionals', description: 'Find greater among two numbers.', exampleInput: '10 15', exampleOutput: '15' },
  { title: 'Largest of Three Numbers', difficulty: 'Easy', topic: 'Conditionals', description: 'Find maximum of three integers.', exampleInput: '1 9 5', exampleOutput: '9' },
  { title: 'Check Even or Odd', difficulty: 'Easy', topic: 'Conditionals', description: 'Print Even if number divisible by 2 else Odd.', exampleInput: '7', exampleOutput: 'Odd' },
  { title: 'Check Leap Year', difficulty: 'Easy', topic: 'Conditionals', description: 'Determine if a year is leap year.', exampleInput: '2024', exampleOutput: 'Leap Year' },
  { title: 'Simple Calculator', difficulty: 'Easy', topic: 'Conditionals', description: 'Apply +,-,*,/ operation on two numbers.', exampleInput: '4 5 +', exampleOutput: '9' },
  { title: 'Print 1 to N', difficulty: 'Beginner', topic: 'Loops', description: 'Print numbers from 1 to n.', exampleInput: '5', exampleOutput: '1 2 3 4 5' },
  { title: 'Print N to 1', difficulty: 'Beginner', topic: 'Loops', description: 'Print numbers from n to 1.', exampleInput: '5', exampleOutput: '5 4 3 2 1' },
  { title: 'Sum of First N Numbers', difficulty: 'Easy', topic: 'Loops', description: 'Compute 1+2+...+n.', exampleInput: '4', exampleOutput: '10' },
  { title: 'Factorial of Number', difficulty: 'Easy', topic: 'Loops', description: 'Calculate factorial of n.', exampleInput: '5', exampleOutput: '120' },
  { title: 'Table of Number', difficulty: 'Easy', topic: 'Loops', description: 'Print multiplication table up to 10.', exampleInput: '3', exampleOutput: '3 6 9 ... 30' },
  { title: 'Count Digits', difficulty: 'Easy', topic: 'Loops', description: 'Count number of digits in integer.', exampleInput: '12345', exampleOutput: '5' },
  { title: 'Reverse Number', difficulty: 'Easy', topic: 'Loops', description: 'Reverse digits of number.', exampleInput: '1234', exampleOutput: '4321' },
  { title: 'Palindrome Number', difficulty: 'Medium', topic: 'Loops', description: 'Check if integer is palindrome.', exampleInput: '121', exampleOutput: 'Palindrome' },
  { title: 'Armstrong Number', difficulty: 'Medium', topic: 'Loops', description: 'Check if number is Armstrong.', exampleInput: '153', exampleOutput: 'Armstrong' },
  { title: 'Prime Number Check', difficulty: 'Medium', topic: 'Loops', description: 'Determine if n is prime.', exampleInput: '29', exampleOutput: 'Prime' },
  { title: 'Print Primes in Range', difficulty: 'Medium', topic: 'Loops', description: 'Print all primes between a and b.', exampleInput: '2 10', exampleOutput: '2 3 5 7' },
  { title: 'Fibonacci Series', difficulty: 'Medium', topic: 'Loops', description: 'Print first n Fibonacci terms.', exampleInput: '6', exampleOutput: '0 1 1 2 3 5' },
  { title: 'GCD of Two Numbers', difficulty: 'Medium', topic: 'Functions', description: 'Find greatest common divisor.', exampleInput: '12 18', exampleOutput: '6' },
  { title: 'LCM of Two Numbers', difficulty: 'Medium', topic: 'Functions', description: 'Find least common multiple.', exampleInput: '12 18', exampleOutput: '36' },
  { title: 'Power of Number', difficulty: 'Easy', topic: 'Functions', description: 'Compute a^b.', exampleInput: '2 5', exampleOutput: '32' },
  { title: 'Sum of Digits', difficulty: 'Easy', topic: 'Functions', description: 'Sum all digits in an integer.', exampleInput: '458', exampleOutput: '17' },
  { title: 'Array Traversal', difficulty: 'Beginner', topic: 'Arrays', description: 'Read n elements and print them.', exampleInput: '5\n1 2 3 4 5', exampleOutput: '1 2 3 4 5' },
  { title: 'Array Sum', difficulty: 'Easy', topic: 'Arrays', description: 'Find sum of all array elements.', exampleInput: '3\n2 4 8', exampleOutput: '14' },
  { title: 'Array Maximum', difficulty: 'Easy', topic: 'Arrays', description: 'Print largest array element.', exampleInput: '4\n4 9 1 6', exampleOutput: '9' },
  { title: 'Array Minimum', difficulty: 'Easy', topic: 'Arrays', description: 'Print smallest array element.', exampleInput: '4\n4 9 1 6', exampleOutput: '1' },
  { title: 'Reverse Array', difficulty: 'Medium', topic: 'Arrays', description: 'Reverse array in-place.', exampleInput: '4\n1 2 3 4', exampleOutput: '4 3 2 1' },
  { title: 'Second Largest in Array', difficulty: 'Medium', topic: 'Arrays', description: 'Find second largest unique element.', exampleInput: '5\n2 8 6 8 1', exampleOutput: '6' },
  { title: 'Linear Search', difficulty: 'Easy', topic: 'Arrays', description: 'Return index of target value.', exampleInput: '5\n1 3 5 7 9\n7', exampleOutput: '3' },
  { title: 'Binary Search', difficulty: 'Medium', topic: 'Arrays', description: 'Find target in sorted array.', exampleInput: '5\n1 3 5 7 9\n5', exampleOutput: '2' },
  { title: 'Matrix Addition', difficulty: 'Medium', topic: 'Arrays', description: 'Add two matrices.', exampleInput: '2x2 matrices', exampleOutput: 'Summed matrix' },
  { title: 'Matrix Multiplication', difficulty: 'Challenge', topic: 'Arrays', description: 'Multiply two compatible matrices.', exampleInput: '2x2 matrices', exampleOutput: 'Product matrix' },
  { title: 'String Length', difficulty: 'Beginner', topic: 'Strings', description: 'Find length of string without strlen.', exampleInput: 'codenix', exampleOutput: '7' },
  { title: 'String Reverse', difficulty: 'Easy', topic: 'Strings', description: 'Reverse a string.', exampleInput: 'code', exampleOutput: 'edoc' },
  { title: 'Palindrome String', difficulty: 'Medium', topic: 'Strings', description: 'Check if string is palindrome.', exampleInput: 'madam', exampleOutput: 'Palindrome' },
  { title: 'Count Vowels', difficulty: 'Easy', topic: 'Strings', description: 'Count vowels in input string.', exampleInput: 'education', exampleOutput: '5' },
  { title: 'Copy String', difficulty: 'Easy', topic: 'Strings', description: 'Copy one string to another.', exampleInput: 'codenix', exampleOutput: 'codenix' },
  { title: 'Concatenate Strings', difficulty: 'Easy', topic: 'Strings', description: 'Join two strings manually.', exampleInput: 'code nix', exampleOutput: 'codenix' },
  { title: 'Pointer Basics', difficulty: 'Beginner', topic: 'Pointers', description: 'Print value using pointer dereference.', exampleInput: '9', exampleOutput: '9' },
  { title: 'Swap with Pointers', difficulty: 'Medium', topic: 'Pointers', description: 'Swap two numbers via function pointers.', exampleInput: '2 6', exampleOutput: '6 2' },
  { title: 'Pointer Arithmetic', difficulty: 'Medium', topic: 'Pointers', description: 'Traverse array using pointer arithmetic.', exampleInput: '3\n4 5 6', exampleOutput: '4 5 6' },
  { title: 'Structure Student Record', difficulty: 'Easy', topic: 'Structures', description: 'Store and print student details.', exampleInput: '101 Anya', exampleOutput: '101 Anya' },
  { title: 'Array of Structures', difficulty: 'Medium', topic: 'Structures', description: 'Handle list of student records.', exampleInput: 'n records', exampleOutput: 'printed records' },
  { title: 'Write File Text', difficulty: 'Easy', topic: 'File Handling', description: 'Write text into a file.', exampleInput: 'hello', exampleOutput: 'file updated' },
  { title: 'Read File Text', difficulty: 'Easy', topic: 'File Handling', description: 'Read and print text from a file.', exampleInput: 'file', exampleOutput: 'file content' },
  { title: 'Count File Lines', difficulty: 'Challenge', topic: 'File Handling', description: 'Count number of lines in a file.', exampleInput: 'file', exampleOutput: 'line count' }
]

export const problems: Problem[] = seed.map((problem, index) => ({
  id: `problem-${index + 1}`,
  starterCode,
  xpReward: xpByDifficulty[problem.difficulty],
  ...problem
}))
