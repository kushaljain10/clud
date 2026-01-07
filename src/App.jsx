import { useEffect, useMemo, useRef } from "react";
import { InputCard } from "./components/InputCard";
import { ChatThread } from "./components/ChatThread";
import { ToastHost } from "./components/Toast";
import { useChat } from "./hooks/useChat";
import "./index.css";
import { Copy } from "lucide-react";
import copy from "./lib/copy.json";

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
    goHome,
    showToast,
  } = useChat();

  const contentRef = useRef(null);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const placeholder = useMemo(() => pick(copy.inputPlaceholders), []);
  const modelLabel = useMemo(() => pick(copy.modelLabels), []);
  const tagline = useMemo(() => pick(copy.taglines), []);
  const nickname = useMemo(() => pick(copy.insultNicknames), []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [activeThread?.messages?.length]);

  return (
    <div className="app-root">
      <main className="app-main" aria-live="polite">
        <header className="topbar">
          <div
            className="brand"
            role="button"
            tabIndex={0}
            aria-label="go to homepage"
            onClick={goHome}
          >
            <img
              src="/logo.png"
              alt={`${copy.appName} logo`}
              className="logo"
            />
          </div>
        </header>
        {!isChatActive ? (
          <section className="greeting">
            <div className="greeting-title">
              <img
                src="/icon.png"
                alt={`${copy.appName} icon`}
                className="icon"
                id="hey-icon"
                style={{ width: 48, height: 48 }}
              />
              <h1 className="headline" aria-label={`Hey there, ${nickname}`}>
                hey there, {nickname}
              </h1>
            </div>
            <p className="tagline">{tagline}</p>
            <div className="center-input" role="search">
              <InputCard
                placeholder={placeholder}
                onSend={(text) => sendMessage(text)}
                modelLabel={modelLabel}
              />
            </div>
          </section>
        ) : (
          <section className="chat-state">
            <div className="thread" ref={contentRef}>
              <ChatThread thread={activeThread} chaosMode={chaosMode} />
            </div>
            <div className="dock-input">
              <InputCard
                placeholder={placeholder}
                onSend={(text) => sendMessage(text)}
                modelLabel={modelLabel}
              />
            </div>
          </section>
        )}

        <footer className="contract-bar" aria-label="Contract address">
          <span className="contract-text">CA: coming soon</span>
          <button
            className="copy-btn"
            aria-label="Copy contract address"
            onClick={() => {
              navigator.clipboard.writeText("wait for 5 mins bro");
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
                    window.confirm(
                      `${copy.clearHistory.title}\n\n${copy.clearHistory.body}`
                    )
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
                  onChange={() =>
                    setChaosMode((v) => {
                      const next = !v;
                      showToast(
                        next ? copy.toasts.chaosOn : copy.toasts.chaosOff
                      );
                      return next;
                    })
                  }
                />
              </div>
              <p className="muted">{copy.disclaimer}</p>
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
            aria-label={`About ${copy.appName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h2>About {copy.appName}</h2>
              <button
                className="icon-btn"
                aria-label="Close"
                onClick={closeModals}
              >
                ✕
              </button>
            </header>
            <div className="modal-body">
              {copy.about.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              <p className="muted">{copy.disclaimer}</p>
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
