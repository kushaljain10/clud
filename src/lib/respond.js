import copy from './copy.json'

const rng = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function respondTo(message, chaos) {
  const msg = (message || '').toLowerCase()
  const glitch = chaos
    ? (t) => `${t} ${pick(['…bzzzt…', '[buffer overflow?]', '(allocating more vibes)', '<<recompiling brain>>'])}`
    : (t) => t

  const responses = {
    greeting: chaos ? copy.greetingChaos : copy.greetingResponses,
    help: chaos ? copy.helpChaos : copy.help,
    dev: chaos ? copy.developerChaos : copy.developer,
    degen: chaos ? copy.cryptoChaos : copy.crypto,
    who: chaos ? copy.identityChaos : copy.identity,
    fallback: chaos ? copy.underConstruction : copy.underConstruction,
  }

  let bucket = 'fallback'
  if (/(hello|hi|hey|yo)\b/.test(msg)) bucket = 'greeting'
  else if (/help\b|assist|guide|explain/.test(msg)) bucket = 'help'
  else if (/(code|bug|error|stack trace|react|js)\b/.test(msg)) bucket = 'dev'
  else if (/(token|memecoin|\bca\b|pump|solana|eth)\b/.test(msg)) bucket = 'degen'
  else if (/(who are you|what are you|about you)/.test(msg)) bucket = 'who'

  const text = glitch(pick(responses[bucket]))
  const mood = chaos ? 'chaotic' : 'cheeky'
  const meta = { delay: rng(700, 1200), mood }
  return { text, mood, meta }
}