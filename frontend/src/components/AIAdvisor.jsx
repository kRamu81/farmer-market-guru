// ═══════════════════════════════════════════════════════════
//  AI Advisor Component — Claude API powered
// ═══════════════════════════════════════════════════════════

import { useAIAdvisor } from '../hooks'
import { useState } from 'react'

export default function AIAdvisor({ veg, prediction, t, lang, forecast }) {
  const { advice, loading, error, fetchAdvice } = useAIAdvisor()
  const [hasAsked, setHasAsked] = useState(false)

  const months = t.months || ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const prices = forecast.map(f => f.price)
  const bestMonthIdx = prices.indexOf(Math.max(...prices))
  const bestMonth = months[bestMonthIdx]

  const handleGetAdvice = () => {
    setHasAsked(true)
    fetchAdvice({
      vegName: t[veg.key] || veg.key,
      today: veg.today,
      predicted: prediction.predicted,
      trend: prediction.trend,
      changePct: prediction.changePct,
      bestMonth,
      lang,
    })
  }

  return (
    <div className="glass-card animate-fadeUp delay-400" style={{
      padding: 24, marginBottom: 16,
      background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(13,31,36,0.9))',
      border: '1px solid rgba(34,197,94,0.2)',
      boxShadow: 'var(--shadow-card), 0 0 40px rgba(34,197,94,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{
            margin: 0, fontSize: 15, fontWeight: 700,
            color: 'var(--green)', fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 20 }}>🤖</span> {t.aiAdvice}
          </h3>
          <p style={{
            margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            Powered by Claude · Anthropic AI
          </p>
        </div>
        <div style={{
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', textAlign: 'right',
        }}>
          <div>{lang === 'te' ? 'తెలుగు' : 'English'} response</div>
          <div style={{ color: 'var(--green)', marginTop: 2 }}>✓ Personalized</div>
        </div>
      </div>

      {/* Advice content area */}
      <div style={{
        minHeight: 80, padding: '14px 16px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(34,197,94,0.15)',
        borderRadius: 12, marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              border: '2px solid rgba(34,197,94,0.3)',
              borderTop: '2px solid var(--green)',
              animation: 'spin 0.8s linear infinite', flexShrink: 0,
            }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              {t.loadingAdvice}
            </span>
          </div>
        ) : error ? (
          <p style={{ color: 'var(--red)', fontSize: 13, margin: 0, fontFamily: 'var(--font-body)' }}>
            ⚠️ {error}
          </p>
        ) : advice ? (
          <p style={{
            color: '#e2e8f0', fontSize: 14, margin: 0,
            lineHeight: 1.75, fontFamily: 'var(--font-body)',
            animation: 'fadeIn 0.4s ease',
          }}>
            {advice}
          </p>
        ) : (
          <p style={{
            color: 'var(--text-muted)', fontSize: 13, margin: 0,
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
          }}>
            💡 {veg.tip[lang]}
          </p>
        )}
      </div>

      {/* Context chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {[
          { icon: '🌾', text: `${t[veg.key] || veg.key}: ₹${veg.today}/kg` },
          { icon: '🤖', text: `${t.tomorrowPred}: ₹${prediction.predicted}` },
          { icon: '📅', text: `${t.bestMonth}: ${bestMonth}` },
        ].map((chip, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 11, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span>{chip.icon}</span> {chip.text}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleGetAdvice}
        disabled={loading}
        style={{
          width: '100%', padding: '13px 20px',
          background: loading
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #15803d, #16a34a)',
          border: loading ? '1px solid rgba(255,255,255,0.1)' : 'none',
          borderRadius: 12,
          color: loading ? 'var(--text-muted)' : '#fff',
          fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(22,163,74,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
        onMouseEnter={e => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(22,163,74,0.5)'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(22,163,74,0.35)'
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTop: '2px solid white',
              animation: 'spin 0.8s linear infinite',
            }} />
            {t.loadingAdvice}
          </>
        ) : (
          <>
            <span style={{ fontSize: 18 }}>🌾</span>
            {t.getAdvice}
            {hasAsked && !loading && <span style={{ fontSize: 12, opacity: 0.7 }}>↻ {lang === 'te' ? 'మళ్ళీ' : 'Refresh'}</span>}
          </>
        )}
      </button>
    </div>
  )
}
