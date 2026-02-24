import { useEffect, useState } from 'react'
import styles from './Signals.module.css'

const MESSAGES = [
  { line1: 'Signal', line2: 'detected.', delay: 0 },
  { line1: 'Precision', line2: 'entry.', delay: 0.1 },
  { line1: 'Algorithmic', line2: 'instinct.', delay: 0.2 },
  { line1: 'Claw', line2: 'the chart.', delay: 0.3 },
]

const LOG_LINES = [
  { time: '09:31:04.221', type: 'SCAN', msg: 'Order flow imbalance detected — CLAW/USDT' },
  { time: '09:31:04.334', type: 'CALC', msg: 'Momentum divergence: +0.84σ above baseline' },
  { time: '09:31:04.441', type: 'SIGNAL', msg: 'Entry signal confidence: 98.4% — THRESHOLD MET' },
  { time: '09:31:04.442', type: 'EXEC', msg: 'Position initiated at $0.0000412' },
  { time: '09:31:07.119', type: 'HOLD', msg: 'Volatility contraction phase — holding position' },
  { time: '09:31:12.883', type: 'SIGNAL', msg: 'Secondary breakout detected — adding to position' },
  { time: '09:31:19.004', type: 'EXIT', msg: 'Take-profit triggered — exit at $0.0000489 (+18.7%)' },
  { time: '09:31:19.005', type: 'LOG', msg: 'Cycle complete. Next scan in 0.03s...' },
]

const typeColors: Record<string, string> = {
  SCAN: 'var(--text-muted)',
  CALC: 'var(--text-secondary)',
  SIGNAL: 'var(--electric-300)',
  EXEC: 'var(--electric-200)',
  HOLD: 'var(--text-muted)',
  EXIT: '#5DFFB9',
  LOG: 'var(--text-muted)',
}

export default function Signals() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !looping) {
          setLooping(true)
        }
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('signals')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [looping])

  useEffect(() => {
    if (!looping) return
    setVisibleLines(0)
    let i = 0
    const iv = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= LOG_LINES.length) {
        clearInterval(iv)
        setTimeout(() => setLooping(false), 2000)
      }
    }, 320)
    return () => clearInterval(iv)
  }, [looping])

  useEffect(() => {
    if (!looping) {
      const t = setTimeout(() => setLooping(true), 800)
      return () => clearTimeout(t)
    }
  }, [looping])

  return (
    <section id="signals" className={styles.section}>
      <div className={styles.container}>

        {/* Messaging grid */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>◈ BRAND MESSAGING</span>
        </div>

        <div className={styles.messageGrid}>
          {MESSAGES.map((m) => (
            <div
              key={m.line2}
              className={styles.messageCard}
              style={{ animationDelay: `${m.delay}s` }}
            >
              <span className={styles.msgLine1}>{m.line1}</span>
              <span className={styles.msgLine2}>{m.line2}</span>
            </div>
          ))}
        </div>

        {/* Algorithm terminal */}
        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalDots}>
              <span /><span /><span />
            </div>
            <span className={styles.terminalTitle}>CLAWSIGNAL_ENGINE v2.4.1</span>
            <span className={styles.terminalStatus}>● LIVE</span>
          </div>
          <div className={styles.terminalBody}>
            {LOG_LINES.map((line, i) => (
              <div
                key={i}
                className={`${styles.logLine} ${i < visibleLines ? styles.logVisible : ''}`}
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                <span className={styles.logTime}>{line.time}</span>
                <span
                  className={styles.logType}
                  style={{ color: typeColors[line.type] }}
                >
                  [{line.type}]
                </span>
                <span className={styles.logMsg}>{line.msg}</span>
              </div>
            ))}
            <div className={styles.logCursor}>
              <span className={styles.cursorBlink}>█</span>
            </div>
          </div>
        </div>

        {/* Tone pillars */}
        <div className={styles.tonePillars}>
          {[
            { label: 'Intelligent', desc: 'Every word is precise. No filler, no hype.' },
            { label: 'Intimidating', desc: 'Confidence without arrogance. The market respects dominance.' },
            { label: 'Algorithmic', desc: 'Speak in data. Let the numbers do the talking.' },
          ].map((t) => (
            <div key={t.label} className={styles.tonePillar}>
              <span className={styles.toneLabel}>{t.label}</span>
              <p className={styles.toneDesc}>{t.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
