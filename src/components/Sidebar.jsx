import { MessageSquarePlus, History, Settings, HelpCircle, Zap } from 'lucide-react'

export default function Sidebar({
  onNewChat,
  onOpenHistory,
  onOpenSettings,
  onOpenAbout,
  chaosMode,
  setChaosMode,
}) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-panel/70 backdrop-blur border-r border-border flex flex-col items-center justify-between py-4">
      <div className="flex flex-col items-center gap-3">
        <button
          aria-label="New chat"
          className="p-2 rounded-xl hover:bg-white/5 transition"
          onClick={onNewChat}
        >
          <MessageSquarePlus size={20} />
        </button>
        <button
          aria-label="History"
          className="p-2 rounded-xl hover:bg-white/5 transition"
          onClick={onOpenHistory}
        >
          <History size={20} />
        </button>
        <button
          aria-label="Settings"
          className="p-2 rounded-xl hover:bg-white/5 transition"
          onClick={onOpenSettings}
        >
          <Settings size={20} />
        </button>
        <button
          aria-label="About"
          className="p-2 rounded-xl hover:bg-white/5 transition"
          onClick={onOpenAbout}
        >
          <HelpCircle size={20} />
        </button>
        <button
          aria-label="Toggle Chaos Mode"
          className={`p-2 rounded-xl transition ${chaosMode ? 'bg-accent/20 text-accent' : 'hover:bg-white/5'}`}
          onClick={() => setChaosMode?.(!chaosMode)}
        >
          <Zap size={20} />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div
          aria-label="Avatar"
          className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-sm"
        >
          KJ
        </div>
      </div>
    </aside>
  );
}