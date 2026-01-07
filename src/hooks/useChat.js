import { useEffect, useMemo, useState } from 'react'
import { respondTo } from '../lib/respond'
import { loadThreads, saveThreads } from '../lib/storage'
import { showToast } from '../components/Toast'

const newId = () => Math.random().toString(36).slice(2)
const titleFrom = (text) => (text || '').trim().slice(0, 48) + ((text || '').length > 48 ? '…' : '')

export function useChat() {
  const [threads, setThreads] = useState(loadThreads())
  const [activeId, setActiveId] = useState(threads[0]?.id || null)
  const [chaosMode, setChaosMode] = useState(false)
  const [ui, setUi] = useState({ historyOpen: false, settingsOpen: false, aboutOpen: false })

  useEffect(() => { saveThreads(threads) }, [threads])

  const activeThread = useMemo(() => threads.find((t) => t.id === activeId) || null, [threads, activeId])
  const isChatActive = !!activeThread && activeThread.messages.length > 0

  const newChat = () => {
    const id = newId()
    const t = { id, title: 'Untitled chaos', messages: [], typing: false }
    setThreads((cur) => [t, ...cur])
    setActiveId(id)
  }

  const sendMessage = async (text) => {
    let id = activeId
    if (!id) {
      const tId = newId()
      const first = { id: newId(), role: 'user', text }
      const t = { id: tId, title: titleFrom(text), messages: [first], typing: true }
      setThreads((cur) => [t, ...cur])
      setActiveId(tId)
      id = tId
    } else {
      setThreads((cur) => cur.map((t) => t.id === id ? { ...t, title: t.messages.length === 0 ? titleFrom(text) : t.title, messages: [...t.messages, { id: newId(), role: 'user', text }], typing: true } : t))
    }

    const res = respondTo(text, chaosMode)
    await new Promise((r) => setTimeout(r, res.meta.delay))

    setThreads((cur) => cur.map((t) => t.id === id ? { ...t, messages: [...t.messages, { id: newId(), role: 'assistant', text: res.text, meta: res.meta }], typing: false } : t))
  }

  const loadThread = (id) => setActiveId(id)
  const clearAllThreads = (confirm) => {
    if (!confirm) {
      setUi((u) => ({ ...u, historyOpen: true }))
      showToast('Confirm clear in history modal')
      return
    }
    setThreads([])
    setActiveId(null)
  }

  const openHistory = () => setUi((u) => ({ ...u, historyOpen: true }))
  const openSettings = () => setUi((u) => ({ ...u, settingsOpen: true }))
  const openAbout = () => setUi((u) => ({ ...u, aboutOpen: true }))
  const closeModals = () => setUi({ historyOpen: false, settingsOpen: false, aboutOpen: false })
  const goHome = () => {
    setActiveId(null)
    closeModals()
  }

  return {
    threads,
    activeThread,
    isChatActive,
    chaosMode,
    setChaosMode,
    newChat,
    sendMessage,
    loadThread,
    clearAllThreads,
    openHistory,
    openSettings,
    openAbout,
    ui,
    closeModals,
    goHome,
    showToast,
  }
}