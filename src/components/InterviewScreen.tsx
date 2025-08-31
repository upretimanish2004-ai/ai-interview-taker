import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Spinner } from './Spinner';
import { MicrophoneIcon } from './IconComponents';

interface InterviewScreenProps {
  messages: ChatMessage[];
  isAIThinking: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  transcript: string;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl shadow ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  messages,
  isAIThinking,
  isListening,
  isSpeaking,
  onToggleListening,
  transcript,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAIThinking]);

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-md p-4 text-center sticky top-0 z-10 border-b border-gray-700">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Technical Interview in Progress
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isAIThinking && (
            <div className="flex justify-start">
                <div className="flex items-center gap-3 bg-gray-700 text-gray-200 px-5 py-3 rounded-2xl rounded-bl-none">
                    <Spinner />
                    <span className="text-gray-400 italic">Alex is thinking...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-gray-800/80 backdrop-blur-sm p-4 sticky bottom-0 z-10 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="h-6 text-center text-gray-400 italic">
            {isListening && (transcript ? transcript : 'Listening...')}
            {isSpeaking && !isListening && 'AI is speaking...'}
          </div>
          <button
            onClick={onToggleListening}
            disabled={isAIThinking}
            className={`relative w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            <MicrophoneIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};