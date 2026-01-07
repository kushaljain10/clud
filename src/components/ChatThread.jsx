export function ChatThread({ thread }) {
  if (!thread) return null
  return (
    <div className="chat-thread">
      {thread.messages.map((m) => (
        <div key={m.id} className={`msg ${m.role}`}>
          <div className="msg-bubble">
            <div className="msg-text">{m.text}</div>
            {m.meta && m.meta.mood && <div className="msg-meta">{m.meta.mood}</div>}
          </div>
        </div>
      ))}
      {thread.typing && (
        <div className="typing-row">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="typing-label">Clud is thinking… or crashing…</span>
        </div>
      )}
    </div>
  )
}