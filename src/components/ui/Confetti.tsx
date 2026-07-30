import * as React from "react"

interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; rotation: number; rotationSpeed: number
  size: number; shape: 'rect' | 'circle'
}

const COLORS = ['#16A34A','#2563EB','#F59E0B','#EC4899','#8B5CF6','#EF4444','#06B6D4','#F97316']

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const particlesRef = React.useRef<Particle[]>([])
  const rafRef = React.useRef<number>(0)

  React.useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    particlesRef.current = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 10 + 5,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))

    let alive = true
    const loop = () => {
      if (!alive) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1
        p.rotation += p.rotationSpeed
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / (canvas.height * 1.2))
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()

    const t = setTimeout(() => { alive = false; cancelAnimationFrame(rafRef.current); ctx.clearRect(0, 0, canvas.width, canvas.height) }, 4000)
    return () => { alive = false; cancelAnimationFrame(rafRef.current); clearTimeout(t) }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}