# clod – chaotic chat parody (react + vite)

clod is a parody of a claude-style chatbot ui: dark, minimal, and slightly unhinged. frontend ships with mock responses; optional backend below connects to openrouter.

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

install

```
npm install
```

run (dev)

```
npm run dev
```

open the local url shown in the terminal (usually `http://localhost:5174/`).

build

```
npm run build
```

notes

- this is a parody project. keep humour friendly and avoid hateful content.
- chaos mode adds playful glitch text. it’s still readable.
- optional backend

## backend server (optional)

the `server/` folder contains a small express api that forwards chat requests to openrouter.

features
- bearer auth via `CLIENT_API_KEYS`
- cors restricted to `ALLOWED_ORIGINS`
- playful system prompt (derpy, silly, non-harmful)
- fallback responses if openrouter fails

setup
1. create `.env` in `server/` based on `.env.example`.
2. install deps: `cd server && npm install`.
3. run: `npm start` (defaults to `http://localhost:8787`).

api
- `POST /v1/chat`
  - headers: `authorization: bearer <client_key>`
  - body:
    ```json
    {
      "model": "openrouter/auto",
      "max_tokens": 200,
      "messages": [
        { "role": "user", "content": "say something silly" }
      ]
    }
    ```
  - response: `{ text: string, meta: { source: 'openrouter' | 'fallback', model?: string } }`
- `GET /v1/health` → `{ ok: true }`

example curl
```
curl -X POST http://localhost:8787/v1/chat \
  -H 'content-type: application/json' \
  -H 'authorization: bearer dev-key-1' \
  -d '{"messages":[{"role":"user","content":"hello there"}]}'
```
