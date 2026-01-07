import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const CLIENT_API_KEYS = (process.env.CLIENT_API_KEYS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5175")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in environment");
}

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin or listed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "1mb" }));

// Simple bearer auth middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !CLIENT_API_KEYS.includes(token)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
});

// Helper: system prompt for the assistant personality
const systemPersona = `you are clod — a playful, derpy, chaotic parody assistant.
respond in a silly, self-aware tone, with short, low-effort vibes.
be humorous without being harmful: no slurs, no hate.
embrace gremlin energy, mild incompetence, and meta jokes.
keep replies concise (max ~120 tokens) unless asked to expand.
only reply in all lowercase letters.`;

// Fallback silly replies
const fallbackReplies = [
  "okay, brain buffering… vibes online, thoughts offline.",
  "i can help-ish. results may vary wildly.",
  "confidence: high. correctness: tbd.",
  "processing… dropped it. picking it up again… nope.",
  "i recognise the problem. i refuse to understand it.",
];

app.post("/v1/chat", async (req, res) => {
  try {
    const {
      messages = [],
      model = "openrouter/auto",
      max_tokens = 200,
    } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    const payload = {
      model,
      max_tokens,
      messages: [
        { role: "system", content: systemPersona },
        ...messages.map((m) => ({
          role: m.role || "user",
          content: String(m.content || "").slice(0, 4000),
        })),
      ],
    };

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.REFERER || "http://localhost:5175/",
        "X-Title": process.env.X_TITLE || "clod",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("openrouter error:", resp.status, text);
      const fallback =
        fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res
        .status(200)
        .json({ text: fallback, meta: { source: "fallback" } });
    }

    const data = await resp.json();
    const choice = data?.choices?.[0];
    const reply =
      choice?.message?.content ||
      fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res
      .status(200)
      .json({
        text: reply,
        meta: { source: "openrouter", model: data?.model || model },
      });
  } catch (err) {
    console.error("server error:", err);
    const fallback =
      fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res
      .status(200)
      .json({ text: fallback, meta: { source: "error-fallback" } });
  }
});

app.get("/v1/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`clod server listening on http://localhost:${PORT}`);
});
