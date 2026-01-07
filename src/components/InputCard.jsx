import { useState } from 'react'
import { ChevronDown, ArrowUp } from 'lucide-react'
export function InputCard({ placeholder, onSend, modelLabel, disabled = false }) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (disabled) return
      if (value.trim()) {
        onSend(value.trim())
        setValue('')
      }
    }
  }

  return (
    <div className="input-card" aria-label="Message input">
      <div className="input-top">
        <textarea
          className="input-textarea"
          rows={1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="input-bottom">
        <button className="model-select" aria-label="Model selector" title="Fake model selector" disabled={disabled}>
          <span className="model-label">{modelLabel}</span>
          <ChevronDown size={16} />
        </button>
        <button
          className="send-btn"
          aria-label="Send"
          title="Send into the void"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
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