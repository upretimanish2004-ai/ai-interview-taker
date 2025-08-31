import { useState, useRef, useEffect, useCallback } from 'react';

// Fix: Define an interface for the SpeechRecognition instance and cast `window` to `any`
// to address TypeScript errors for the non-standard Web Speech API. This avoids name
// collisions between the type and the value and allows access to browser-prefixed properties.
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Polyfill for browsers that might have prefixed API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition: ISpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, setTranscript };
};
