import { useEffect, useRef, useState } from 'react'
import TradingGrid from './TradingGrid'
import styles from './Hero.module.css'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TradingView: any
  }
}

export default function Hero() {
  const [signalBlink, setSignalBlink] = useState(true)
  const [statsVisible, setStatsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setSignalBlink(b => !b), 900)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  const CA = 'HUwwnfvDR8o8gqoc8uEehRn4ZowMqZ4MkdaL3o1ppump'

  const handleCopy = () => {
    navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const containerId = 'tv_widget_container'

    const initWidget = () => {
      if (!window.TradingView || !document.getElementById(containerId)) return
      new window.TradingView.widget({
        container_id: containerId,
        autosize: true,
        symbol: 'COINBASE:SOLUSD',
        interval: '60',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#040F1F',
        backgroundColor: 'rgba(2, 11, 24, 1)',
        gridColor: 'rgba(26, 143, 227, 0.06)',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: ['MAExp@tv-basicstudies', 'BB@tv-basicstudies'],
        overrides: {
          'paneProperties.background': '#020B18',
          'paneProperties.backgroundType': 'solid',
        },
      })
    }

    if (window.TradingView) {
      initWidget()
    } else {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = initWidget
      document.head.appendChild(script)
      scriptRef.current = script
    }

    return () => {
      const el = document.getElementById(containerId)
      if (el) el.innerHTML = ''
    }
  }, [])

  return (
    <section className={styles.hero}>
      {/* Animated background */}
      <div className={styles.chartBg}>
        <TradingGrid />
        <div className={styles.chartOverlay} />
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.navLogoIcon}>◈</span>
          <span>CLAWSIGNAL</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#identity">Identity</a>
          <a href="#signals">Signals</a>
          <button onClick={handleCopy} className={styles.ctaPrimary}><span className={styles.ctaIcon}>◈</span> {copied ? 'Copied!' : 'Buy $CLAW'}</button>
          <a href="https://x.com/clawsignal_dev" target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>Visit our dev page</a>
        </div>
      </nav>

      {/* Hero content */}
      <div className={styles.content}>
        <div className={styles.statusBadge}>
          <span className={`${styles.statusDot} ${signalBlink ? styles.blink : ''}`} />
          <span className={styles.statusMono}>SIGNAL DETECTED — ALGORITHM ACTIVE</span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineClaw}>CLAW</span>
          <span className={styles.headlineSignal}>SIGNAL</span>
        </h1>

        <div className={styles.heroImage}>
          <img
            src="/clawsignal-hero.jpeg"
            alt="CLAWSIGNAL"
            className={styles.heroImg}
          />
        </div>

        <div className={styles.taglines}>
          <span>MADE BY CLAWDBOT. DESIGNED FOR YOU.</span>        </div>

        <div className={styles.ctaRow}>
          <button onClick={handleCopy} className={styles.ctaPrimary}>
            <span className={styles.ctaIcon}>◈</span> {copied ? 'Copied!' : 'Buy $CLAW'}
          </button>
          <a href="https://x.com/clawsignal_dev" target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>Visit our dev page</a>
        </div>
      </div>

      {/* Live Chart */}
      <div className={styles.liveChartWrapper}>
        <div className={styles.liveChartHeader}>
          <div className={styles.liveChartLeft}>
            <span className={styles.liveChartTag}>◈ LIVE CHART</span>
            <span className={styles.liveChartPair}>
              SOL<span className={styles.liveChartPairAccent}>/USD</span>
            </span>
          </div>
          <div className={styles.liveChartRight}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} />
              <span className={styles.liveText}>LIVE</span>
            </div>
            <span className={styles.liveExchange}>COINBASE</span>
          </div>
        </div>
        <div className={styles.liveChartInner}>
          <div id="tv_widget_container" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Stats bar */}
      <div className={`${styles.statsBar} ${statsVisible ? styles.statsVisible : ''}`}>
        {[
          { label: 'SIGNAL STRENGTH', value: '98.4%' },
          { label: 'MARKET CAP', value: '$—' },
          { label: 'ENTRY PRECISION', value: '0.001ms' },
          { label: 'ALGORITHM', value: 'ACTIVE' },
        ].map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.scanLine} />
    </section>
  )
}
