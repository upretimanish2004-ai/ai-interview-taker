import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const synth = window.speechSynthesis;

  const speak = useCallback((text: string) => {
    if (!synth) {
      console.error("Speech Synthesis API not supported.");
      return;
    }
    
    // Cancel any previous speech
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsSpeaking(false);
    };
    
    synth.speak(utterance);
  }, [synth]);

  const cancel = useCallback(() => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [synth]);

  useEffect(() => {
    return () => {
      // Cleanup: cancel speech synthesis when the component unmounts
      if (synth && synth.speaking) {
        synth.cancel();
      }
    };
  }, [synth]);

  return { speak, cancel, isSpeaking };
};