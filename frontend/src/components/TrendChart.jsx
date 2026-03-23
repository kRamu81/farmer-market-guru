// ═══════════════════════════════════════════════════════════
//  7-Day Trend Chart Component
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'

export default function TrendChart({ veg, prediction, t, lang }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(false)
    const id = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(id)
  }, [veg.key])

  const trendColor = prediction.trend === 'rising' ? 'var(--green)'
    : prediction.trend === 'falling' ? 'var(--red)' : 'var(--gold)'

  const allPrices = [...veg.week, prediction.predicted]
  const min = Math.min(...allPrices) * 0.92
  const max = Math.max(...allPrices) * 1.06
  const range = max - min

  const days = t.days || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Tom']

  return (
    <div className="glass-card animate-fadeUp delay-200" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{
          margin: 0, fontSize: 15, fontWeight: 700,
          color: '#f0ece4', fontFamily: 'var(--font-body)',
        }}>
          📊 {t.trend7Day}
        </h3>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { color: `${veg.color}aa`, label: t.actual },
            { color: '#38bdf8', label: t.today },
            { color: trendColor, label: t.predicted, dashed: true },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 20, height: 3, borderRadius: 2,
                background: item.color,
                border: item.dashed ? `1.5px dashed ${item.color}` : 'none',
                boxSizing: 'border-box',
              }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div style={{ position: 'relative' }}>
        <svg
          width="100%" viewBox="0 0 700 140"
          style={{ overflow: 'visible', display: 'block' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient fills */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={veg.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={veg.color} stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={trendColor} stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = pct * 120
            const price = Math.round(max - pct * range)
            return (
              <g key={i}>
                <line x1="0" y1={y} x2="700" y2={y}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                  strokeDasharray="4,6" />
                <text x="-8" y={y + 4} textAnchor="end"
                  fill="rgba(255,255,255,0.25)" fontSize="10"
                  fontFamily="var(--font-mono)">
                  ₹{price}
                </text>
              </g>
            )
          })}

          {(() => {
            const pts = allPrices.map((p, i) => {
              const x = (i / (allPrices.length - 1)) * 700
              const y = ((max - p) / range) * 120
              return { x, y, price: p, isToday: i === allPrices.length - 2, isPred: i === allPrices.length - 1 }
            })

            // Area path for historical
            const histPts = pts.slice(0, -1)
            const areaPath = `M${histPts.map(p => `${p.x},${p.y}`).join(' L')} L${histPts[histPts.length-1].x},120 L0,120 Z`
            const linePath = `M${histPts.map(p => `${p.x},${p.y}`).join(' L')}`

            // Prediction segment (dashed)
            const lastHist = histPts[histPts.length - 1]
            const predPt = pts[pts.length - 1]
            const predArea = `M${lastHist.x},${lastHist.y} L${predPt.x},${predPt.y} L${predPt.x},120 L${lastHist.x},120 Z`
            const predLine = `M${lastHist.x},${lastHist.y} L${predPt.x},${predPt.y}`

            return (
              <g>
                {/* Historical area */}
                <path d={areaPath} fill="url(#areaGrad)" />
                {/* Historical line */}
                <path d={linePath} fill="none" stroke={veg.color} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: animated ? 'drawLine 1.2s ease forwards' : 'none' }}
                  strokeDasharray="1000" strokeDashoffset={animated ? 0 : 1000}
                />

                {/* Prediction area */}
                <path d={predArea} fill="url(#predGrad)" />
                {/* Prediction dashed line */}
                <path d={predLine} fill="none" stroke={trendColor} strokeWidth="2.5"
                  strokeLinecap="round" strokeDasharray="8,5"
                />

                {/* Data points */}
                {pts.map((pt, i) => (
                  <g key={i}>
                    {pt.isToday && (
                      <circle cx={pt.x} cy={pt.y} r="10" fill="#38bdf822" stroke="#38bdf8" strokeWidth="1.5" />
                    )}
                    <circle
                      cx={pt.x} cy={pt.y}
                      r={pt.isPred ? 6 : pt.isToday ? 5 : 4}
                      fill={pt.isPred ? trendColor : pt.isToday ? '#38bdf8' : veg.color}
                      stroke="#0d1f24"
                      strokeWidth="2"
                      filter={pt.isPred ? 'url(#glow)' : 'none'}
                    />
                    {/* Price label on hover via title */}
                    <title>₹{pt.price}</title>
                  </g>
                ))}

                {/* Prediction price label */}
                <g>
                  <rect
                    x={predPt.x - 26} y={predPt.y - 28}
                    width="52" height="20" rx="6"
                    fill={`${trendColor}22`} stroke={`${trendColor}55`} strokeWidth="1"
                  />
                  <text x={predPt.x} y={predPt.y - 14} textAnchor="middle"
                    fill={trendColor} fontSize="11" fontWeight="bold"
                    fontFamily="var(--font-mono)">
                    ₹{predPt.price}
                  </text>
                </g>
              </g>
            )
          })()}
        </svg>

        {/* Day labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingLeft: 0, marginTop: 10,
        }}>
          {allPrices.map((_, i) => {
            const isToday = i === allPrices.length - 2
            const isPred = i === allPrices.length - 1
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  color: isPred ? trendColor : isToday ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: isPred || isToday ? 700 : 400,
                }}>
                  {days[i] || '?'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
