import { useEffect, useRef } from 'react'
import styles from './TradingGrid.module.css'

interface Candle {
  x: number
  open: number
  close: number
  high: number
  low: number
  bullish: boolean
}

function generateCandles(count: number, width: number, height: number): Candle[] {
  const candles: Candle[] = []
  const padding = 60
  const candleWidth = (width - padding * 2) / count
  let price = height * 0.55

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.46) * height * 0.06
    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * height * 0.025
    const low = Math.min(open, close) - Math.random() * height * 0.025
    candles.push({
      x: padding + i * candleWidth + candleWidth * 0.2,
      open,
      close,
      high,
      low,
      bullish: close >= open,
    })
    price = close
  }
  return candles
}

export default function TradingGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let tick = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // Grid lines
      const cols = 12
      const rows = 8
      ctx.strokeStyle = 'rgba(26, 143, 227, 0.07)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= cols; i++) {
        const x = (W / cols) * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let i = 0; i <= rows; i++) {
        const y = (H / rows) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Candles
      const candleCount = 28
      const candles = generateCandles(candleCount, W, H * 0.7)
      const candleW = (W - 120) / candleCount * 0.55

      candles.forEach((c) => {
        const bullColor = 'rgba(58, 171, 255, 0.85)'
        const bearColor = 'rgba(10, 74, 143, 0.85)'
        const color = c.bullish ? bullColor : bearColor

        ctx.strokeStyle = color
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(c.x + candleW / 2, c.high + H * 0.15)
        ctx.lineTo(c.x + candleW / 2, c.low + H * 0.15)
        ctx.stroke()

        ctx.fillStyle = color
        const bodyTop = Math.min(c.open, c.close) + H * 0.15
        const bodyH = Math.abs(c.close - c.open) || 1.5
        ctx.fillRect(c.x, bodyTop, candleW, bodyH)
      })

      // Signal line (moving average style)
      const points = candles.map((c, _i) => ({
        x: c.x + candleW / 2,
        y: ((c.open + c.close) / 2) + H * 0.15,
      }))

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(58, 171, 255, 0.5)'
      ctx.lineWidth = 1.2
      ctx.setLineDash([4, 4])
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Scan line animation
      const scanX = ((tick % 200) / 200) * W
      const scanGrad = ctx.createLinearGradient(scanX - 60, 0, scanX + 20, 0)
      scanGrad.addColorStop(0, 'rgba(58, 171, 255, 0)')
      scanGrad.addColorStop(0.7, 'rgba(58, 171, 255, 0.06)')
      scanGrad.addColorStop(1, 'rgba(58, 171, 255, 0.12)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, 0, W, H)

      // BUY signal marker on last bullish surge
      const sigCandle = candles[candles.length - 4]
      const sigY = sigCandle.low + H * 0.15 + 14
      const sigX = sigCandle.x + candleW / 2

      ctx.save()
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(58, 171, 255, 0.8)'
      ctx.fillStyle = 'rgba(58, 171, 255, 0.9)'
      ctx.beginPath()
      ctx.moveTo(sigX, sigY - 8)
      ctx.lineTo(sigX - 5, sigY)
      ctx.lineTo(sigX + 5, sigY)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      ctx.font = '500 9px JetBrains Mono, monospace'
      ctx.fillStyle = 'rgba(58, 171, 255, 0.9)'
      ctx.fillText('BUY', sigX - 8, sigY + 12)

      tick++
      animFrame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
