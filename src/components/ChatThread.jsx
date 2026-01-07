import copy from '../lib/copy.json'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function ChatThread({ thread, chaosMode }) {
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
          <span className="typing-label">{pick(chaosMode ? copy.typingChaos : copy.typing)}</span>
        </div>
      )}
    </div>
  )
}