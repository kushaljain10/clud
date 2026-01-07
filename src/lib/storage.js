const KEY = 'clud_threads_v1';
const ACTIVE_KEY = 'clud_active_thread_id_v1';

export function loadThreads() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads) {
  try {
    localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {}
}

export function getActiveThreadId() {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveThreadId(id) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function createThread(initialMessage) {
  const id = crypto.randomUUID();
  const title = (initialMessage || 'New chat')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 48);
  return {
    id,
    title,
    messages: initialMessage
      ? [{ id: crypto.randomUUID(), role: 'user', text: initialMessage, ts: Date.now() }]
      : [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function upsertThread(threads, thread) {
  const idx = threads.findIndex((t) => t.id === thread.id);
  if (idx === -1) return [...threads, thread];
  const next = [...threads];
  next[idx] = thread;
  return next;
}

export function deleteAllThreads() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(ACTIVE_KEY);
}