export default function ChatView({ messages = [], typing = false }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`animate-fadeInUp ${
              m.role === 'user'
                ? 'self-end max-w-[80%] rounded-2xl bg-white/5 border border-border px-3 py-2'
                : 'self-start max-w-[80%] rounded-2xl bg-panel border border-border px-3 py-2'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
        {typing && (
          <div className="self-start rounded-xl bg-panel border border-border px-3 py-2 text-soft">
            <span className="animate-pulseSoft">Clud is typing…</span>
          </div>
        )}
      </div>
    </div>
  );
}