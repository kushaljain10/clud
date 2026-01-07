import { useEffect } from 'react'

export default function Toast({ id, message, onDone, duration = 2200 }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(id), duration);
    return () => clearTimeout(t);
  }, [id, onDone, duration]);

  return (
    <div
      role="status"
      className="pointer-events-auto select-none rounded-xl bg-panel border border-border px-3 py-2 text-sm shadow-soft animate-fadeInUp"
    >
      {message}
    </div>
  );
}