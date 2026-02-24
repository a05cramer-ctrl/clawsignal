import { useEffect, useRef } from 'react'
import styles from './LiveChart.module.css'

export default function LiveChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'COINBASE:SOLUSD',
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#020B18',
      gridColor: 'rgba(26, 143, 227, 0.06)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      studies: ['MAExp@tv-basicstudies'],
      container_id: 'tradingview_clawsignal',
    })

    container.appendChild(script)

    return () => {
      if (container.contains(script)) container.removeChild(script)
    }
  }, [])

  return (
    <section id="live-chart" className={styles.section}>
      <div className={styles.bgGrid} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.sectionTag}>◈ LIVE CHART</span>
            <h2 className={styles.title}>
              SOL<span className={styles.titleAccent}>/USD</span>
            </h2>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>LIVE · EMA ACTIVE</span>
            </div>
            <span className={styles.exchange}>COINBASE</span>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <div
            className="tradingview-widget-container"
            ref={containerRef}
            style={{ height: '100%', width: '100%' }}
          >
            <div
              id="tradingview_clawsignal"
              style={{ height: 'calc(100% - 32px)', width: '100%' }}
            />
            <div className="tradingview-widget-copyright" style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
