# Clud – the slightly unhinged chatbot (parody)

Clud is a front-end only parody of a Claude-style chatbot. Dark, minimal UI; chaotic-but-readable responses; no backend.

Tech
- React + Vite
- Tailwind CSS
- lucide-react icons

Features
- Greeting state with centred input card and playful spark icon
- Sidebar with New Chat, History, Settings, About, and Chaos toggle
- Threads persisted to `localStorage` with titles derived from first user message
- Typing indicator and rule-based responses via `respondTo(message, chaos)`
- Settings and About modals; “attachments coming soon” toast

Install
```bash
npm install
```

Run (dev)
```bash
npm run dev
```
This starts Vite and prints a local URL.

Build
```bash
npm run build
```
Then preview the production build:
```bash
npm run preview
```

Notes
- No backend. All responses are mock and rule-based.
- Chaos Mode injects playful “glitches” into responses.
- Keep expectations low; the brain is still compiling.
