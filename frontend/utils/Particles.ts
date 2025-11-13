export class Particle {
      x: number
      y: number
      vx: number
      vy: number
      r: number
    canvas : HTMLCanvasElement; 
    ctx : CanvasRenderingContext2D;
      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.r = 1
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset()
      }

      reset() {
        const rect = this.canvas.getBoundingClientRect()
        this.x = Math.random() * rect.width
        this.y = Math.random() * rect.height
        const speed = 0.25 + Math.random() * 0.2
        const angle = Math.random() * Math.PI * 2
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.r = 0.8 + Math.random() * 2.2
      }

      update() {
        const rect = this.canvas.getBoundingClientRect()
        this.x += this.vx
        this.y += this.vy
        if (this.x < -20 || this.x > rect.width + 20 || this.y < -20 || this.y > rect.height + 20) {
          this.reset()
        }
      }

      draw() {
        this.ctx.beginPath()
        this.ctx.fillStyle = '#33bdd533'
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
