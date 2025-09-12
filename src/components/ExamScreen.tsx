import React, { useState, useCallback, useEffect } from 'react';
import { Timer } from '@/components/Timer';
import { QuestionArea } from '@/components/QuestionArea';
import { QuestionNavigator } from '@/components/QuestionNavigator';
import { SubmissionModal } from '@/components/SubmissionModal';
import { ExamComplete } from '@/components/ExamComplete';
import { useTimer } from '@/hooks/useTimer';
import { useExamState } from '@/hooks/useExamState';
import { examQuestions } from '@/data/questions';
import { CameraPreview } from '@/components/CameraPreview';

import { FullscreenExitModal } from '@/components/FullscreenExitModal';

export const ExamScreen: React.FC = () => {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showFullscreenExitModal, setShowFullscreenExitModal] = useState(false);
  const [isNavigatorCollapsed, setIsNavigatorCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState<'submitted' | 'timeUp'>('submitted');
  
  const totalQuestions = examQuestions.length;

  const handleTimeUp = useCallback(() => {
    setCompletionReason('timeUp');
    setExamCompleted(true);
  }, []);

  const { timer, formatTime, getTimerColor, stopTimer } = useTimer(25, handleTimeUp);

  const {
    examState,
    selectAnswer,
    navigateToQuestion,
    goToNext,
    goToPrevious,
    submitExam,
    isQuestionAnswered,
    canGoNext,
  } = useExamState(totalQuestions);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && examState.currentQuestion > 1) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && canGoNext() && examState.currentQuestion < totalQuestions) {
        goToNext();
      } else if (event.key === 'Enter' && canGoNext() && examState.currentQuestion === totalQuestions) {
        setShowSubmissionModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examState.currentQuestion, goToPrevious, goToNext, canGoNext, totalQuestions]);

  const currentQuestion = examQuestions.find(q => q.id === examState.currentQuestion)!;
  const selectedAnswer = examState.answers[examState.currentQuestion];
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

  const confirmSubmit = () => {
    stopTimer();
    submitExam();
    setCompletionReason('submitted');
    setExamCompleted(true);
    setShowSubmissionModal(false);
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
      />
    );
  }

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
          selectedAnswer={selectedAnswer}
          onAnswerSelect={(optionId) => selectAnswer(examState.currentQuestion, optionId)}
          canGoNext={canGoNext()}
          canGoPrevious={examState.currentQuestion > 1}
          isLastQuestion={examState.currentQuestion === totalQuestions}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="lg:w-2/5 lg:max-w-md">
        <QuestionNavigator
          totalQuestions={totalQuestions}
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
