import { useState, useCallback } from 'react';
import { ExamState, Answer } from '@/types/exam';

export const useExamState = (totalQuestions: number) => {
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: 1,
    answers: {},
    visitedQuestions: new Set([1]),
    isSubmitted: false,
  });

  const selectAnswer = useCallback((questionId: number, optionId: string) => {
    setExamState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
    }));
  }, []);

  const navigateToQuestion = useCallback((questionNumber: number) => {
    setExamState(prev => ({
      ...prev,
      currentQuestion: questionNumber,
      visitedQuestions: new Set([...prev.visitedQuestions, questionNumber]),
    }));
  }, []);

  const goToNext = useCallback(() => {
    if (examState.currentQuestion < totalQuestions) {
      navigateToQuestion(examState.currentQuestion + 1);
    }
  }, [examState.currentQuestion, totalQuestions, navigateToQuestion]);

  const goToPrevious = useCallback(() => {
    if (examState.currentQuestion > 1) {
      navigateToQuestion(examState.currentQuestion - 1);
    }
  }, [examState.currentQuestion, navigateToQuestion]);

  const submitExam = useCallback(() => {
    setExamState(prev => ({ ...prev, isSubmitted: true }));
  }, []);

  const isQuestionAnswered = useCallback((questionId: number) => {
    return questionId in examState.answers;
  }, [examState.answers]);

  const canGoNext = useCallback(() => {
    return isQuestionAnswered(examState.currentQuestion);
  }, [examState.currentQuestion, isQuestionAnswered]);

  return {
    examState,
    selectAnswer,
    navigateToQuestion,
    goToNext,
    goToPrevious,
    submitExam,
    isQuestionAnswered,
    canGoNext,
  };
};