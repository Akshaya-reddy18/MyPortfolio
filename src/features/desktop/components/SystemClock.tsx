import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};

export function SystemClock({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-end leading-tight select-none",
        className,
      )}
      aria-live="off"
    >
      <time
        className="akshaya-type-mono text-sm tabular-nums text-cyan-300"
        dateTime={now.toISOString()}
      >
        {now.toLocaleTimeString(undefined, TIME_OPTIONS)}
      </time>
      <time
        className="akshaya-type-caption text-muted-foreground hidden sm:block"
        dateTime={now.toISOString()}
      >
        {now.toLocaleDateString(undefined, DATE_OPTIONS)}
      </time>
    </div>
  );
}
