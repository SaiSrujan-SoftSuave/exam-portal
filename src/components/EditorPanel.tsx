import React from 'react';
import { Play, Save, CheckCircle } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { TestResults } from './TestResults';
import { QuestionState, TestResult } from '../types/round2';

interface EditorPanelProps {
  questionState: QuestionState;
  placeholder: string;
  language: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSave: () => void;
  onSubmit: () => void;
  className?: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  questionState,
  placeholder,
  language,
  onCodeChange,
  onRun,
  onSave,
  onSubmit,
  className = '',
}) => {
  const canSubmit = questionState.hasRun && !questionState.isSubmitted;

  return (
    <div className={`bg-white flex flex-col ${className}`}>
      <div className="flex-1 p-4">
        <CodeEditor
          value={questionState.code}
          onChange={onCodeChange}
          placeholder={placeholder}
          language={language}
          className="h-full"
        />
      </div>

      {questionState.testResults.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <TestResults results={questionState.testResults} />
        </div>
      )}

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRun}
            disabled={questionState.isSubmitted}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${questionState.isSubmitted
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500'
              }
            `}
            aria-label="Run tests"
          >
            <Play size={16} />
            <span>Run</span>
          </button>

          <button
            onClick={onSave}
            disabled={questionState.isSubmitted}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${questionState.isSubmitted
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500'
              }
            `}
            aria-label="Save code"
          >
            <Save size={16} />
            <span>Save</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${!canSubmit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : questionState.isSubmitted
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500'
              }
            `}
            aria-label={questionState.isSubmitted ? 'Question submitted' : 'Submit question'}
          >
            <CheckCircle size={16} />
            <span>{questionState.isSubmitted ? 'Submitted' : 'Submit Question'}</span>
          </button>
        </div>

        {!questionState.hasRun && (
          <p className="text-sm text-gray-500 mt-2">
            Run your code first to enable submission
          </p>
        )}
      </div>
    </div>
  );
};