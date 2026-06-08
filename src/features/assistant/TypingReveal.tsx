import { useEffect, useState } from "react";

interface TypingRevealProps {
  text: string;
  active?: boolean;
  speedMs?: number;
}

export function TypingReveal({ text, active = true, speedMs = 14 }: TypingRevealProps) {
  const [visible, setVisible] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setVisible(text);
      return;
    }

    setVisible("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [text, active, speedMs]);

  return <>{visible}</>;
}
