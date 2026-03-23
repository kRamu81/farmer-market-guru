// ═══════════════════════════════════════════════════════════
//  Bilingual translations — English & Telugu
// ═══════════════════════════════════════════════════════════

export const TRANSLATIONS = {
  en: {
    // App
    appName:        "రైతు మార్కెట్ గురు",
    appNameEn:      "Farmer Market Guru",
    tagline:        "AI-Powered Vegetable Price Predictions · Andhra Pradesh",
    langToggle:     "తెలుగులో చూడండి",

    // Navigation
    navDashboard:   "Dashboard",
    navForecast:    "Forecast",
    navHistory:     "History",
    navAlerts:      "Alerts",
    navAdvice:      "AI Advisor",

    // Market status
    marketStatus:   "Market Status",
    marketOpen:     "OPEN",
    marketClosed:   "CLOSED",
    lastUpdated:    "Last updated",

    // Price labels
    todayPrice:     "Today's Price",
    tomorrowPred:   "Tomorrow's Prediction",
    wholesale:      "Wholesale",
    retail:         "Retail Range",
    perKg:          "per kg",
    change:         "Change",
    confidence:     "Confidence",
    accuracy:       "Model Accuracy",

    // Trend
    priceRising:    "📈 Price Rising",
    priceFalling:   "📉 Price Falling",
    priceStable:    "📊 Price Stable",
    trend7Day:      "7-Day Price Trend",
    forecast12Mo:   "12-Month Forecast",
    forecastSub:    "Seasonal price outlook for the year ahead",

    // Advice
    sellToday:      "✅ Good time to sell today!",
    waitTomorrow:   "⏳ Price rising — wait for better rate",
    aiAdvice:       "AI Market Advisor",
    getAdvice:      "Get AI Advice",
    loadingAdvice:  "Thinking...",
    defaultTip:     "Click to get personalized AI advice for your crop",

    // Charts
    predicted:      "Predicted",
    actual:         "Actual",
    today:          "Today",
    bestMonth:      "Best Month to Sell",
    worstMonth:     "Avoid This Month",
    avgForecast:    "Avg Forecast Price",
    highPrice:      "High",
    lowPrice:       "Low",

    // Alerts
    priceAlert:     "Price Alert",
    alertSub:       "Get notified when price crosses your target",
    alertPlaceholder: "Enter target price (₹)",
    setAlert:       "Set Alert",
    alertActive:    "Alert is active for",
    alertTriggered: "🚨 Price already crossed your target!",
    clearAlert:     "Clear",

    // Months
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    days:   ["Mon","Tue","Wed","Thu","Fri","Sat","Sun","Tom"],

    // Vegetables
    tomato:       "Tomato",
    onion:        "Onion",
    potato:       "Potato",
    greenchilli:  "Green Chilli",
    brinjal:      "Brinjal",
    cabbage:      "Cabbage",
    carrot:       "Carrot",
    capsicum:     "Capsicum",

    // Misc
    selectVeg:    "Select Vegetable",
    modelInfo:    "ML Model: LSTM + XGBoost Ensemble",
    dataSource:   "Data: vegetablemarketprice.com · Andhra Pradesh",
    loading:      "Running ML Model...",
    rupee:        "₹",
    viewHistory:  "View Full History",
    allVegetables:"All Vegetables",
    phase1Note:   "Phase 1 — 4 key vegetables",
  },
  te: {
    appName:        "రైతు మార్కెట్ గురు",
    appNameEn:      "రైతు మార్కెట్ గురు",
    tagline:        "AI సహాయంతో కూరగాయల ధర అంచనా · ఆంధ్రప్రదేశ్",
    langToggle:     "Switch to English",

    navDashboard:   "డాష్‌బోర్డ్",
    navForecast:    "అంచనా",
    navHistory:     "చరిత్ర",
    navAlerts:      "హెచ్చరికలు",
    navAdvice:      "AI సలహాదారు",

    marketStatus:   "మార్కెట్ స్థితి",
    marketOpen:     "తెరచి ఉంది",
    marketClosed:   "మూసివేయబడింది",
    lastUpdated:    "చివరగా నవీకరించబడింది",

    todayPrice:     "నేటి ధర",
    tomorrowPred:   "రేపటి అంచనా",
    wholesale:      "టోకు",
    retail:         "చిల్లర ధర",
    perKg:          "కిలోకు",
    change:         "మార్పు",
    confidence:     "నమ్మకం",
    accuracy:       "మోడల్ ఖచ్చితత్వం",

    priceRising:    "📈 ధర పెరుగుతోంది",
    priceFalling:   "📉 ధర తగ్గుతోంది",
    priceStable:    "📊 ధర స్థిరంగా ఉంది",
    trend7Day:      "7 రోజుల ధర ట్రెండ్",
    forecast12Mo:   "12 నెలల అంచనా",
    forecastSub:    "వచ్చే సంవత్సరం కాలానుగుణ ధర అంచనా",

    sellToday:      "✅ నేడు అమ్మడం మంచిది!",
    waitTomorrow:   "⏳ ధర పెరుగుతుంది — వేచి ఉండండి",
    aiAdvice:       "AI మార్కెట్ సలహాదారు",
    getAdvice:      "AI సలహా పొందండి",
    loadingAdvice:  "ఆలోచిస్తున్నాను...",
    defaultTip:     "మీ పంటకు AI సలహా పొందడానికి క్లిక్ చేయండి",

    predicted:      "అంచనా",
    actual:         "నిజమైన",
    today:          "నేడు",
    bestMonth:      "అమ్మడానికి మంచి నెల",
    worstMonth:     "ఈ నెల నివారించండి",
    avgForecast:    "సగటు అంచనా ధర",
    highPrice:      "గరిష్ట",
    lowPrice:       "కనిష్ట",

    priceAlert:     "ధర హెచ్చరిక",
    alertSub:       "ధర మీ లక్ష్యాన్ని దాటినప్పుడు తెలియజేయండి",
    alertPlaceholder: "లక్ష్య ధర నమోదు చేయండి (₹)",
    setAlert:       "హెచ్చరిక సెట్ చేయి",
    alertActive:    "హెచ్చరిక సక్రియంగా ఉంది",
    alertTriggered: "🚨 ధర మీ లక్ష్యాన్ని దాటింది!",
    clearAlert:     "తొలగించు",

    months: ["జన","ఫిబ్","మార్","ఏప్రి","మే","జూన్","జూలై","ఆగ","సెప్","అక్టో","నవ","డిసె"],
    days:   ["సోమ","మంగ","బుధ","గురు","శుక్ర","శని","ఆది","రేపు"],

    tomato:       "టమాట",
    onion:        "ఉల్లిపాయ",
    potato:       "బంగాళాదుంప",
    greenchilli:  "పచ్చి మిరప",
    brinjal:      "వంకాయ",
    cabbage:      "క్యాబేజీ",
    carrot:       "క్యారట్",
    capsicum:     "క్యాప్సికమ్",

    selectVeg:    "కూరగాయ ఎంచుకోండి",
    modelInfo:    "ML మోడల్: LSTM + XGBoost",
    dataSource:   "డేటా: vegetablemarketprice.com · ఆంధ్రప్రదేశ్",
    loading:      "ML మోడల్ అమలవుతోంది...",
    rupee:        "₹",
    viewHistory:  "పూర్తి చరిత్ర చూడండి",
    allVegetables:"అన్ని కూరగాయలు",
    phase1Note:   "దశ 1 — 4 ముఖ్యమైన కూరగాయలు",
  }
}
