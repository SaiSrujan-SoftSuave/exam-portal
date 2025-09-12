import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Question } from '@/types/exam';

interface QuestionAreaProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (optionId: string) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  onNext,
  onPrevious,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Question Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
            Q{question.id}. {question.question}
          </h2>
          
          <div 
            className="space-y-3"
            role="radiogroup"
            aria-labelledby={`question-${question.id}`}
          >
            {question.options.map((option) => (
              <label
                key={option.id}
                className={`
                  flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedAnswer === option.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => onAnswerSelect(option.id)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-900 leading-relaxed">
                  <span className="font-medium mr-2">{option.id}.</span>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex flex-col sm:flex-row gap-3 max-w-4xl">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`
              flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              min-h-[44px] ${!canGoPrevious
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500'
              }
            `}
            aria-label="Go to previous question"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>
          
          <div className="flex-1"></div>
          
          {isLastQuestion ? (
            <button
              onClick={onSubmit}
              disabled={!canGoNext}
              className={`
                flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                min-h-[44px] ${!canGoNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500'
                }
              `}
              aria-label="Submit exam"
            >
              <Send size={20} />
              <span>Submit Exam</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`
                flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                min-h-[44px] ${!canGoNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                }
              `}
              aria-label="Go to next question"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};