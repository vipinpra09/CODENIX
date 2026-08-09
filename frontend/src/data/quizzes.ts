import type { QuizQuestion } from '../types'

export const quizzes: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'basics',
    difficulty: 'Beginner',
    question: 'Which function is the entry point of a C program?',
    options: ['start()', 'main()', 'run()', 'init()'],
    correctAnswer: 1,
    explanation: 'Execution starts from main() in standard C.'
  },
  {
    id: 'q2',
    topic: 'io',
    difficulty: 'Beginner',
    question: 'Which symbol is used to get address for scanf on int variable x?',
    options: ['*x', '&x', '#x', '@x'],
    correctAnswer: 1,
    explanation: 'scanf needs memory address, so use &x.'
  },
  {
    id: 'q3',
    topic: 'variables',
    difficulty: 'Beginner',
    question: 'Which data type stores decimal numbers?',
    options: ['int', 'char', 'float', 'void'],
    correctAnswer: 2,
    explanation: 'float is used for decimal values.'
  },
  {
    id: 'q4',
    topic: 'operators',
    difficulty: 'Easy',
    question: 'What is the result of 10 % 3?',
    options: ['0', '1', '2', '3'],
    correctAnswer: 1,
    explanation: '10 divided by 3 leaves remainder 1.'
  },
  {
    id: 'q5',
    topic: 'conditionals',
    difficulty: 'Easy',
    question: 'Which operator checks equality?',
    options: ['=', '===', '==', ':='],
    correctAnswer: 2,
    explanation: '== compares values in C.'
  },
  {
    id: 'q6',
    topic: 'loops',
    difficulty: 'Easy',
    question: 'Which loop runs at least once?',
    options: ['for', 'while', 'do-while', 'none'],
    correctAnswer: 2,
    explanation: 'do-while checks condition after the loop body.'
  },
  {
    id: 'q7',
    topic: 'functions',
    difficulty: 'Easy',
    question: 'Which keyword returns control from function?',
    options: ['back', 'return', 'break', 'exit'],
    correctAnswer: 1,
    explanation: 'return exits function and optionally returns value.'
  },
  {
    id: 'q8',
    topic: 'arrays',
    difficulty: 'Easy',
    question: 'Array index in C starts from?',
    options: ['1', '0', '-1', 'depends'],
    correctAnswer: 1,
    explanation: 'C arrays are zero-indexed.'
  },
  {
    id: 'q9',
    topic: 'strings',
    difficulty: 'Easy',
    question: 'String in C is terminated by?',
    options: ['\\0', '\\n', 'space', 'EOF'],
    correctAnswer: 0,
    explanation: 'The null character terminates strings.'
  },
  {
    id: 'q10',
    topic: 'pointers',
    difficulty: 'Medium',
    question: 'Which operator dereferences a pointer?',
    options: ['&', '*', '%', '$'],
    correctAnswer: 1,
    explanation: '* accesses value at pointer address.'
  }
]

export const quizzesByTopic = quizzes.reduce<Record<string, QuizQuestion[]>>((acc, quiz) => {
  if (!acc[quiz.topic]) {
    acc[quiz.topic] = []
  }
  acc[quiz.topic].push(quiz)
  return acc
}, {})
