// ═══════════════════════════════════════════════════════════
//  All Vegetables Quick Overview Grid
// ═══════════════════════════════════════════════════════════

import { VEGETABLES, predictNextDay } from '../data/vegetables'

export default function AllVegetablesGrid({ onSelect, selected, t }) {
  return (
    <div className="glass-card animate-fadeUp" style={{
      padding: 20, marginBottom: 16,
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <h3 style={{
        margin: '0 0 14px', fontSize: 13, fontWeight: 700,
        color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {t.allVegetables} · {t.phase1Note}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {Object.values(VEGETABLES).map((veg) => {
          const pred = predictNextDay(veg.key)
          const isActive = selected === veg.key
          const trendColor = pred.trend === 'rising' ? 'var(--green)'
            : pred.trend === 'falling' ? 'var(--red)' : 'var(--gold)'
          const trendIcon = pred.trend === 'rising' ? '↑' : pred.trend === 'falling' ? '↓' : '→'

          return (
            <button key={veg.key} onClick={() => onSelect(veg.key)} style={{
              background: isActive ? `${veg.color}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isActive ? veg.color + '66' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 14, padding: '14px 12px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 0 20px ${veg.colorGlow}` : 'none',
            }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = `${veg.color}0f`
                  e.currentTarget.style.borderColor = `${veg.color}44`
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                }
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{veg.emoji}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#f0ece4',
                fontFamily: 'var(--font-body)', marginBottom: 4,
              }}>
                {t[veg.key] || veg.key}
              </div>
              <div style={{
                fontSize: 15, fontWeight: 800, color: veg.color,
                fontFamily: 'var(--font-mono)',
              }}>
                ₹{veg.today}
              </div>
              <div style={{
                fontSize: 11, color: trendColor,
                fontFamily: 'var(--font-mono)', marginTop: 3,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <span>{trendIcon}</span>
                <span>₹{pred.predicted}</span>
                <span style={{ fontSize: 9, opacity: 0.8 }}>({pred.changePct}%)</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
