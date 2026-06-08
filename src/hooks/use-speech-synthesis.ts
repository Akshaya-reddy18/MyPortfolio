import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechSynthesis() {
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !speechEnabled || !text.trim()) return;

      stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, speechEnabled, stop],
  );

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled((prev) => {
      if (prev) stop();
      return !prev;
    });
  }, [stop]);

  return {
    isSupported,
    isSpeaking,
    speechEnabled,
    setSpeechEnabled,
    toggleSpeech,
    speak,
    stop,
  };
}
