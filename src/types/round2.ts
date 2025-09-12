export interface CodeQuestion {
  id: number;
  title: string;
  description: string;
  visibleTestCases: TestCase[];
  hiddenTestCaseCount: number;
  language: 'javascript' | 'python' | 'java';
  placeholder: string;
}

export interface SqlQuestion {
  id: number;
  title: string;
  description: string;
  sampleTable: {
    name: string;
    headers: string[];
    rows: string[][];
  };
  placeholder: string;
  testCaseCount: number;
  hiddenTestCaseCount: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  isHidden: boolean;
}

export interface QuestionState {
  code: string;
  hasRun: boolean;
  isSubmitted: boolean;
  testResults: TestResult[];
}

export interface Round2ExamState {
  currentSection: 'coding' | 'sql';
  currentCodingQuestion: number;
  questions: {
    coding1: QuestionState;
    coding2: QuestionState;
    sql: QuestionState;
  };
  timer: {
    minutes: number;
    seconds: number;
    isRunning: boolean;
  };
  isCompleted: boolean;
}
