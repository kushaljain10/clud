import { useEffect, useMemo, useRef } from "react";
import { InputCard } from "./components/InputCard";
import { ChatThread } from "./components/ChatThread";
import { ToastHost } from "./components/Toast";
import { useChat } from "./hooks/useChat";
import "./index.css";
import { Copy } from "lucide-react";

function App() {
  const {
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
    showToast,
  } = useChat();

  const contentRef = useRef(null);

  const nicknames = [
    "silly goose",
    "chaos goblin",
    "keyboard warrior",
    "space cadet",
    "tryhard",
    "gremlin",
    "goober",
    "clown",
    "meme machine",
    "rookie",
  ];

  const nickname = useMemo(() => {
    const i = Math.floor(Math.random() * nicknames.length);
    return nicknames[i];
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [activeThread?.messages?.length]);

  return (
    <div className="app-root">
      <main className="app-main" aria-live="polite">
        <header className="topbar">
          <div className="brand">
            <img src="/logo.png" alt="Clud logo" className="logo" />
            <span className="brand-name">Clud</span>
          </div>
        </header>
        {!isChatActive ? (
          <section className="greeting">
            <div className="greeting-title">
              <span className="spark" aria-hidden="true" />
              <h1 className="headline" aria-label={`Hey there, ${nickname}`}>
                Hey there, {nickname}
              </h1>
            </div>
            <p className="tagline">
              Brain currently under construction. Please lower expectations.
            </p>
            <div className="center-input" role="search">
              <InputCard
                placeholder="How can I mildly confuse you today?"
                onSend={(text) => sendMessage(text)}
                modelLabel="Clud 0.1 (unstable)"
              />
            </div>
          </section>
        ) : (
          <section className="chat-state">
            <div className="thread" ref={contentRef}>
              <ChatThread thread={activeThread} />
            </div>
            <div className="dock-input">
              <InputCard
                placeholder="How can I mildly confuse you today?"
                onSend={(text) => sendMessage(text)}
                modelLabel="Clud 0.1 (unstable)"
              />
            </div>
          </section>
        )}

        <footer className="contract-bar" aria-label="Contract address">
          <span className="contract-text">
            CA: 2RNWP6pPv2oix4JTsagP61trbPGifJVJDCWVd12opump
          </span>
          <button
            className="copy-btn"
            aria-label="Copy contract address"
            onClick={() => {
              navigator.clipboard.writeText(
                "2RNWP6pPv2oix4JTsagP61trbPGifJVJDCWVd12opump"
              );
              showToast("Contract address copied");
            }}
          >
            <Copy size={16} />
          </button>
        </footer>
      </main>

      {ui.historyOpen && (
        <div className="modal-backdrop" onClick={closeModals}>
          <div
            className="modal"
            role="dialog"
            aria-label="History"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h2>History</h2>
              <button
                className="icon-btn"
                aria-label="Close"
                onClick={closeModals}
              >
                ✕
              </button>
            </header>
            <div className="modal-body history-list">
              {threads.length === 0 ? (
                <p className="muted">No threads yet. Go create chaos!</p>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.id}
                    className="history-item"
                    onClick={() => {
                      loadThread(t.id);
                      closeModals();
                    }}
                  >
                    <span className="item-title">
                      {t.title || "Untitled chaos"}
                    </span>
                    <span className="item-meta">
                      {t.messages.length} messages
                    </span>
                  </button>
                ))
              )}
            </div>
            <footer className="modal-footer">
              <button className="btn subtle" onClick={closeModals}>
                Close
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  if (
                    window.confirm("Delete all threads? This cannot be undone.")
                  ) {
                    clearAllThreads(true);
                    closeModals();
                  }
                }}
              >
                Clear all
              </button>
            </footer>
          </div>
        </div>
      )}

      {ui.settingsOpen && (
        <div className="modal-backdrop" onClick={closeModals}>
          <div
            className="modal"
            role="dialog"
            aria-label="Settings"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h2>Settings</h2>
              <button
                className="icon-btn"
                aria-label="Close"
                onClick={closeModals}
              >
                ✕
              </button>
            </header>
            <div className="modal-body">
              <div className="setting-row">
                <label htmlFor="chaos-toggle">Chaos Mode</label>
                <input
                  id="chaos-toggle"
                  type="checkbox"
                  checked={chaosMode}
                  onChange={() => setChaosMode((v) => !v)}
                />
              </div>
              <p className="muted">No backend. No real AI. Just vibes.</p>
            </div>
            <footer className="modal-footer">
              <button className="btn subtle" onClick={closeModals}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {ui.aboutOpen && (
        <div className="modal-backdrop" onClick={closeModals}>
          <div
            className="modal"
            role="dialog"
            aria-label="About Clud"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h2>About Clud</h2>
              <button
                className="icon-btn"
                aria-label="Close"
                onClick={closeModals}
              >
                ✕
              </button>
            </header>
            <div className="modal-body">
              <p>
                Clud is a parody of a fancy chatbot. It is proudly unhinged,
                occasionally glitchy, and entirely fake. Any resemblance to
                functioning intelligence is coincidental.
              </p>
              <p className="muted">
                Disclaimer: Keep humour friendly. No slurs, no hate.
              </p>
            </div>
            <footer className="modal-footer">
              <button className="btn subtle" onClick={closeModals}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      <ToastHost />
    </div>
  );
}

export default App;
