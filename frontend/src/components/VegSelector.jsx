// ═══════════════════════════════════════════════════════════
//  Vegetable Selector Component
// ═══════════════════════════════════════════════════════════

import { VEGETABLES } from '../data/vegetables'

export default function VegSelector({ selected, onSelect, t, lang }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{
        color: 'var(--text-muted)', fontSize: 11,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        fontFamily: 'var(--font-mono)', marginBottom: 14,
      }}>
        {t.selectVeg}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.values(VEGETABLES).map((veg) => {
          const isActive = selected === veg.key
          return (
            <button
              key={veg.key}
              onClick={() => onSelect(veg.key)}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${veg.color}dd, ${veg.color}88)`
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${isActive ? veg.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 14, padding: '10px 20px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)',
                transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                boxShadow: isActive
                  ? `0 6px 24px ${veg.colorGlow}, 0 0 0 1px ${veg.color}44`
                  : 'none',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = `${veg.color}18`
                  e.currentTarget.style.borderColor = `${veg.color}66`
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{veg.emoji}</span>
              <span>{t[veg.key] || veg.key}</span>
              {isActive && (
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 6, padding: '2px 6px', letterSpacing: '0.05em',
                }}>
                  {veg.accuracy}%
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
