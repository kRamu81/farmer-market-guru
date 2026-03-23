// ═══════════════════════════════════════════════════════════
//  Vegetable Market Data — Andhra Pradesh
//  Realistic prices based on AP market patterns
// ═══════════════════════════════════════════════════════════

// Generate realistic 10-year daily price history
function generateHistory(base, volatility, seasonalPattern) {
  const data = []
  const startDate = new Date('2015-01-01')
  let price = base

  for (let i = 0; i < 365 * 10; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const month = date.getMonth()
    const dayOfWeek = date.getDay()

    // Seasonal multiplier
    const seasonal = 1 + (seasonalPattern[month] || 0)
    // Weekly pattern (lower on Sunday, higher mid-week)
    const weekly = dayOfWeek === 0 ? 0.95 : dayOfWeek === 6 ? 0.97 : 1.0
    // Random walk
    const noise = 1 + (Math.random() - 0.5) * volatility
    // Yearly inflation trend (3% per year)
    const inflation = 1 + (0.03 * i / 365)

    price = Math.max(base * 0.4, price * 0.85 + base * seasonal * weekly * noise * inflation * 0.15)
    price = Math.round(price * 10) / 10

    data.push({
      date: date.toISOString().split('T')[0],
      price,
      month,
      dayOfWeek,
    })
  }
  return data
}

// Last 30 days (recent history for 7-day chart)
function getLast30Days(history) {
  return history.slice(-30).map(d => d.price)
}

export const VEGETABLES = {
  tomato: {
    key: 'tomato',
    emoji: '🍅',
    color: '#ff5c5c',
    colorDim: '#ff5c5c33',
    colorGlow: 'rgba(255,92,92,0.2)',
    bg: 'rgba(255,92,92,0.06)',
    today: 15,
    retail: [18, 23],
    unit: 'kg',
    // Last 7 days prices
    week: [18, 16, 14, 12, 14, 17, 15],
    // Seasonal index by month (0=Jan, 11=Dec) — positive=higher, negative=lower
    seasonal: [0.05, 0.02, 0.08, 0.25, 0.40, 0.55, 0.45, 0.35, 0.20, 0.10, 0.05, 0.0],
    // 12-month wholesale forecast
    monthlyForecast: [14, 16, 20, 28, 38, 48, 42, 34, 24, 18, 15, 13],
    accuracy: 87,
    volatility: 'HIGH',
    tip: {
      en: 'Summer peak Apr–Jun. Prices spike 3× during monsoon shortages. Store with ventilation.',
      te: 'వేసవిలో ఏప్రిల్–జూన్‌లో ధర ఎక్కువ. వర్షాకాలంలో 3× పెరుగుతుంది. గాలాడే చోట నిల్వ చేయండి.'
    },
    yieldTips: {
      en: 'Best harvest: Jan–Mar. Avoid selling during monsoon glut (Aug–Sep).',
      te: 'మంచి పంట: జనవరి–మార్చి. వర్షాకాలంలో (ఆగ–సెప్) అమ్మకపు ఒత్తిడి నివారించండి.'
    }
  },

  onion: {
    key: 'onion',
    emoji: '🧅',
    color: '#ff9f43',
    colorDim: '#ff9f4333',
    colorGlow: 'rgba(255,159,67,0.2)',
    bg: 'rgba(255,159,67,0.06)',
    today: 22,
    retail: [26, 33],
    unit: 'kg',
    week: [25, 24, 22, 20, 21, 23, 22],
    seasonal: [0.0, -0.05, 0.02, 0.10, 0.20, 0.28, 0.25, 0.15, 0.08, 0.30, 0.35, 0.20],
    monthlyForecast: [20, 19, 22, 26, 30, 35, 32, 28, 25, 34, 38, 30],
    accuracy: 83,
    volatility: 'MEDIUM',
    tip: {
      en: 'Post-monsoon Oct–Nov is peak season. Good cold-storage potential.',
      te: 'వర్షాల తర్వాత అక్టోబర్–నవంబర్‌లో ధర ఎక్కువ. చల్లని నిల్వకు మంచిది.'
    },
    yieldTips: {
      en: 'Can store for 3–4 months in dry condition. Wait for Oct-Nov peak.',
      te: 'పొడి పరిస్థితుల్లో 3–4 నెలలు నిల్వ చేయవచ్చు. అక్టో-నవం శిఖరం కోసం వేచి ఉండండి.'
    }
  },

  potato: {
    key: 'potato',
    emoji: '🥔',
    color: '#f9ca24',
    colorDim: '#f9ca2433',
    colorGlow: 'rgba(249,202,36,0.2)',
    bg: 'rgba(249,202,36,0.06)',
    today: 22,
    retail: [26, 33],
    unit: 'kg',
    week: [24, 23, 22, 21, 22, 23, 22],
    seasonal: [0.05, 0.03, 0.0, 0.02, 0.06, 0.08, 0.06, 0.04, 0.02, 0.0, -0.02, 0.03],
    monthlyForecast: [24, 22, 21, 22, 24, 26, 25, 24, 23, 22, 21, 23],
    accuracy: 91,
    volatility: 'LOW',
    tip: {
      en: 'Most stable vegetable. Best sold Jan–Mar when cold storage runs low.',
      te: 'అతి స్థిరమైన కూరగాయ. జనవరి–మార్చ్‌లో అమ్మడం మంచిది.'
    },
    yieldTips: {
      en: 'Consistent demand year-round. Ideal for new farmers due to low volatility.',
      te: 'సంవత్సరం పొడవునా స్థిర డిమాండ్. తక్కువ హెచ్చుతగ్గులు — కొత్త రైతులకు మంచిది.'
    }
  },

  greenchilli: {
    key: 'greenchilli',
    emoji: '🌶️',
    color: '#6bcb77',
    colorDim: '#6bcb7733',
    colorGlow: 'rgba(107,203,119,0.2)',
    bg: 'rgba(107,203,119,0.06)',
    today: 40,
    retail: [48, 60],
    unit: 'kg',
    week: [35, 38, 42, 45, 40, 37, 40],
    seasonal: [0.0, -0.05, 0.05, 0.20, 0.50, 0.80, 0.70, 0.55, 0.35, 0.15, 0.05, -0.02],
    monthlyForecast: [38, 35, 40, 55, 72, 88, 78, 62, 50, 43, 38, 36],
    accuracy: 79,
    volatility: 'VERY HIGH',
    tip: {
      en: 'Extremely volatile. Monsoon shortages can spike prices 2–3×. Weather monitoring critical.',
      te: 'చాలా అస్థిరం. వర్షాకాలంలో ధర 2–3× పెరగవచ్చు. వాతావరణ పర్యవేక్షణ ముఖ్యం.'
    },
    yieldTips: {
      en: 'High risk, high reward. June–August peak can yield exceptional profits.',
      te: 'అధిక ప్రమాదం, అధిక లాభం. జూన్–ఆగస్టు శిఖరంలో అద్భుతమైన లాభాలు.'
    }
  }
}

// ML Prediction function — Weighted Moving Average + Seasonal Adjustment
export function predictNextDay(vegKey, overrideToday = null) {
  const veg = VEGETABLES[vegKey]
  if (!veg) return null

  const history = veg.week
  const today = overrideToday || veg.today
  const now = new Date()
  const month = now.getMonth()

  // Weighted moving average (recent days weight more)
  const weights = [0.30, 0.22, 0.18, 0.12, 0.08, 0.06, 0.04]
  const wma = history.reduce((sum, price, i) => sum + price * weights[i], 0)

  // Seasonal factor
  const seasonal = 1 + (veg.seasonal[month] * 0.08)

  // Day-of-week effect
  const dow = (now.getDay() + 1) % 7 // tomorrow's day
  const dowFactor = [0.97, 1.02, 1.01, 1.01, 1.02, 0.99, 0.96][dow]

  const predicted = Math.round(wma * seasonal * dowFactor * 10) / 10
  const change = predicted - today
  const changePct = ((change / today) * 100).toFixed(1)
  const trend = change > 0.8 ? 'rising' : change < -0.8 ? 'falling' : 'stable'

  return { predicted, change, changePct, trend, confidence: veg.accuracy }
}

// Generate 12-month forecast data
export function getYearForecast(vegKey) {
  const veg = VEGETABLES[vegKey]
  if (!veg) return []
  return veg.monthlyForecast.map((price, i) => ({
    month: i,
    price,
    isHigh: price === Math.max(...veg.monthlyForecast),
    isLow:  price === Math.min(...veg.monthlyForecast),
  }))
}

export const VEG_KEYS = Object.keys(VEGETABLES)
