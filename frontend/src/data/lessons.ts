import type { Lesson } from '../types'

export const lessons: Lesson[] = [
  {
    id: 'intro-c',
    title: 'Introduction to C',
    intro: 'C is a foundational language used for systems and embedded programming.',
    explanation: 'You write source code in .c files and compile it using a compiler such as gcc.',
    syntax: '#include <stdio.h>',
    code: '#include <stdio.h>\nint main(void) {\n  printf("Hello, C!\\n");\n  return 0;\n}',
    output: 'Hello, C!',
    commonMistakes: ['Missing semicolon', 'Forgetting return 0 in main'],
    mcqTopic: 'basics'
  },
  {
    id: 'program-structure',
    title: 'Structure of a C Program',
    intro: 'Understand headers, main function, and statements.',
    explanation: 'A C program commonly contains preprocessor directives, function declarations, and main.',
    syntax: 'int main(void) { /* code */ return 0; }',
    code: '#include <stdio.h>\nint main(void){\n  printf("Structured program\\n");\n  return 0;\n}',
    output: 'Structured program',
    commonMistakes: ['Using void main()', 'Unbalanced braces'],
    mcqTopic: 'basics'
  },
  {
    id: 'printf-scanf',
    title: 'printf() and scanf()',
    intro: 'Input and output are core to beginner programs.',
    explanation: 'Use format specifiers like %d, %f, and %c to print and read values safely.',
    syntax: 'scanf("%d", &value);',
    code: '#include <stdio.h>\nint main(void){\n  int age;\n  scanf("%d", &age);\n  printf("Age: %d\\n", age);\n  return 0;\n}',
    output: 'Age: 18',
    commonMistakes: ['Missing & in scanf for non-arrays', 'Wrong format specifier'],
    mcqTopic: 'io'
  },
  {
    id: 'variables-types',
    title: 'Variables and Data Types',
    intro: 'Variables store values with a specific type.',
    explanation: 'Use int, float, char, and double based on value size and precision.',
    syntax: 'int marks = 95;',
    code: '#include <stdio.h>\nint main(void){\n  int a = 10;\n  float b = 2.5f;\n  char c = \'Z\';\n  printf("%d %.1f %c\\n", a, b, c);\n  return 0;\n}',
    output: '10 2.5 Z',
    commonMistakes: ['Using uninitialized variables', 'Assigning incompatible type without cast'],
    mcqTopic: 'variables'
  },
  {
    id: 'operators',
    title: 'Operators',
    intro: 'Operators perform arithmetic and logical operations.',
    explanation: 'C includes arithmetic, comparison, logical, assignment, and bitwise operators.',
    syntax: 'if (a > b && b != 0) { ... }',
    code: '#include <stdio.h>\nint main(void){\n  int a=8,b=3;\n  printf("%d %d\\n", a+b, a%b);\n  return 0;\n}',
    output: '11 2',
    commonMistakes: ['Using = instead of == in conditions'],
    mcqTopic: 'operators'
  },
  {
    id: 'conditionals',
    title: 'Conditional Statements',
    intro: 'Control flow with if, else if, else, and switch.',
    explanation: 'Conditionals execute different code paths based on boolean expressions.',
    syntax: 'if (n % 2 == 0) { ... } else { ... }',
    code: '#include <stdio.h>\nint main(void){\n  int n=7;\n  if(n%2==0) printf("Even"); else printf("Odd");\n  return 0;\n}',
    output: 'Odd',
    commonMistakes: ['Missing braces in nested conditions'],
    mcqTopic: 'conditionals'
  },
  {
    id: 'loops',
    title: 'Loops',
    intro: 'Repeat tasks with for, while, and do-while loops.',
    explanation: 'Loops run while condition is true; ensure update step to avoid infinite loops.',
    syntax: 'for (int i = 0; i < n; i++)',
    code: '#include <stdio.h>\nint main(void){\n  for(int i=1;i<=3;i++) printf("%d ", i);\n  return 0;\n}',
    output: '1 2 3',
    commonMistakes: ['Incorrect loop bounds', 'Forgetting increment/decrement'],
    mcqTopic: 'loops'
  },
  {
    id: 'functions',
    title: 'Functions',
    intro: 'Functions help break code into reusable units.',
    explanation: 'Define function prototypes and implementations with return types.',
    syntax: 'int add(int a, int b);',
    code: '#include <stdio.h>\nint add(int a,int b){return a+b;}\nint main(void){\n  printf("%d", add(2,3));\n  return 0;\n}',
    output: '5',
    commonMistakes: ['Mismatched function declaration and definition'],
    mcqTopic: 'functions'
  },
  {
    id: 'arrays',
    title: 'Arrays',
    intro: 'Arrays store multiple values of the same type.',
    explanation: 'Array index starts from 0; access within bounds only.',
    syntax: 'int arr[5] = {1,2,3,4,5};',
    code: '#include <stdio.h>\nint main(void){\n  int a[3]={10,20,30};\n  printf("%d", a[1]);\n  return 0;\n}',
    output: '20',
    commonMistakes: ['Out-of-bounds index access'],
    mcqTopic: 'arrays'
  },
  {
    id: 'strings',
    title: 'Strings',
    intro: 'Strings are character arrays ending with null terminator.',
    explanation: 'Use functions from string.h like strlen and strcpy carefully.',
    syntax: 'char name[20] = "Codenix";',
    code: '#include <stdio.h>\n#include <string.h>\nint main(void){\n  char s[]="abc";\n  printf("%zu", strlen(s));\n  return 0;\n}',
    output: '3',
    commonMistakes: ['Forgetting space for null terminator'],
    mcqTopic: 'strings'
  },
  {
    id: 'pointers',
    title: 'Pointers',
    intro: 'Pointers store memory addresses.',
    explanation: 'Use * to declare/dereference and & to get address.',
    syntax: 'int *ptr = &value;',
    code: '#include <stdio.h>\nint main(void){\n  int n=9; int *p=&n;\n  printf("%d", *p);\n  return 0;\n}',
    output: '9',
    commonMistakes: ['Dereferencing uninitialized pointers'],
    mcqTopic: 'pointers'
  },
  {
    id: 'structures',
    title: 'Structures',
    intro: 'Structures group related variables into a custom type.',
    explanation: 'Use struct keyword and dot operator to access fields.',
    syntax: 'struct Student { int id; char name[30]; };',
    code: '#include <stdio.h>\nstruct Student {int id;};\nint main(void){\n  struct Student s={101};\n  printf("%d", s.id);\n  return 0;\n}',
    output: '101',
    commonMistakes: ['Using -> on non-pointer structs'],
    mcqTopic: 'structures'
  },
  {
    id: 'file-handling',
    title: 'File Handling',
    intro: 'Read and write files using FILE pointers.',
    explanation: 'Use fopen, fprintf/fscanf, fgets/fputs, and fclose.',
    syntax: 'FILE *fp = fopen("data.txt", "r");',
    code: '#include <stdio.h>\nint main(void){\n  FILE *fp=fopen("a.txt","w");\n  if(fp){fputs("Hi",fp);fclose(fp);}\n  return 0;\n}',
    output: 'Writes to a.txt',
    commonMistakes: ['Not checking fopen return value'],
    mcqTopic: 'file-handling'
  }
]
