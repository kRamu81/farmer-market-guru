// ═══════════════════════════════════════════════════════════
//  Price Cards — Today & Tomorrow Prediction
// ═══════════════════════════════════════════════════════════

import { useAnimatedNumber } from '../hooks'

function AnimatedPrice({ value, color }) {
  const animated = useAnimatedNumber(value, 700)
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 2,
      animation: 'countUp 0.5s cubic-bezier(.34,1.56,.64,1) forwards',
    }}>
      <span style={{
        fontSize: 26, fontWeight: 800, color,
        fontFamily: 'var(--font-mono)',
        alignSelf: 'flex-start', marginTop: 6, lineHeight: 1,
      }}>₹</span>
      <span style={{
        fontSize: 58, fontWeight: 800, color,
        fontFamily: 'var(--font-mono)',
        lineHeight: 1, letterSpacing: '-2px',
      }}>
        {animated}
      </span>
    </div>
  )
}

function VolatilityBadge({ level }) {
  const colors = {
    'LOW':       { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#22c55e' },
    'MEDIUM':    { bg: 'rgba(249,202,36,0.15)', border: 'rgba(249,202,36,0.4)', text: '#f9ca24' },
    'HIGH':      { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#ef4444' },
    'VERY HIGH': { bg: 'rgba(239,68,68,0.2)',   border: 'rgba(239,68,68,0.5)',  text: '#ff5c5c' },
  }
  const c = colors[level] || colors['MEDIUM']
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '2px 7px', color: c.text,
      fontFamily: 'var(--font-mono)',
    }}>
      {level} VOLATILITY
    </span>
  )
}

export default function PriceCards({ veg, prediction, t, lang }) {
  const { predicted, change, changePct, trend, confidence } = prediction

  const trendColor = trend === 'rising' ? 'var(--green)' : trend === 'falling' ? 'var(--red)' : 'var(--gold)'
  const trendLabel = trend === 'rising' ? t.priceRising : trend === 'falling' ? t.priceFalling : t.priceStable
  const advice = trend === 'falling' ? t.sellToday : t.waitTomorrow

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

      {/* ── TODAY CARD ── */}
      <div className="glass-card animate-fadeUp" style={{
        padding: 24,
        border: `1px solid ${veg.color}33`,
        boxShadow: `var(--shadow-card), 0 0 0 1px ${veg.color}11`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: veg.colorGlow, filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{
                fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'var(--font-mono)', margin: 0,
              }}>
                {t.todayPrice}
              </p>
              <p style={{
                fontSize: 20, fontWeight: 700, color: '#f0ece4',
                fontFamily: 'var(--font-body)', margin: '5px 0 0',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 24 }}>{veg.emoji}</span>
                {t[veg.key] || veg.key}
              </p>
            </div>
            <div style={{
              background: `${veg.color}18`, border: `1px solid ${veg.color}44`,
              borderRadius: 10, padding: '5px 12px',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: veg.color, fontWeight: 600,
            }}>
              {fmtDate(today)}
            </div>
          </div>

          <AnimatedPrice value={veg.today} color={veg.color} />

          <p style={{
            margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 12,
            fontFamily: 'var(--font-mono)',
          }}>
            {t.perKg} · {t.wholesale}
          </p>

          {/* Retail range */}
          <div style={{
            marginTop: 16, padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              {t.retail}
            </span>
            <span style={{
              fontSize: 14, fontWeight: 700, color: 'var(--gold)',
              fontFamily: 'var(--font-mono)',
            }}>
              ₹{veg.retail[0]} – ₹{veg.retail[1]}
            </span>
          </div>

          {/* Volatility badge */}
          <div style={{ marginTop: 10 }}>
            <VolatilityBadge level={veg.volatility} />
          </div>
        </div>
      </div>

      {/* ── TOMORROW PREDICTION CARD ── */}
      <div className="glass-card animate-fadeUp delay-100" style={{
        padding: 24,
        background: `linear-gradient(135deg, ${trendColor}0f, rgba(13,31,36,0.8))`,
        border: `2px solid ${trendColor}44`,
        boxShadow: `var(--shadow-card), 0 0 40px ${trendColor}18`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated gradient background */}
        <div style={{
          position: 'absolute', top: -40, left: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: `${trendColor}18`, filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        {/* ML badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${trendColor}44`,
          borderRadius: 8, padding: '3px 8px',
          fontSize: 9, color: trendColor,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
          fontWeight: 700,
        }}>
          🤖 ML PREDICTION
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontFamily: 'var(--font-mono)', margin: 0,
            }}>
              {t.tomorrowPred}
            </p>
            <p style={{
              fontSize: 14, fontWeight: 600, color: trendColor,
              fontFamily: 'var(--font-body)', margin: '6px 0 0',
            }}>
              {trendLabel}
            </p>
          </div>

          <AnimatedPrice value={predicted} color={trendColor} />

          <p style={{
            margin: '6px 0 0', fontSize: 13,
            fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
          }}>
            {t.change}: <span style={{ color: trendColor, fontWeight: 700 }}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)} ({changePct}%)
            </span>
          </p>

          {/* Confidence bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 5,
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {t.confidence}
              </span>
              <span style={{ fontSize: 11, color: trendColor, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {confidence}%
              </span>
            </div>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.08)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${confidence}%`,
                background: `linear-gradient(90deg, ${trendColor}88, ${trendColor})`,
                borderRadius: 4,
                transition: 'width 1s ease',
              }} />
            </div>
          </div>

          {/* Advice banner */}
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: `${trendColor}18`,
            border: `1px solid ${trendColor}33`,
            borderRadius: 12,
            color: trendColor, fontWeight: 700, fontSize: 13,
            fontFamily: 'var(--font-body)',
          }}>
            {advice}
          </div>
        </div>
      </div>

    </div>
  )
}
