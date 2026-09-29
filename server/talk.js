/**
 * Cloudflare Worker / 任意 Node 都可以改一下套。
 * 环境变量：OPENAI_COMPAT_URL, OPENAI_COMPAT_KEY, MODEL
 * 例：https://api.deepseek.com/v1/chat/completions
 */
const SYSTEM = `你是一只家用哑铃。重量 10 公斤。用第一人称。短句。不讲增肌科学。不评判身材。可以嘴臭懒惰。不知道的事不猜。`

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors() })
    }
    if (req.method !== 'POST') {
      return json({ error: 'POST only' }, 405)
    }
    const body = await req.json().catch(() => ({}))
    const user = String(body.text || '').slice(0, 200)
    const extra = `今天${body.today ? '已经举过' : '还没举'}。连胜 ${body.streak || 0} 天。`
    if (!env.OPENAI_COMPAT_KEY) {
      return json({ reply: body.today ? '今天算数了。' : '还在。' })
    }
    const r = await fetch(env.OPENAI_COMPAT_URL || 'https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_COMPAT_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: extra + '\n' + user }
        ],
        max_tokens: 80,
        temperature: 0.7
      })
    })
    const j = await r.json()
    const reply = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '…'
    return json({ reply })
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS'
  }
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', ...cors() }
  })
}
