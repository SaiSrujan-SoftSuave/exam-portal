import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  language: string;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  language,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full min-h-[300px] p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontFamily: 'Fira Code, JetBrains Mono, Consolas, monospace' }}
        spellCheck={false}
        aria-label={`${language} code editor`}
      />
      <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
        {language.toUpperCase()}
      </div>
    </div>
  );
};