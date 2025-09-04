
import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { Spinner } from './Spinner';
import { MicrophoneIcon, SendIcon, EndCallIcon } from './IconComponents';

interface InterviewScreenProps {
  messages: ChatMessage[];
  isAIThinking: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onSendMessage: (text: string) => void;
  onEndInterview: () => void;
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
  onSendMessage,
  onEndInterview,
  transcript,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Refs to manage appending speech-to-text transcript
  const baseInputValueRef = useRef('');
  const isListeningRef = useRef(isListening);

  useEffect(() => {
    // When the component first detects that listening has started
    if (isListening && !isListeningRef.current) {
      // Store the content of the text box before speech input begins
      baseInputValueRef.current = inputValue;
    }

    // While listening is active, continuously update the text box
    if (isListening) {
      // Combine the original text with the latest transcript
      const separator = baseInputValueRef.current.trim() && transcript.trim() ? ' ' : '';
      const nextValue = baseInputValueRef.current + separator + transcript;
      
      // Only update state if the value has actually changed to prevent render loops
      if (nextValue !== inputValue) {
        setInputValue(nextValue);
      }
    }

    // Keep the ref in sync with the prop for the next render
    isListeningRef.current = isListening;
  }, [isListening, transcript, inputValue]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAIThinking]);
  
  const handleSend = () => {
      if(inputValue.trim()){
          onSendMessage(inputValue);
          setInputValue('');
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-md p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-700">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Technical Interview
        </h1>
        <button 
            onClick={onEndInterview}
            disabled={isAIThinking}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
            <EndCallIcon className="w-5 h-5" />
            <span>End Interview</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isAIThinking && messages.length > 0 && (
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
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
           <div className="h-6 text-center text-gray-400 italic">
             {isListening && 'Listening...'}
             {isSpeaking && !isListening && 'AI is speaking...'}
           </div>
          <div className="w-full flex items-center gap-4">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer or code here... (Enter to send, Shift+Enter for new line)"
                className="flex-grow bg-gray-700 text-gray-200 rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                disabled={isAIThinking || isListening}
            />
            <button
                onClick={handleSend}
                disabled={isAIThinking || isListening || !inputValue.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
            >
                <SendIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onToggleListening}
              disabled={isAIThinking}
              className={`relative w-12 h-12 shrink-0 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
