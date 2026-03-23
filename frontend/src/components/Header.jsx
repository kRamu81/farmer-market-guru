// ═══════════════════════════════════════════════════════════
//  Header Component
// ═══════════════════════════════════════════════════════════

import { useClock, useMarketStatus } from '../hooks'

export default function Header({ t, lang, onToggleLang }) {
  const time = useClock()
  const { open } = useMarketStatus()

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  })
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,13,15,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64, gap: 16,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #f0b429, #e8890c)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 4px 16px rgba(240,180,41,0.35)',
            flexShrink: 0,
          }}>🌾</div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, color: '#f0ece4',
              lineHeight: 1, margin: 0,
              letterSpacing: '0.01em',
            }}>
              {t.appName}
            </h1>
            <p style={{
              fontSize: 10, color: 'var(--text-muted)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1,
              marginTop: 3,
            }}>
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center — Date/Time */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          flex: 1,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 18, color: 'var(--gold)',
            letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {timeStr}
          </div>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', marginTop: 2,
          }}>
            {dateStr}
          </div>
        </div>

        {/* Right — market status + lang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Market Status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: open ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 20, padding: '6px 14px',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: open ? 'var(--green)' : 'var(--red)',
              animation: open ? 'pulse 2s ease infinite' : 'none',
              boxShadow: open ? '0 0 8px var(--green)' : '0 0 8px var(--red)',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: open ? 'var(--green)' : 'var(--red)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}>
              {open ? t.marketOpen : t.marketClosed}
            </span>
          </div>

          {/* Lang Toggle */}
          <button onClick={onToggleLang} style={{
            background: 'rgba(240,180,41,0.12)',
            border: '1px solid rgba(240,180,41,0.3)',
            borderRadius: 20, padding: '6px 14px',
            color: 'var(--gold)', fontWeight: 700, fontSize: 11,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(240,180,41,0.22)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(240,180,41,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(240,180,41,0.12)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {t.langToggle}
          </button>
        </div>

      </div>
    </header>
  )
}
