import React, { useState, useCallback, useEffect } from 'react';
import { Timer } from '@/components/Timer';
import { QuestionArea } from '@/components/QuestionArea';
import { QuestionNavigator } from '@/components/QuestionNavigator';
import { SubmissionModal } from '@/components/SubmissionModal';
import { ExamComplete } from '@/components/ExamComplete';
import { useTimer } from '@/hooks/useTimer';
import { useExamState } from '@/hooks/useExamState';
import { getQuestions, submitAnswers } from '@/lib/api';
import { Question } from '@/types/exam';
import { CameraPreview } from '@/components/CameraPreview';

import { FullscreenExitModal } from '@/components/FullscreenExitModal';

export const ExamScreen: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showFullscreenExitModal, setShowFullscreenExitModal] = useState(false);
  const [isNavigatorCollapsed, setIsNavigatorCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState<'submitted' | 'timeUp'>('submitted');
  const [allowSecondRound, setAllowSecondRound] = useState(false);

  const {
    examState,
    selectAnswer,
    navigateToQuestion,
    goToNext,
    goToPrevious,
    submitExam,
    isQuestionAnswered,
    canGoNext,
  } = useExamState();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions(5);
        const transformedQuestions = fetchedQuestions.map((q: any) => ({
          id: q.question_id,
          question: q.question_text,
          options: q.options.map((opt: any) => ({
            id: opt.option,
            text: opt.option_text,
          })),
        }));
        setQuestions(transformedQuestions);
        if (transformedQuestions.length > 0) {
          navigateToQuestion(transformedQuestions[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        // Handle error appropriately
      }
    };
    fetchQuestions();
  }, [navigateToQuestion]);

  const totalQuestions = questions.length;
  const questionIds = questions.map(q => q.id);

  const handleTimeUp = useCallback(() => {
    setCompletionReason('timeUp');
    setExamCompleted(true);
  }, []);

  const { timer, formatTime, getTimerColor, stopTimer } = useTimer(25, handleTimeUp);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsNavigatorCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenExitModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleGoToNext = () => goToNext(questionIds);
  const handleGoToPrevious = () => goToPrevious(questionIds);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handleGoToPrevious();
      } else if (event.key === 'ArrowRight' && canGoNext()) {
        handleGoToNext();
      } else if (event.key === 'Enter' && canGoNext() && examState.currentQuestion === questions[questions.length - 1]?.id) {
        setShowSubmissionModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examState.currentQuestion, handleGoToPrevious, handleGoToNext, canGoNext, questions]);

  const currentQuestion = questions.find(q => q.id === examState.currentQuestion);
  const selectedAnswer = examState.currentQuestion !== null ? examState.answers[examState.currentQuestion] : undefined;
  const answeredQuestions = new Set(Object.keys(examState.answers).map(Number));

  const handleSubmit = () => {
    setShowSubmissionModal(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      setShowSubmissionModal(true);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCloseModal = () => {
    setShowSubmissionModal(false);
    window.history.pushState(null, '', window.location.href);
  };

  const confirmSubmit = async () => {
    stopTimer();
    const candidateId = localStorage.getItem('candidateId');
    if (!candidateId) {
        console.error("Candidate ID not found");
        // Handle this error appropriately
        return;
    }
    const submission = {
        candidate_id: parseInt(candidateId, 10),
        answers: Object.entries(examState.answers).map(([questionId, selected_option]) => ({
            question_id: parseInt(questionId, 10),
            selected_option: selected_option
        }))
    };
    try {
        const response = await submitAnswers(submission);
        setAllowSecondRound(response.allow_to_second_round);
        submitExam();
        setCompletionReason('submitted');
        setExamCompleted(true);
        setShowSubmissionModal(false);
    } catch (error) {
        console.error("Failed to submit answers:", error);
        // Handle error appropriately
    }
  };

  const handleReEnterFullscreen = () => {
    document.documentElement.requestFullscreen();
    setShowFullscreenExitModal(false);
  };

  const calculateTimeTaken = () => {
    const initialTime = 25 * 60;
    const currentTime = timer.minutes * 60 + timer.seconds;
    const elapsed = initialTime - currentTime;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (examCompleted) {
    return (
      <ExamComplete
        answeredCount={answeredQuestions.size}
        totalQuestions={totalQuestions}
        timeTaken={calculateTimeTaken()}
        reason={completionReason}
        allowSecondRound={allowSecondRound}
      />
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const currentQuestionIndex = questions.findIndex(q => q.id === examState.currentQuestion);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="flex-1 lg:w-3/5 bg-white flex flex-col min-h-screen lg:min-h-0">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Round 1 — Multiple Choice
            </div>
            <Timer
              timeDisplay={formatTime()}
              color={getTimerColor()}
            />
          </div>
        </div>

        <QuestionArea
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={(optionId) => examState.currentQuestion !== null && selectAnswer(examState.currentQuestion, optionId)}
          canGoNext={canGoNext()}
          canGoPrevious={currentQuestionIndex > 0}
          isLastQuestion={currentQuestionIndex === totalQuestions - 1}
          onNext={handleGoToNext}
          onPrevious={handleGoToPrevious}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="lg:w-2/5 lg:max-w-md">
        <QuestionNavigator
          questions={questions}
          currentQuestion={examState.currentQuestion}
          answeredQuestions={answeredQuestions}
          visitedQuestions={examState.visitedQuestions}
          onQuestionSelect={navigateToQuestion}
          isCollapsed={isNavigatorCollapsed}
          onToggleCollapse={() => setIsNavigatorCollapsed(!isNavigatorCollapsed)}
          isMobile={isMobile}
        />
      </div>

      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={handleCloseModal}
        onConfirm={confirmSubmit}
        answeredCount={answeredQuestions.size}
        totalQuestions={totalQuestions}
      />

      <FullscreenExitModal
        isOpen={showFullscreenExitModal}
        onConfirm={confirmSubmit}
        onCancel={handleReEnterFullscreen}
      />

      <CameraPreview />
    </div>
  );
};