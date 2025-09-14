import { useState, useCallback } from 'react';
import { ExamState } from '@/types/exam';

export const useExamState = () => {
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: null,
    answers: {},
    visitedQuestions: new Set(),
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

  const goToNext = useCallback((questionIds: number[]) => {
    const currentIndex = questionIds.findIndex(id => id === examState.currentQuestion);
    if (currentIndex < questionIds.length - 1) {
      navigateToQuestion(questionIds[currentIndex + 1]);
    }
  }, [examState.currentQuestion, navigateToQuestion]);

  const goToPrevious = useCallback((questionIds: number[]) => {
    const currentIndex = questionIds.findIndex(id => id === examState.currentQuestion);
    if (currentIndex > 0) {
      navigateToQuestion(questionIds[currentIndex - 1]);
    }
  }, [examState.currentQuestion, navigateToQuestion]);

  const submitExam = useCallback(() => {
    setExamState(prev => ({ ...prev, isSubmitted: true }));
  }, []);

  const isQuestionAnswered = useCallback((questionId: number) => {
    return questionId in examState.answers;
  }, [examState.answers]);

  const canGoNext = useCallback(() => {
    if (examState.currentQuestion === null) return false;
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