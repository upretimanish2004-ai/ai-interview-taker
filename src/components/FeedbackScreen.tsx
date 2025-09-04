import React from 'react';

interface FeedbackScreenProps {
  feedback: string;
  onReset: () => void;
}

// Simple parser to render markdown-style bold text for better readability
const FormattedFeedback: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <div className="text-gray-300 space-y-4">
            {text.split('\n').map((paragraph, pIndex) => {
                // Further split by bold markers
                const segments = paragraph.split(/(\*\*.*?\*\*)/g).filter(Boolean);
                return (
                    <p key={pIndex}>
                        {segments.map((segment, sIndex) => {
                            if (segment.startsWith('**') && segment.endsWith('**')) {
                                return <strong key={sIndex} className="text-white">{segment.slice(2, -2)}</strong>;
                            }
                            return <span key={sIndex}>{segment}</span>;
                        })}
                    </p>
                )
            })}
        </div>
    );
};

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ feedback, onReset }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Interview Feedback
          </h1>
          <p className="text-gray-400">
            Here is a summary of your performance from Alex.
          </p>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 max-h-[50vh] overflow-y-auto">
            <FormattedFeedback text={feedback} />
        </div>

        <button
          onClick={onReset}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
};