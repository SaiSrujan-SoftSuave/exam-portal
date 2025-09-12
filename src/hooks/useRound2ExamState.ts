import { useState, useCallback } from 'react';
import { Round2ExamState, QuestionState, TestResult } from '../types/round2';

const initialQuestionState: QuestionState = {
  code: '',
  hasRun: false,
  isSubmitted: false,
  testResults: [],
};

export const useRound2ExamState = () => {
  const [examState, setExamState] = useState<Round2ExamState>({
    currentSection: 'coding',
    currentCodingQuestion: 1,
    questions: {
      coding1: { ...initialQuestionState },
      coding2: { ...initialQuestionState },
      sql: { ...initialQuestionState },
    },
    timer: {
      minutes: 15,
      seconds: 0,
      isRunning: true,
    },
    isCompleted: false,
  });

  const updateCode = useCallback((questionKey: keyof typeof examState.questions, code: string) => {
    setExamState(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [questionKey]: {
          ...prev.questions[questionKey],
          code,
        },
      },
    }));
  }, []);

  const runTests = useCallback((questionKey: keyof typeof examState.questions, results: TestResult[]) => {
    setExamState(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [questionKey]: {
          ...prev.questions[questionKey],
          hasRun: true,
          testResults: results,
        },
      },
    }));
  }, []);

  const submitQuestion = useCallback((questionKey: keyof typeof examState.questions) => {
    setExamState(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [questionKey]: {
          ...prev.questions[questionKey],
          isSubmitted: true,
        },
      },
    }));
  }, []);

  const switchSection = useCallback((section: 'coding' | 'sql') => {
    setExamState(prev => ({ ...prev, currentSection: section }));
  }, []);

  const switchCodingQuestion = useCallback((questionNumber: number) => {
    setExamState(prev => ({ ...prev, currentCodingQuestion: questionNumber }));
  }, []);

  const completeExam = useCallback(() => {
    setExamState(prev => ({ ...prev, isCompleted: true }));
  }, []);

  const canSubmitExam = useCallback(() => {
    return Object.values(examState.questions).every(q => q.isSubmitted);
  }, [examState.questions]);

  const getCurrentQuestionKey = useCallback((): keyof typeof examState.questions => {
    if (examState.currentSection === 'sql') return 'sql';
    return examState.currentCodingQuestion === 1 ? 'coding1' : 'coding2';
  }, [examState.currentSection, examState.currentCodingQuestion]);

  return {
    examState,
    updateCode,
    runTests,
    submitQuestion,
    switchSection,
    switchCodingQuestion,
    completeExam,
    canSubmitExam,
    getCurrentQuestionKey,
  };
};