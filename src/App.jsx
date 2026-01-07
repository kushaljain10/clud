import { useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatInput from './components/ChatInput.jsx'
import ChatView from './components/ChatView.jsx'
import Modal from './components/Modal.jsx'
import Toast from './components/Toast.jsx'
import { respondTo } from './lib/respondTo.js'
import { createThread, loadThreads, saveThreads, setActiveThreadId, getActiveThreadId, upsertThread, deleteAllThreads } from './lib/storage.js'

function Spark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default function App() {
  const [threads, setThreads] = useState(() => loadThreads());
  const [activeId, setActiveId] = useState(() => getActiveThreadId());
  const active = useMemo(() => threads.find(t => t.id === activeId), [threads, activeId]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chaos, setChaos] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  useEffect(() => { saveThreads(threads); }, [threads]);
  useEffect(() => { setActiveThreadId(activeId); }, [activeId]);

  const ensureActive = () => {
    if (!activeId) {
      const t = createThread('');
      setThreads(prev => [...prev, t]);
      setActiveId(t.id);
      return t;
    }
    return active || threads.find(t => t.id === activeId);
  };

  const onNewChat = () => {
    const t = createThread('');
    setThreads(prev => [...prev, t]);
    setActiveId(t.id);
    setInput('');
  };

  const addToast = (message) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const onAttach = () => {
    addToast('Attachments coming soon. Pretend it’s working.');
  };

  const onSend = async (text) => {
    const t = ensureActive();
    const first = t.messages.length === 0;
    const userMsg = { id: crypto.randomUUID(), role: 'user', text, ts: Date.now() };
    const nextThread = { ...t, messages: [...t.messages, userMsg], updatedAt: Date.now() };
    if (first) {
      nextThread.title = text.replace(/\s+/g, ' ').trim().slice(0, 48);
    }
    setThreads(prev => upsertThread(prev, nextThread));
    setInput('');
    setTyping(true);
    const delay = 700 + Math.floor(Math.random() * 500);
    await new Promise(r => setTimeout(r, delay));
    const res = respondTo(text, chaos);
    const assistantMsg = { id: crypto.randomUUID(), role: 'assistant', text: res.text, mood: res.mood, ts: Date.now() };
    setThreads(prev => {
      const latest = prev.find(x => x.id === nextThread.id) || nextThread;
      const patched = { ...latest, messages: [...latest.messages, assistantMsg], updatedAt: Date.now() };
      return upsertThread(prev, patched);
    });
    setTyping(false);
  };

  const openThread = (id) => {
    setActiveId(id);
    setHistoryOpen(false);
  };

  const clearAll = () => {
    deleteAllThreads();
    setThreads([]);
    setActiveId(null);
    setHistoryOpen(false);
    addToast('Cleared all threads. Fresh chaos awaits.');
  };

  const isEmptyState = !active || active.messages.length === 0;

  return (
    <div className="min-h-screen">
      <Sidebar
        onNewChat={onNewChat}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        chaosMode={chaos}
        setChaosMode={setChaos}
      />

      <main className="pl-16">
        {isEmptyState ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center px-4">
              <div className="flex items-center gap-3">
                <Spark />
                <h1 className="font-display text-4xl tracking-tight">Hey there, rekt</h1>
              </div>
              <p className="text-soft text-sm">Brain currently under construction. Please lower expectations.</p>
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={onSend}
                onAttach={onAttach}
                onOpenHistory={() => setHistoryOpen(true)}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 py-8">
              <ChatView messages={active?.messages || []} typing={typing} />
            </div>
            <div className="sticky bottom-0 w-full pb-8 flex items-center justify-center">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={onSend}
                onAttach={onAttach}
                onOpenHistory={() => setHistoryOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* History Modal */}
      <Modal
        open={historyOpen}
        title="History"
        onClose={() => setHistoryOpen(false)}
        actions={(
          <>
            <button
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-border"
              onClick={() => setHistoryOpen(false)}
            >
              Close
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
              onClick={clearAll}
            >
              Clear all
            </button>
          </>
        )}
      >
        {threads.length === 0 ? (
          <p>No threads yet. Start a new chat.</p>
        ) : (
          <ul className="space-y-2">
            {threads.map(t => (
              <li key={t.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-xl border ${t.id === activeId ? 'border-accent/50 bg-white/5' : 'border-border hover:bg-white/5'} transition`}
                  onClick={() => openThread(t.id)}
                >
                  <div className="text-sm">{t.title || 'Untitled'}</div>
                  <div className="text-xs text-soft">{new Date(t.updatedAt).toLocaleString()}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        open={settingsOpen}
        title="Settings"
        onClose={() => setSettingsOpen(false)}
        actions={(
          <button
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-border"
            onClick={() => setSettingsOpen(false)}
          >
            Close
          </button>
        )}
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Chaos Mode</span>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={chaos}
                onChange={(e) => setChaos(e.target.checked)}
                aria-label="Chaos mode toggle"
              />
              <span className="text-soft">Enable playful glitches</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal
        open={aboutOpen}
        title="About Clud"
        onClose={() => setAboutOpen(false)}
        actions={(
          <button
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-border"
            onClick={() => setAboutOpen(false)}
          >
            Close
          </button>
        )}
      >
        <div className="space-y-3 text-sm">
          <p>
            Clud is a parody chatbot. The brain is still compiling. Responses are comedic and slightly unhinged, but not hateful.
          </p>
          <p className="text-soft">No backend. No real AI calls. Handle with care and low expectations.</p>
        </div>
      </Modal>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} message={t.message} onDone={removeToast} />
        ))}
      </div>
    </div>
  )
}
