import { useEffect, useRef, useState } from "react";

interface UseTypingOptions {
  text: string;
  enabled: boolean;
  intervalMs: number;
  onComplete?: () => void;
}

export function useTyping({
  text,
  enabled,
  intervalMs,
  onComplete,
}: UseTypingOptions) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled) {
      setDisplayed("");
      setIsComplete(false);
      return;
    }

    if (intervalMs <= 0) {
      setDisplayed(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    setDisplayed("");
    setIsComplete(false);

    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(id);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [text, enabled, intervalMs]);

  return { displayed, isComplete };
}
