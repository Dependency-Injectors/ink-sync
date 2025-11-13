import { useEffect, useRef } from 'react'
import { Particle } from '../../utils/Particles'
const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    function resize() {
        if (!canvas) return;
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

  

    const particles: Particle[] = []
    const COUNT = 80 // tweak for more/fewer particles
    for (let i = 0; i < COUNT; i++) particles.push(new Particle(canvas, ctx ))

    function loop() {
        if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // draw and update particles
      for (const p of particles) {
        p.update()
        p.draw()
      }

      

      rafRef.current = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
 <div className="  flex flex-col justify-center items-center h-screen">
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
    <canvas
      ref={canvasRef}
      className='absolute top-0 left-0 w-full h-full z-0'
    />
        </div>
    <div className='flex z-30 flex-col backdrop-blur-md bg-white/10  border-2 border-cyan-400 rounded-2xl px-8 py-12 shadow-lg shadow-cyan-400/20 items-center justify-center gap-6'>
    
      <h2 className='text-4xl md:text-6xl font-bold text-center text-shadow-md text-shadow-cyan-500'>
        Ink Sync
      </h2>
      <p className='text-gray-200 text-xl'>
        Your <span className='text-[#33bdd5] '>Gateway</span> to Draw as a Team
      </p>
    </div>
    <div className='flex gap-5 mt-6'>
        <button className='mt-10 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/30 z-30 border-2 border-cyan-800/40 transition ease-in-out duration-300 animate-shadow-pulse'>
      Get Started
    </button>
     <button className='mt-10 px-6 py-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-full shadow-lg shadow-cyan-500/30 z-30 border-2 border-cyan-800/40 transition ease-in-out duration-300'>
      About Us
    </button>
    </div>
    </div>
  )
}
  
export default Hero