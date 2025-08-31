
import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';
import { UploadIcon } from './IconComponents';

interface SetupScreenProps {
  onStart: (resumeText: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setFileName(file.name);
          setFileError('');
        };
        reader.onerror = () => {
          setFileError('Failed to read the file.');
        };
        reader.readAsText(file);
      } else {
        setFileError('Please upload a .txt or .md file.');
        setFileName('');
        setResumeText('');
      }
    }
  }, []);

  const handleStartClick = () => {
    if (resumeText.trim()) {
      onStart(resumeText);
    } else {
      setFileError('Please upload your resume to start.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 text-center border border-gray-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            AI Tech Interviewer
          </h1>
          <p className="text-gray-400 text-lg">
            Prepare for your next senior SDE interview. Upload your resume to begin.
          </p>
        </div>
        
        {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700">{error}</div>}

        <div className="space-y-6">
          <label 
            htmlFor="resume-upload" 
            className="relative block w-full border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-blue-400 transition-colors duration-300 bg-gray-900/50"
          >
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <span className="mt-2 block text-sm font-semibold text-gray-300">
              {fileName ? `File: ${fileName}` : 'Upload your resume (.txt, .md)'}
            </span>
            <input 
              id="resume-upload" 
              name="resume-upload" 
              type="file" 
              className="sr-only"
              accept=".txt,.md"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>

          {fileError && <p className="text-red-400 text-sm">{fileError}</p>}
          
          <button
            onClick={handleStartClick}
            disabled={!resumeText || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 text-lg"
          >
            {isLoading ? (
              <>
                <Spinner />
                Initializing...
              </>
            ) : (
              'Start Interview'
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Your resume is only used for this interview session and is not stored.
        </p>
      </div>
    </div>
  );
};
