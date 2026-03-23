// ═══════════════════════════════════════════════════════════
//  12-Month Year Forecast Component
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'

export default function YearForecast({ veg, forecast, t, lang }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    setAnimated(false)
    const id = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(id)
  }, [veg.key])

  const prices = forecast.map(f => f.price)
  const max = Math.max(...prices)
  const min = Math.min(...prices)
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  const bestIdx = prices.indexOf(max)
  const worstIdx = prices.indexOf(min)
  const months = t.months || ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const now = new Date().getMonth()

  return (
    <div className="glass-card animate-fadeUp delay-300" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{
            margin: 0, fontSize: 15, fontWeight: 700,
            color: '#f0ece4', fontFamily: 'var(--font-body)',
          }}>
            📅 {t.forecast12Mo}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {t.forecastSub}
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '6px 12px',
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          🤖 {t.accuracy}: {veg.accuracy}%
        </div>
      </div>

      {/* Bar chart */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 6, height: 120,
        paddingBottom: 0, position: 'relative',
      }}>
        {/* Average line */}
        <div style={{
          position: 'absolute',
          bottom: ((avg - min * 0.92) / (max * 1.08 - min * 0.92)) * 100 + '%',
          left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.15)',
          borderTop: '1px dashed rgba(255,255,255,0.2)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {forecast.map((item, i) => {
          const pct = animated ? ((item.price - min * 0.9) / (max * 1.1 - min * 0.9)) * 100 : 0
          const isBest   = i === bestIdx
          const isWorst  = i === worstIdx
          const isCurrent = i === now
          const barColor  = isBest ? 'var(--green)' : isWorst ? 'var(--red)' : veg.color

          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 0, height: '100%',
              justifyContent: 'flex-end', position: 'relative',
            }}>
              {/* Best/Worst icons */}
              {(isBest || isWorst) && (
                <div style={{
                  position: 'absolute', top: -4,
                  fontSize: 14, zIndex: 2,
                }}>
                  {isBest ? '⭐' : '⚠️'}
                </div>
              )}
              {/* Price label */}
              <span style={{
                fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: isBest ? 'var(--green)' : isWorst ? 'var(--red)' : 'var(--text-muted)',
                marginBottom: 3, lineHeight: 1,
              }}>
                ₹{item.price}
              </span>
              {/* Bar */}
              <div style={{
                width: '100%', height: `${pct}%`,
                minHeight: 4,
                background: isBest
                  ? 'linear-gradient(180deg,#22c55e,#16a34a)'
                  : isWorst
                  ? 'linear-gradient(180deg,#ef4444,#991b1b)'
                  : `linear-gradient(180deg,${veg.color}dd,${veg.color}66)`,
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.9s cubic-bezier(.34,1.56,.64,1)',
                transitionDelay: `${i * 0.05}s`,
                boxShadow: isBest ? '0 0 12px rgba(34,197,94,0.4)'
                  : isWorst ? '0 0 12px rgba(239,68,68,0.4)' : 'none',
                outline: isCurrent ? `2px solid rgba(255,255,255,0.5)` : 'none',
                outlineOffset: 2,
                position: 'relative',
              }}>
                {isCurrent && (
                  <div style={{
                    position: 'absolute', top: -18, left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 8, color: 'var(--sky)', fontWeight: 700,
                    fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                  }}>NOW</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Month labels */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {months.map((m, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: 8, fontFamily: 'var(--font-mono)',
            color: i === now ? 'var(--sky)' : 'var(--text-muted)',
            fontWeight: i === now ? 700 : 400,
          }}>
            {m}
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10, marginTop: 20,
      }}>
        {[
          { label: t.bestMonth,    value: months[bestIdx],  color: 'var(--green)', icon: '⭐', sub: `₹${max}/kg` },
          { label: t.worstMonth,   value: months[worstIdx], color: 'var(--red)',   icon: '⚠️', sub: `₹${min}/kg` },
          { label: t.avgForecast,  value: `₹${avg}`,        color: 'var(--gold)',  icon: '📊', sub: `${t.perKg}` },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color.replace('var(--', '').replace(')', '')}` === 'green'
              ? 'rgba(34,197,94,0.06)' : i === 1
              ? 'rgba(239,68,68,0.06)' : 'rgba(240,180,41,0.06)',
            border: `1px solid ${item.color}33`,
            borderRadius: 14, padding: '12px 14px', textAlign: 'center',
            transition: 'transform 0.2s ease',
            cursor: 'default',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
            <div style={{
              color: item.color, fontWeight: 800, fontSize: 17,
              fontFamily: 'var(--font-mono)',
            }}>
              {item.value}
            </div>
            <div style={{ color: item.color, fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
              {item.sub}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-body)', marginTop: 3 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
