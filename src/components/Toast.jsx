import { useEffect, useState } from 'react'

let setToastFn = null

export function ToastHost() {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    setToastFn = (m) => {
      setMsg(m)
      setTimeout(() => setMsg(null), 1800)
    }
  }, [])
  return msg ? <div className="toast" role="status">{msg}</div> : null
}

export function showToast(message) {
  if (setToastFn) setToastFn(message)
}