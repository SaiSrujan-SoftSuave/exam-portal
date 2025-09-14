import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Round2Timer } from './Round2Timer';
import { QuestionPanel } from './QuestionPanel';
import { EditorPanel } from './EditorPanel';
import { useRound2Timer } from '../hooks/useRound2Timer';
import { useRound2ExamState } from '../hooks/useRound2ExamState';
import { codingQuestions, sqlQuestion } from '../data/round2Questions';
import { TestResult } from '../types/round2';
import { Button } from '@/components/ui/button';
import { executeCode } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Round2ExamScreen: React.FC = () => {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    const requestFullscreen = () => {
      const element = document.documentElement as any;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    };

    requestFullscreen();
  }, []);

  const handleTimeUp = useCallback(() => {
    completeExam();
  }, []);

  const { formatTime, getTimerColor, stopTimer } = useRound2Timer(15, handleTimeUp);

  const {
    examState,
    updateCode,
    runTests,
    submitQuestion,
    switchSection,
    switchCodingQuestion,
    completeExam,
    canSubmitExam,
    getCurrentQuestionKey,
  } = useRound2ExamState();

  const runCodingTests = useCallback(async (code: string, questionId: number): Promise<TestResult[]> => {
    const question = codingQuestions.find(q => q.id === questionId)!;
    const testCases = question.visibleTestCases.map(tc => ({ input: tc.input, expected_output: tc.expectedOutput }));
    // Add hidden test cases (mocking their structure for the API)
    for (let i = 0; i < question.hiddenTestCaseCount; i++) {
      testCases.push({ input: `hidden_input_${i}`, expected_output: `hidden_expected_${i}` });
    }

    try {
      const response = await executeCode(code, question.language, testCases);
      return response.map((res: any) => ({
        passed: res.passed,
        input: res.input,
        expected: res.expected,
        actual: res.actual,
        isHidden: res.is_hidden,
      }));
    } catch (error) {
      console.error("Error running coding tests:", error);
      return question.visibleTestCases.map(tc => ({
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: "Error during execution",
        isHidden: false,
      }));
    }
  }, []);

  const runSqlTests = useCallback(async (query: string): Promise<TestResult[]> => {
    const testCases = sqlQuestion.testCaseCount ? Array.from({ length: sqlQuestion.testCaseCount }, (_, i) => ({
      input: `sql_test_input_${i}`,
      expected_output: `sql_expected_output_${i}`,
    })) : [];

    try {
      const response = await executeCode(query, 'sql', testCases);
      return response.map((res: any) => ({
        passed: res.passed,
        input: res.input,
        expected: res.expected,
        actual: res.actual,
        isHidden: res.is_hidden,
      }));
    } catch (error) {
      console.error("Error running SQL tests:", error);
      return sqlQuestion.testCaseCount ? Array.from({ length: sqlQuestion.testCaseCount }, (_, i) => ({
        passed: false,
        input: `Test case ${i + 1}`,
        expected: 'Error during execution',
        actual: 'Error during execution',
        isHidden: false,
      })) : [];
    }
  }, []);

  const handleRun = useCallback(async () => {
    const questionKey = getCurrentQuestionKey();
    const code = examState.questions[questionKey].code;
    let results: TestResult[];
    if (examState.currentSection === 'sql') {
      results = await runSqlTests(code);
    } else {
      results = await runCodingTests(code, examState.currentCodingQuestion);
    }
    runTests(questionKey, results);
  }, [examState, getCurrentQuestionKey, runCodingTests, runSqlTests, runTests]);

  const handleSave = useCallback(() => {
    console.log('Code saved');
  }, []);

  const handleSubmitQuestion = useCallback(() => {
    const questionKey = getCurrentQuestionKey();
    submitQuestion(questionKey);
  }, [getCurrentQuestionKey, submitQuestion]);

  const handleFinalSubmit = useCallback(() => {
    setShowSubmissionModal(true);
  }, []);

  const confirmSubmit = useCallback(() => {
    stopTimer();
    completeExam();
    setShowSubmissionModal(false);
  }, [stopTimer, completeExam]);

  const getCurrentQuestion = () => {
    if (examState.currentSection === 'sql') return sqlQuestion;
    return codingQuestions.find(q => q.id === examState.currentCodingQuestion)!;
  };

  const getCurrentQuestionState = () => {
    const questionKey = getCurrentQuestionKey();
    return examState.questions[questionKey];
  };

  const getPlaceholder = () => {
    if (examState.currentSection === 'sql') return sqlQuestion.placeholder;
    return codingQuestions.find(q => q.id === examState.currentCodingQuestion)!.placeholder;
  };

  const getLanguage = () => {
    if (examState.currentSection === 'sql') return 'sql';
    return codingQuestions.find(q => q.id === examState.currentCodingQuestion)!.language;
  };

  if (examState.isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Round 2 Complete!</h1>
          <p className="text-gray-600 mb-6">Your coding and SQL solutions have been submitted.</p>
          <div className="text-sm text-gray-500">Results will be available after the exam period ends.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Round2Timer timeDisplay={formatTime()} color={getTimerColor()} />

      {/* Section Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-1">
          <button
            onClick={() => switchSection('coding')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              examState.currentSection === 'coding'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Section 1: Coding Questions
          </button>
          <button
            onClick={() => switchSection('sql')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              examState.currentSection === 'sql'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Section 2: SQL Question
          </button>
        </div>

        {/* Coding Question Tabs */}
        {examState.currentSection === 'coding' && (
          <div className="flex space-x-1 mt-3">
            {codingQuestions.map((question) => (
              <button
                key={question.id}
                onClick={() => switchCodingQuestion(question.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  examState.currentCodingQuestion === question.id
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Question {question.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        <QuestionPanel
          question={getCurrentQuestion()}
          type={examState.currentSection}
          className="w-1/2"
        />
        <EditorPanel
          questionState={getCurrentQuestionState()}
          placeholder={getPlaceholder()}
          language={getLanguage()}
          onCodeChange={(code) => updateCode(getCurrentQuestionKey(), code)}
          onRun={handleRun}
          onSave={handleSave}
          onSubmit={handleSubmitQuestion}
          className="w-1/2"
        />
      </div>

      {/* Final Submit Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {canSubmitExam() 
              ? 'All questions completed. Ready to submit!'
              : 'Complete all 3 questions to submit Round 2'
            }
          </div>
          <button
            onClick={handleFinalSubmit}
            disabled={!canSubmitExam()}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${!canSubmitExam()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }
            `}
          >
            ✅ Submit Round 2
          </button>
        </div>
      </div>

      <AlertDialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Round 2?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your Round 2 solutions? You cannot edit your code after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Confirm Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};