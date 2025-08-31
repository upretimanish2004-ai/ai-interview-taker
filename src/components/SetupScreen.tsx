import React, { useState, useCallback, useEffect } from 'react';
import { Spinner } from './Spinner';
import { UploadIcon } from './IconComponents';
import { InterviewType, INTERVIEW_TYPES } from '../types';

// Let TypeScript know that pdfjsLib will be available on the window object
declare const pdfjsLib: any;

interface SetupScreenProps {
  onStart: (resumeText: string, interviewType: InterviewType) => void;
  isLoading: boolean;
  error: string | null;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    // Set the workerSrc for pdf.js
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;
    }
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileError('');
    setResumeText('');
    setIsParsing(true);

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            setResumeText(fullText);
          } catch (pdfError) {
            console.error('Error parsing PDF:', pdfError);
            setFileError('Failed to parse PDF file.');
          } finally {
            setIsParsing(false);
          }
        };
        reader.onerror = () => {
          setFileError('Failed to read the file.');
          setIsParsing(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText(e.target?.result as string);
          setIsParsing(false);
        };
        reader.onerror = () => {
          setFileError('Failed to read the file.');
          setIsParsing(false);
        };
        reader.readAsText(file);
      } else {
        setFileError('Please upload a .pdf, .txt, or .md file.');
        setFileName('');
        setIsParsing(false);
      }
    } catch (err) {
      console.error(err);
      setFileError('An unexpected error occurred.');
      setIsParsing(false);
    }
  }, []);

  const handleStartClick = () => {
    if (resumeText.trim() && selectedType) {
      onStart(resumeText, selectedType);
    } else if (!selectedType) {
        setFileError('Please select an interview type.');
    } else {
      setFileError('Please upload your resume to start.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            AI Tech Interviewer
          </h1>
          <p className="text-gray-400 text-lg">
            Prepare for your next senior SDE interview.
          </p>
        </div>
        
        {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700">{error}</div>}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-3">1. Select Interview Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERVIEW_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                    selectedType === type.id
                      ? 'bg-blue-900/50 border-blue-500'
                      : 'bg-gray-700/50 border-gray-600 hover:border-blue-600'
                  }`}
                  disabled={isLoading || isParsing}
                >
                  <h3 className="font-bold text-white">{type.title}</h3>
                  <p className="text-sm text-gray-400">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-3">2. Upload Resume</h2>
            <label 
              htmlFor="resume-upload" 
              className="relative block w-full border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-blue-400 transition-colors duration-300 bg-gray-900/50"
            >
              {isParsing ? (
                <div className='flex items-center justify-center gap-2 text-gray-300'>
                  <Spinner />
                  <span>Parsing PDF...</span>
                </div>
              ) : (
                <>
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                  <span className="mt-2 block text-sm font-semibold text-gray-300">
                    {fileName ? `File: ${fileName}` : 'Upload your resume (.pdf, .txt, .md)'}
                  </span>
                </>
              )}
              <input 
                id="resume-upload" 
                name="resume-upload" 
                type="file" 
                className="sr-only"
                accept=".pdf,.txt,.md"
                onChange={handleFileChange}
                disabled={isLoading || isParsing}
              />
            </label>
            {fileError && <p className="text-red-400 text-sm mt-2">{fileError}</p>}
          </div>
          
          <button
            onClick={handleStartClick}
            disabled={!resumeText || !selectedType || isLoading || isParsing}
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
        <p className="text-xs text-gray-500 text-center">
          Your resume is only used for this interview session and is not stored.
        </p>
      </div>
    </div>
  );
};
