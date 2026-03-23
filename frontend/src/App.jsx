// ═══════════════════════════════════════════════════════════
//  App.jsx — Root Component
// ═══════════════════════════════════════════════════════════

import { useState, useCallback } from 'react'
import { useLanguage } from './hooks'
import { VEGETABLES, predictNextDay, getYearForecast } from './data/vegetables'

import Header          from './components/Header'
import VegSelector     from './components/VegSelector'
import PriceCards      from './components/PriceCards'
import TrendChart      from './components/TrendChart'
import YearForecast    from './components/YearForecast'
import AIAdvisor       from './components/AIAdvisor'
import PriceAlerts     from './components/PriceAlerts'
import AllVegetablesGrid from './components/AllVegetablesGrid'

export default function App() {
  const { lang, toggleLang, t } = useLanguage()
  const [selected, setSelected] = useState('tomato')
  const [animKey, setAnimKey] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSelect = useCallback((key) => {
    if (key === selected) return
    setLoading(true)
    setTimeout(() => {
      setSelected(key)
      setAnimKey(k => k + 1)
      setLoading(false)
    }, 300)
  }, [selected])

  const veg        = VEGETABLES[selected]
  const prediction = predictNextDay(selected)
  const forecast   = getYearForecast(selected)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Ambient background particles */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', zIndex: 0,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${180 + i * 60}px`,
            height: `${180 + i * 60}px`,
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(240,180,41,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)',
            top:  `${[10, 60, 30, 80, 5, 50][i]}%`,
            left: `${[10, 70, 45, 20, 85, 55][i]}%`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header t={t} lang={lang} onToggleLang={toggleLang} />

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>

          {/* All Vegetables Overview */}
          <AllVegetablesGrid onSelect={handleSelect} selected={selected} t={t} />

          {/* Vegetable Selector */}
          <VegSelector selected={selected} onSelect={handleSelect} t={t} lang={lang} />

          {/* Loading state */}
          {loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '80px 0', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: `3px solid ${veg.color}33`,
                borderTop: `3px solid ${veg.color}`,
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{
                color: 'var(--text-secondary)', fontSize: 14,
                fontFamily: 'var(--font-mono)',
              }}>
                {t.loading}
              </p>
            </div>
          ) : (
            <div key={animKey}>
              {/* Today + Tomorrow */}
              <PriceCards veg={veg} prediction={prediction} t={t} lang={lang} />

              {/* 7-Day Trend */}
              <TrendChart veg={veg} prediction={prediction} t={t} lang={lang} />

              {/* 12-Month Forecast */}
              <YearForecast veg={veg} forecast={forecast} t={t} lang={lang} />

              {/* Bottom row: AI Advisor + Price Alert */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <AIAdvisor
                  veg={veg} prediction={prediction}
                  t={t} lang={lang} forecast={forecast}
                />
                <PriceAlerts veg={veg} t={t} lang={lang} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 32, padding: '16px 20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              🤖 {t.modelInfo}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              📡 {t.dataSource}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              v1.0.0 · Phase 1
            </span>
          </div>

        </main>
      </div>
    </div>
  )
}
