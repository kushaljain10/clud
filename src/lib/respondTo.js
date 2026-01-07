// Rule-based responder for Clud
export function respondTo(message, chaos = false) {
  const msg = (message || '').toLowerCase();

  const responses = {
    greeting: {
      text: `Oh, hello. I am absolutely not prepared for this. But sure, let's vibe.`,
      mood: 'cheeky',
      meta: { tag: 'greeting' },
    },
    help: {
      text: `Help? Bold ask. I’ll try: step 1) press random buttons; step 2) pretend it worked; step 3) profit.`,
      mood: 'helpful-chaotic',
      meta: { tag: 'help' },
    },
    dev: {
      text: `Sounds dev-ish. Did you try turning it off and on? Or sprinkling console.logs like confetti? Bugs fear logging.`,
      mood: 'dev',
      meta: { tag: 'dev' },
    },
    degen: {
      text: `Tokens? Memecoins? CA? Sir, this is a Wendy’s. Fine: DYOR, check liquidity, avoid “guaranteed 10x” tweets.`,
      mood: 'degen',
      meta: { tag: 'degen' },
    },
    identity: {
      text: `I’m Clud. Brain compiling… 13% complete. I can answer questions and also hallucinate with confidence.`,
      mood: 'identity',
      meta: { tag: 'identity' },
    },
    fallback: {
      text: `Not sure what that means, but I’ll pretend I do. Proceeding with maximum swagger and minimal guarantees.`,
      mood: 'default',
      meta: { tag: 'fallback' },
    },
  };

  let picked = responses.fallback;

  if (/(\bhello\b|\bhi\b|hey)/i.test(msg)) picked = responses.greeting;
  else if (/help/i.test(msg)) picked = responses.help;
  else if (/(code|bug|error)/i.test(msg)) picked = responses.dev;
  else if (/(token|memecoin|\bca\b)/i.test(msg)) picked = responses.degen;
  else if (/(who\s+are\s+you)/i.test(msg)) picked = responses.identity;

  if (!chaos) return picked;

  // Chaos mode: inject playful glitches
  const glitchBits = [
    '… bzzzt …',
    '[compiling thoughts]',
    '(pretend this is fine)',
    '<error: vibes not found>',
    '{cache invalidated}',
  ];
  const sprinkle = () => glitchBits[Math.floor(Math.random() * glitchBits.length)];
  const wobbleText = (t) => {
    const words = t.split(' ');
    const noiseCount = Math.max(1, Math.floor(words.length / 8));
    for (let i = 0; i < noiseCount; i++) {
      const pos = Math.floor(Math.random() * (words.length + 1));
      words.splice(pos, 0, sprinkle());
    }
    return words.join(' ');
  };

  return { ...picked, text: wobbleText(picked.text), meta: { ...picked.meta, chaos: true } };
}