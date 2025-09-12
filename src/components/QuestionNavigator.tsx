import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  visitedQuestions: Set<number>;
  onQuestionSelect: (questionNumber: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  visitedQuestions,
  onQuestionSelect,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}) => {
  const getQuestionStatus = (questionNumber: number) => {
    if (answeredQuestions.has(questionNumber)) return 'answered';
    if (visitedQuestions.has(questionNumber)) return 'visited';
    return 'unvisited';
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (isActive) return 'bg-blue-600 text-white border-blue-600';
    
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white border-green-500';
      case 'visited':
        return 'bg-yellow-400 text-gray-800 border-yellow-400';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300';
    }
  };

  const getAriaLabel = (questionNumber: number, status: string) => {
    const statusText = status === 'answered' ? 'answered' : 
                      status === 'visited' ? 'seen but not answered' : 'not attempted';
    return `Question ${questionNumber} - ${statusText}`;
  };

  if (isMobile && isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="w-full bg-white border-t border-gray-200 p-4 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-colors"
        aria-expanded={false}
        aria-controls="question-navigator"
      >
        <span className="font-medium">Question Summary</span>
        <ChevronDown size={20} />
      </button>
    );
  }

  return (
    <div className="bg-white border-l border-gray-200 lg:border-l-0 lg:border-t lg:border-gray-200">
      {isMobile && (
        <button
          onClick={onToggleCollapse}
          className="w-full bg-gray-50 p-4 flex items-center justify-between text-gray-600 hover:bg-gray-100 transition-colors border-b border-gray-200"
          aria-expanded={true}
          aria-controls="question-navigator"
        >
          <span className="font-medium">Question Summary</span>
          <ChevronUp size={20} />
        </button>
      )}
      
      <div id="question-navigator" className="p-4">
        {!isMobile && (
          <h3 className="font-semibold text-gray-800 mb-4 text-sm">Question Summary</h3>
        )}
        
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const status = getQuestionStatus(questionNumber);
            const isActive = questionNumber === currentQuestion;
            
            return (
              <button
                key={questionNumber}
                onClick={() => onQuestionSelect(questionNumber)}
                className={`
                  w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-200
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${getStatusColor(status, isActive)}
                `}
                aria-label={getAriaLabel(questionNumber, status)}
                aria-current={isActive ? 'step' : undefined}
              >
                {questionNumber}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-gray-600">Seen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-gray-600">Not attempted</span>
          </div>
        </div>
      </div>
    </div>
  );
};