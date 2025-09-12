import React from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { TestResult } from '../types/round2';

interface TestResultsProps {
  results: TestResult[];
  className?: string;
}

export const TestResults: React.FC<TestResultsProps> = ({ results, className = '' }) => {
  if (results.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-medium text-gray-800 text-sm">Test Results:</h4>
      <div className="space-y-1">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 p-2 rounded text-sm ${
              result.passed 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {result.passed ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {result.isHidden ? (
                <div className="flex items-center space-x-1">
                  <EyeOff size={14} className="text-gray-500" />
                  <span className="font-medium">
                    Hidden Test {index - results.filter(r => !r.isHidden).length + 1}
                  </span>
                  <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                    → {result.passed ? 'Passed ✓' : 'Failed ✗'}
                  </span>
                </div>
              ) : (
                <div>
                  <div className="font-medium">
                    Input: {result.input}
                  </div>
                  {result.passed ? (
                    <div className="text-green-600">
                      Output: {result.expected} ✓
                    </div>
                  ) : (
                    <div>
                      <div className="text-red-600">Expected: {result.expected}</div>
                      <div className="text-red-600">Got: {result.actual} ✗</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};