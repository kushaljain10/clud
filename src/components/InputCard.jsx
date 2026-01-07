import { useState } from 'react'
import { ChevronDown, ArrowUp } from 'lucide-react'
export function InputCard({ placeholder, onSend, modelLabel }) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend(value.trim())
        setValue('')
      }
    }
  }

  return (
    <div className="input-card" aria-label="Message input">
      <div className="input-left" />
      <textarea
        className="input-textarea"
        rows={1}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="input-right">
        <button className="model-select" aria-label="Model selector">
          <span className="model-label">{modelLabel}</span>
          <ChevronDown size={16} />
        </button>
        <button
          className="send-btn"
          aria-label="Send"
          onClick={() => {
            if (value.trim()) {
              onSend(value.trim())
              setValue('')
            }
          }}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  )
}