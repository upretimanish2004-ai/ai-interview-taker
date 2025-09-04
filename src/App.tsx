
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { Chat, GoogleGenAI } from '@google/genai';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { useSpeechToText } from './hooks/useSpeechToText';
import { ChatMessage, InterviewState, InterviewType, InterviewDuration } from './types';
import { getSystemPrompt, FEEDBACK_PROMPT } from './constants';

const App: React.FC = () => {
  const [interviewState, setInterviewState] = useState<InterviewState>(InterviewState.SETUP);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const { speak, isSpeaking, cancel } = useTextToSpeech();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechToText();

  const initializeInterview = useCallback(async (resumeText: string, interviewType: InterviewType, duration: InterviewDuration) => {
    setIsAIThinking(true);
    setError(null);
    setMessages([]);
    setFeedback('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;    ;

      if (!apiKey) {
        throw new Error("API key is missing. Please ensure it is configured in your environment.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = getSystemPrompt(interviewType, duration);

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        }
      });
      chatRef.current = chat;

      const firstPrompt = `Here is the candidate's resume. Please review it and then start the interview by introducing yourself and asking the first question based on the interview type. Resume:\n\n${resumeText}`;
      const response = await chat.sendMessage({ message: firstPrompt });

      const aiResponse = response.text;
      const initialMessage: ChatMessage = { sender: 'ai', text: aiResponse };
      
      setMessages([initialMessage]);
      speak(aiResponse);
      setInterviewState(InterviewState.IN_PROGRESS);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize the interview. Please ensure your API key is correctly configured and try again.");
      setInterviewState(InterviewState.SETUP);
    } finally {
      setIsAIThinking(false);
    }
  }, [speak]);

  const handleUserMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatRef.current) return;

    const newUserMessage: ChatMessage = { sender: 'user', text };
    setMessages(prev => [...prev, newUserMessage]);
    setIsAIThinking(true);
    setError(null);
    cancel(); // Stop any ongoing speech from the AI
    setTranscript(''); // Clear any lingering transcript

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      const aiResponse = response.text;
      const newAiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, newAiMessage]);
      speak(aiResponse);
    } catch (err) {
      console.error(err);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }]);
      speak(errorMessage);
      setError("Failed to get a response from the AI.");
    } finally {
      setIsAIThinking(false);
    }
  }, [cancel, speak, setTranscript]);

  const endInterview = useCallback(async () => {
    if (!chatRef.current) return;
    
    setIsAIThinking(true);
    cancel();
    stopListening();
    
    try {
        const response = await chatRef.current.sendMessage({ message: FEEDBACK_PROMPT });
        setFeedback(response.text);
        setInterviewState(InterviewState.FINISHED);
    } catch (err) {
        console.error("Failed to get feedback:", err);
        setFeedback("Sorry, I was unable to generate feedback for this session.");
        setInterviewState(InterviewState.FINISHED);
    } finally {
        setIsAIThinking(false);
    }
  }, [cancel, stopListening]);
  
  const resetInterview = () => {
      setInterviewState(InterviewState.SETUP);
      setMessages([]);
      setFeedback('');
      setError(null);
      chatRef.current = null;
  };

  const toggleListening = () => {
    if (isSpeaking) {
      cancel();
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const renderContent = () => {
    switch (interviewState) {
      case InterviewState.SETUP:
        return (
          <SetupScreen 
            onStart={initializeInterview} 
            isLoading={isAIThinking} 
            error={error} 
          />
        );
      case InterviewState.IN_PROGRESS:
        return (
          <InterviewScreen
            messages={messages}
            isAIThinking={isAIThinking}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onToggleListening={toggleListening}
            onSendMessage={handleUserMessage}
            onEndInterview={endInterview}
            transcript={transcript}
          />
        );
       case InterviewState.FINISHED:
        return (
            <FeedbackScreen feedback={feedback} onReset={resetInterview} />
        );
      default:
        return <div>Invalid state</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {renderContent()}
    </div>
  );
};

export default App;
