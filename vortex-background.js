
import { createNoise3D } from "https://cdn.jsdelivr.net/npm/simplex-noise@4.0.0/dist/esm/simplex-noise.min.js";

class VortexBackground {
  constructor(containerId) {
    this.canvas = document.createElement('canvas');
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error('Container not found');
      return;
    }

    this.container.appendChild(this.canvas);
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';


    this.particleCount = 700;
    this.particlePropCount = 9;
    this.particlePropsLength = this.particleCount * this.particlePropCount;
    this.rangeY = 100;
    this.baseTTL = 50;
    this.rangeTTL = 150;
    this.baseSpeed = 0.0;
    this.rangeSpeed = 1.5;
    this.baseRadius = 1;
    this.rangeRadius = 2;
    this.baseHue = 220;
    this.rangeHue = 100;
    this.noiseSteps = 3;
    this.xOff = 0.00125;
    this.yOff = 0.00125;
    this.zOff = 0.0005;
    this.backgroundColor = "#000000";
    this.tick = 0;
    this.noise3D = createNoise3D();
    this.particleProps = new Float32Array(this.particlePropsLength);
    this.center = [0, 0];

    this.HALF_PI = 0.5 * Math.PI;
    this.TAU = 2 * Math.PI;
    this.TO_RAD = Math.PI / 180;

    this.setup();
  }

  rand = (n) => n * Math.random();
  randRange = (n) => n - this.rand(2 * n);
  fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  setup = () => {
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.resize();
      this.initParticles();
      this.draw(ctx);
    }
  };

  initParticles = () => {
    this.tick = 0;
    this.particleProps = new Float32Array(this.particlePropsLength);

    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.initParticle(i);
    }
  };

  initParticle = (i) => {
    if (!this.canvas) return;

    let x, y, vx, vy, life, ttl, speed, radius, hue;

    x = this.rand(this.canvas.width);
    y = this.center[1] + this.randRange(this.rangeY);
    vx = 0;
    vy = 0;
    life = 0;
    ttl = this.baseTTL + this.rand(this.rangeTTL);
    speed = this.baseSpeed + this.rand(this.rangeSpeed);
    radius = this.baseRadius + this.rand(this.rangeRadius);
    hue = this.baseHue + this.rand(this.rangeHue);

    this.particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  draw = (ctx) => {
    this.tick++;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawParticles(ctx);
    this.renderGlow(ctx);
    this.renderToScreen(ctx);

    window.requestAnimationFrame(() => this.draw(ctx));
  };

  drawParticles = (ctx) => {
    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.updateParticle(i, ctx);
    }
  };

  updateParticle = (i, ctx) => {
    if (!this.canvas) return;

    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

    x = this.particleProps[i];
    y = this.particleProps[i2];
    n = this.noise3D(x * this.xOff, y * this.yOff, this.tick * this.zOff) * this.noiseSteps * this.TAU;
    vx = this.lerp(this.particleProps[i3], Math.cos(n), 0.5);
    vy = this.lerp(this.particleProps[i4], Math.sin(n), 0.5);
    life = this.particleProps[i5];
    ttl = this.particleProps[i6];
    speed = this.particleProps[i7];
    x2 = x + vx * speed;
    y2 = y + vy * speed;
    radius = this.particleProps[i8];
    hue = this.particleProps[i9];

    this.drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    this.particleProps[i] = x2;
    this.particleProps[i2] = y2;
    this.particleProps[i3] = vx;
    this.particleProps[i4] = vy;
    this.particleProps[i5] = life;

    (this.checkBounds(x, y) || life > ttl) && this.initParticle(i);
  };

  drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${this.fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  checkBounds = (x, y) => {
    return x > this.canvas.width || x < 0 || y > this.canvas.height || y < 0;
  };

  resize = () => {
    const { innerWidth, innerHeight } = window;

    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;

    this.center[0] = 0.5 * this.canvas.width;
    this.center[1] = 0.5 * this.canvas.height;
  };

  renderGlow = (ctx) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(this.canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(this.canvas, 0, 0);
    ctx.restore();
  };

  renderToScreen = (ctx) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(this.canvas, 0, 0);
    ctx.restore();
  };
}

document.addEventListener('DOMContentLoaded', () => {
  new VortexBackground('vortex-bg-canvas');
});
