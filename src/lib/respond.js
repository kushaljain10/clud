const rng = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function respondTo(message, chaos) {
  const msg = (message || '').toLowerCase()
  const glitch = chaos ? (t) => `${t} ${pick(['…bzzzt…', '[buffer overflow?]', '(allocating more vibes)', '<<recompiling brain>>'])}` : (t) => t

  const responses = {
    greeting: [
      glitch("Hello! I am Clud, barely held together with duct tape."),
      glitch("Hi! My neurons are NFTs — non-functional thoughts."),
    ],
    help: [
      glitch("Help? Sure. Step 1: Panic. Step 2: We got this."),
      glitch("I can help-ish. Results may vary, batteries not included."),
    ],
    dev: [
      glitch("Bug detected. Have you tried sacrificing a semicolon?"),
      glitch("Error 418: I’m a teapot. Also your code is haunted."),
    ],
    degen: [
      glitch("Token? Confirmed. Deploying memetic chaos. CA: [redacted]."),
      glitch("Memecoin strategy: buy high, sell higher. Definitely not advice."),
    ],
    who: [
      glitch("I’m Clud. A parody assistant. Brain compiling since forever."),
      glitch("Who am I? Glorious bug factory. Chatbotish. Enthusiast of entropy."),
    ],
    fallback: [
      glitch("Processing your words. Outputting questionable wisdom…"),
      glitch("I didn’t understand, but I will pretend confidently."),
      glitch("That’s above my paygrade. I’ll just be chaotic instead."),
    ],
  }

  let bucket = 'fallback'
  if (/(hello|hi)\b/.test(msg)) bucket = 'greeting'
  else if (/help\b/.test(msg)) bucket = 'help'
  else if (/(code|bug|error)\b/.test(msg)) bucket = 'dev'
  else if (/(token|memecoin|\bca\b)/.test(msg)) bucket = 'degen'
  else if (/(who are you)/.test(msg)) bucket = 'who'

  const text = pick(responses[bucket])
  const mood = chaos ? 'chaotic' : 'cheeky'
  const meta = { delay: rng(700, 1200), mood }
  return { text, mood, meta }
}