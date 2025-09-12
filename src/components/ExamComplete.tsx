import React from 'react';
import { CheckCircle, Clock, FileText } from 'lucide-react';

interface ExamCompleteProps {
  answeredCount: number;
  totalQuestions: number;
  timeTaken: string;
  reason: 'submitted' | 'timeUp';
}

export const ExamComplete: React.FC<ExamCompleteProps> = ({
  answeredCount,
  totalQuestions,
  timeTaken,
  reason,
}) => {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          {reason === 'submitted' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {reason === 'submitted' ? 'Exam Submitted!' : "Time's Up!"}
          </h1>
          
          <p className="text-gray-600">
            {reason === 'submitted' 
              ? 'Your exam has been successfully submitted.'
              : 'Your exam time has expired and has been automatically submitted.'
            }
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <FileText className="w-5 h-5 mr-2" />
            Exam Summary
          </h2>
          
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="font-medium text-green-600">
                {answeredCount} / {totalQuestions}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-medium">
                {percentage}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time Taken:</span>
              <span className="font-medium">{timeTaken}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 leading-relaxed">
          Your responses have been saved. Results will be available after the exam period ends.
        </div>
      </div>
    </div>
  );
};