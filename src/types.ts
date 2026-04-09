export type QuizType = 1 | 2;

export interface QuizKeys {
  multipleChoice: string[]; // 'A', 'B', 'C', 'D'
  trueFalse: string[][]; // 'T', 'F'
  shortAnswer: string[];
}

export interface Quiz {
  id: string;
  name: string;
  type: QuizType;
  keys: QuizKeys;
}

export interface UserAnswers {
  multipleChoice: string[];
  trueFalse: string[][];
  shortAnswer: string[];
}
