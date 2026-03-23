// ═══════════════════════════════════════════════════════════
//  Custom React Hooks
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { TRANSLATIONS } from '../data/translations'

// ── Language Hook ───────────────────────────────────────────
export function useLanguage() {
  const [lang, setLang] = useState(() =>
    localStorage.getItem('farmer-guru-lang') || 'en'
  )

  const toggleLang = useCallback(() => {
    setLang(l => {
      const next = l === 'en' ? 'te' : 'en'
      localStorage.setItem('farmer-guru-lang', next)
      return next
    })
  }, [])

  const t = TRANSLATIONS[lang]
  return { lang, toggleLang, t }
}

// ── Market Hours Hook ───────────────────────────────────────
export function useMarketStatus() {
  const [status, setStatus] = useState(() => {
    const h = new Date().getHours()
    return { open: h >= 6 && h < 20, hour: h }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const h = new Date().getHours()
      setStatus({ open: h >= 6 && h < 20, hour: h })
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return status
}

// ── Price Alert Hook ────────────────────────────────────────
export function usePriceAlert(vegKey, currentPrice) {
  const [alerts, setAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('farmer-guru-alerts') || '{}')
    } catch { return {} }
  })

  const setAlert = useCallback((vegKey, targetPrice) => {
    setAlerts(prev => {
      const next = { ...prev, [vegKey]: Number(targetPrice) }
      localStorage.setItem('farmer-guru-alerts', JSON.stringify(next))
      return next
    })
  }, [])

  const clearAlert = useCallback((vegKey) => {
    setAlerts(prev => {
      const next = { ...prev }
      delete next[vegKey]
      localStorage.setItem('farmer-guru-alerts', JSON.stringify(next))
      return next
    })
  }, [])

  const triggered = alerts[vegKey] && currentPrice >= alerts[vegKey]

  return {
    alertPrice: alerts[vegKey] || '',
    triggered,
    setAlert,
    clearAlert,
  }
}

// ── Live Clock Hook ─────────────────────────────────────────
export function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

// ── AI Advisor Hook ─────────────────────────────────────────
export function useAIAdvisor() {
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAdvice = useCallback(async ({ vegName, today, predicted, trend, changePct, bestMonth, lang }) => {
    setLoading(true)
    setAdvice('')
    setError('')

    const langLabel = lang === 'te' ? 'Telugu' : 'English'
    const prompt = `You are an expert agricultural market advisor helping small farmers in Andhra Pradesh, India.

Vegetable: ${vegName}
Today's wholesale price: ₹${today}/kg
Tomorrow's ML prediction: ₹${predicted}/kg
Trend: ${trend} (${changePct}% change)
Best selling month: ${bestMonth}

Give SHORT, PRACTICAL advice in EXACTLY 3–4 sentences in ${langLabel}.
Focus on: should they sell now or wait? What to watch for? One actionable tip.
Be direct, simple, encouraging. Use farmer-friendly language.
NO markdown formatting. Plain text only.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      const text = data.content?.find(b => b.type === 'text')?.text || ''
      setAdvice(text)
    } catch (e) {
      setError(lang === 'te'
        ? 'సలహా లోడ్ కాలేదు. మళ్ళీ ప్రయత్నించండి.'
        : 'Could not load advice. Please try again.'
      )
    }
    setLoading(false)
  }, [])

  return { advice, loading, error, fetchAdvice, setAdvice }
}

// ── Animated Number Hook ────────────────────────────────────
export function useAnimatedNumber(target, duration = 600) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const startVal = 0
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round((startVal + (target - startVal) * eased) * 10) / 10)
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [target, duration])

  return current
}
