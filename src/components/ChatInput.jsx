import { Plus, Clock, ChevronDown, ArrowUp } from 'lucide-react'

export default function ChatInput({
  value,
  onChange,
  onSend,
  onAttach,
  modelLabel = 'Clud 0.1 (unstable)',
  onOpenHistory,
  ariaLabel = 'Chat input',
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const v = value?.trim();
      if (v) onSend?.(v);
    }
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl bg-panel/80 backdrop-blur border border-border shadow-soft"
      aria-label="Input card"
    >
      <div className="flex items-center gap-2 px-3 pt-3 text-soft">
        <button
          className="rounded-lg hover:bg-white/5 px-2 py-1 transition"
          onClick={() => onAttach?.()}
          aria-label="Add attachment"
        >
          <Plus size={18} />
        </button>
        <button
          className="rounded-lg hover:bg-white/5 px-2 py-1 transition"
          onClick={() => onOpenHistory?.()}
          aria-label="Open history"
        >
          <Clock size={18} />
        </button>
      </div>
      <div className="px-3">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="How can I mildly confuse you today?"
          aria-label={ariaLabel}
          className="w-full resize-none bg-transparent px-2 py-2 text-base focus:outline-none placeholder:text-soft"
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <div className="flex items-center gap-2 text-soft">
          <span className="text-xs">{modelLabel}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
        <button
          onClick={() => {
            const v = value?.trim();
            if (v) onSend?.(v);
          }}
          aria-label="Send message"
          className="rounded-xl bg-accent hover:bg-accent-hover text-black px-3 py-2 transition"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}