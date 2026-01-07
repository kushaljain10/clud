import { Plus, History, Settings, HelpCircle, Zap } from 'lucide-react'

export function Sidebar({ chaosMode, onToggleChaos, onNewChat, onOpenHistory, onOpenSettings, onOpenAbout, threads, onSelectThread }) {
  return (
    <aside className="sidebar" aria-label="Left navigation">
      <div className="sidebar-top">
        <button className="icon-btn" aria-label="New chat" onClick={onNewChat}>
          <Plus size={18} />
        </button>
        <button className="icon-btn" aria-label="History" onClick={onOpenHistory}>
          <History size={18} />
        </button>
        <button className="icon-btn" aria-label="Settings" onClick={onOpenSettings}>
          <Settings size={18} />
        </button>
        <button className="icon-btn" aria-label="About" onClick={onOpenAbout}>
          <HelpCircle size={18} />
        </button>

        <div className="toggle-row" role="group" aria-label="Chaos mode">
          <button className={`icon-btn ${chaosMode ? 'active' : ''}`} aria-pressed={chaosMode} aria-label="Chaos mode" onClick={onToggleChaos}>
            <Zap size={18} />
          </button>
          <span className="toggle-label">Chaos</span>
        </div>
      </div>

      <div className="sidebar-bottom" aria-label="Avatar">
        <div className="avatar">KJ</div>
      </div>
    </aside>
  )
}