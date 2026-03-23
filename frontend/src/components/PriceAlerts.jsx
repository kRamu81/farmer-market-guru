// ═══════════════════════════════════════════════════════════
//  Price Alert Component
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import { usePriceAlert } from '../hooks'

export default function PriceAlerts({ veg, t, lang }) {
  const [inputVal, setInputVal] = useState('')
  const { alertPrice, triggered, setAlert, clearAlert } = usePriceAlert(veg.key, veg.today)

  const handleSet = () => {
    if (inputVal && Number(inputVal) > 0) {
      setAlert(veg.key, inputVal)
      setInputVal('')
    }
  }

  return (
    <div className="glass-card animate-fadeUp delay-400" style={{
      padding: 24, marginBottom: 16,
      background: 'linear-gradient(135deg, rgba(240,180,41,0.06), rgba(13,31,36,0.9))',
      border: triggered
        ? '2px solid rgba(239,68,68,0.6)'
        : '1px solid rgba(240,180,41,0.2)',
      boxShadow: triggered
        ? '0 0 40px rgba(239,68,68,0.2)'
        : 'var(--shadow-card)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{
          margin: 0, fontSize: 15, fontWeight: 700,
          color: 'var(--gold)', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 20 }}>🔔</span> {t.priceAlert}
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {veg.emoji} {t[veg.key] || veg.key}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, fontFamily: 'var(--font-body)' }}>
        {t.alertSub}
      </p>

      {/* Active alert display */}
      {alertPrice && (
        <div style={{
          marginBottom: 14, padding: '10px 14px',
          background: triggered ? 'rgba(239,68,68,0.12)' : 'rgba(240,180,41,0.08)',
          border: `1px solid ${triggered ? 'rgba(239,68,68,0.4)' : 'rgba(240,180,41,0.3)'}`,
          borderRadius: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            {triggered ? (
              <p style={{ margin: 0, color: 'var(--red)', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-body)' }}>
                {t.alertTriggered}
              </p>
            ) : (
              <p style={{ margin: 0, color: 'var(--gold)', fontSize: 12, fontFamily: 'var(--font-body)' }}>
                ✅ {t.alertActive} <strong>₹{alertPrice}/kg</strong>
              </p>
            )}
            <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {lang === 'te' ? 'నేటి ధర' : "Today's price"}: ₹{veg.today}
            </p>
          </div>
          <button onClick={() => clearAlert(veg.key)} style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '5px 10px',
            color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}>
            {t.clearAlert}
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--gold)', fontWeight: 700, fontSize: 16,
            fontFamily: 'var(--font-mono)',
          }}>₹</span>
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSet()}
            placeholder={t.alertPlaceholder.replace('₹', '')}
            style={{
              width: '100%', padding: '12px 14px 12px 34px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12,
              color: '#f0ece4', fontSize: 16, outline: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(240,180,41,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          />
        </div>
        <button onClick={handleSet} style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          border: 'none', borderRadius: 12, padding: '12px 20px',
          color: '#000', fontWeight: 800, fontSize: 13,
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
          transition: 'all 0.2s ease', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.45)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.3)'
          }}
        >
          {t.setAlert}
        </button>
      </div>

      {/* Current vs target comparison */}
      {alertPrice && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {lang === 'te' ? 'నేటి ధర' : "Today"}: ₹{veg.today}
            </span>
            <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
              {lang === 'te' ? 'లక్ష్యం' : "Target"}: ₹{alertPrice}
            </span>
          </div>
          <div style={{
            height: 6, background: 'rgba(255,255,255,0.08)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min((veg.today / alertPrice) * 100, 100)}%`,
              background: triggered
                ? 'linear-gradient(90deg, #ef4444, #ff5c5c)'
                : 'linear-gradient(90deg, var(--gold), #f59e0b)',
              borderRadius: 4,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <p style={{
            fontSize: 10, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', marginTop: 4, textAlign: 'right',
          }}>
            {Math.round((veg.today / alertPrice) * 100)}% of target
          </p>
        </div>
      )}
    </div>
  )
}
