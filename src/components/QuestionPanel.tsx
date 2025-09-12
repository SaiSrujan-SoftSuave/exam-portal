import React from 'react';
import { Eye } from 'lucide-react';
import { CodeQuestion, SqlQuestion, TestCase } from '../types/round2';
import { SqlTable } from './SqlTable';

interface QuestionPanelProps {
  question: CodeQuestion | SqlQuestion;
  type: 'coding' | 'sql';
  className?: string;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ question, type, className = '' }) => {
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={index} className="font-bold text-gray-800 mt-4 mb-2">{line.slice(2, -2)}</h4>;
      }
      if (line.startsWith('```') && line.endsWith('```')) {
        return null; // Skip code fence markers
      }
      if (line.startsWith('```')) {
        return null; // Skip opening code fence
      }
      if (line === '```') {
        return null; // Skip closing code fence
      }
      if (line.startsWith('`') && line.endsWith('`')) {
        return <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{line.slice(1, -1)}</code>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className={`bg-white border-r border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Q{question.id}. {question.title}
        </h2>
        
        <div className="prose prose-sm max-w-none mb-6 text-gray-700">
          {renderMarkdown(question.description)}
        </div>

        {type === 'coding' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Eye size={16} className="mr-2" />
                Sample Test Cases
              </h3>
              <div className="space-y-2">
                {(question as CodeQuestion).visibleTestCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                    <div className="text-blue-600">Input: {testCase.input}</div>
                    <div className="text-green-600">Expected Output: {testCase.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
              <strong>Note:</strong> +{(question as CodeQuestion).hiddenTestCaseCount} hidden test cases will run on submission
            </div>
          </div>
        )}

        {type === 'sql' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Sample Database Table</h3>
              <SqlTable
                tableName={(question as SqlQuestion).sampleTable.name}
                headers={(question as SqlQuestion).sampleTable.headers}
                rows={(question as SqlQuestion).sampleTable.rows}
              />
            </div>
            
            <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
              <strong>Note:</strong> Write a SELECT query. {(question as SqlQuestion).testCaseCount} test cases ({(question as SqlQuestion).hiddenTestCaseCount} hidden) will validate your result.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};