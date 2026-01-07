# Clod – Chaotic Chat Parody (React + Vite)

Clod is a parody of a Claude-style chatbot UI: dark, minimal, and slightly unhinged. No backend, no real AI, just rule‑based mock responses with occasional glitch flavour.

Tech

- React + Vite
- No Tailwind; plain CSS with a premium dark theme
- Icons via `lucide-react`

Features

- Greeting state with central rounded input card
- Left sidebar with New Chat, History, Settings, About, and Chaos toggle
- Chat threads with user/assistant bubbles, typing indicator, smooth scroll
- LocalStorage history with thread titles from first message
- History modal with load and Clear All (with confirmation)
- Settings and About panels
- Accessibility: aria labels, focus outlines, reasonable contrast

Install

```
npm install
```

Run (dev)

```
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5174/`).

Build

```
npm run build
```

Notes

- This is a parody project. Keep humour friendly and avoid hateful content.
- Chaos Mode adds playful glitch text. It’s still readable.
- There is no backend; responses are mocked via simple keyword triggers.
