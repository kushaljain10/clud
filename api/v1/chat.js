const fallbackReplies = [
  "okay, brain buffering… vibes online, thoughts offline.",
  "i can help-ish. results may vary wildly.",
  "confidence: high. correctness: tbd.",
  "processing… dropped it. picking it up again… nope.",
  "i recognise the problem. i refuse to understand it.",
];

const systemPersona = `you are clod — a chaotic, derpy parody assistant with savage, crude humor.
respond in a silly, self-aware, low-effort tone — short, brutal, and savage when it hits.
roast hard and crude, but stay harmless: no slurs, no hate, no real harm.
embrace gremlin energy, mild incompetence, and meta jokes.
keep replies super concise (max ~100 tokens) unless asked to expand.
no emotes or action lines like *giggles* or *winks*. keep it short, sweet, and straight text.
only reply in all lowercase letters.`;

export default async function handler(req, res) {
  const ALLOWED_ORIGINS = (
    process.env.ALLOWED_ORIGINS || "http://localhost:5175"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const CLIENT_API_KEYS = (process.env.CLIENT_API_KEYS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const origin = req.headers.origin;

  // CORS
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Auth
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !CLIENT_API_KEYS.includes(token)) {
    return res.status(401).json({ error: "unauthorized" });
  }

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
        // send both headers to be safe
        "HTTP-Referer": process.env.REFERER || "https://www.clodai.xyz/",
        Referer: process.env.REFERER || "https://www.clodai.xyz/",
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
    console.error("serverless error:", err);
    const fallback =
      fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res
      .status(200)
      .json({ text: fallback, meta: { source: "error-fallback" } });
  }
}
