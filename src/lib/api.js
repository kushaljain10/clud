export async function chatRequest({ messages, model = 'openrouter/auto', max_tokens = 200 }) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8787'
  const key = import.meta.env.VITE_CLIENT_KEY
  if (!key) throw new Error('missing client key')

  const resp = await fetch(`${base.replace(/\/$/, '')}/v1/chat`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ messages, model, max_tokens })
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    const err = new Error(`backend error ${resp.status}`)
    err.body = text
    throw err
  }
  return resp.json()
}