import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="submission-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 id="submission-title" className="text-lg font-bold text-gray-900 mb-2">
                Submit Exam?
              </h3>
              <div className="text-gray-600 space-y-2">
                <p>Are you sure you want to submit your exam?</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span>Answered questions:</span>
                    <span className="font-medium text-green-600">{answeredCount}</span>
                  </div>
                  {unansweredCount > 0 && (
                    <div className="flex justify-between">
                      <span>Unanswered questions:</span>
                      <span className="font-medium text-red-600">{unansweredCount}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ You cannot return after submitting.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-red-500"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );
};