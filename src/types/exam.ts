export interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
}

export interface Answer {
  questionId: number;
  selectedOption: string;
}

export interface ExamState {
  currentQuestion: number;
  answers: Record<number, string>;
  visitedQuestions: Set<number>;
  isSubmitted: boolean;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
}