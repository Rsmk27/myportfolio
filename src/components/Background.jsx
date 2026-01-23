import React, { useEffect, useRef } from 'react';

class DynamicBackgroundLogic {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha if not needed (but we might need it for layers) -> actually we draw full rect so alpha: false is good for the base canvas? No, fixed pos on top of what? It's z-index -1, so it is the background.
        this.width = width;
        this.height = height;

        this.particles = [];
        this.waves = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        this.colors = {
            primary: { r: 0, g: 217, b: 255 },      // Electric Blue
            secondary: { r: 0, g: 255, b: 209 },    // Cyan accent
            accent: { r: 102, g: 230, b: 255 }      // Light electric blue
        };

        this.bgGradient = null;
        this.waveGradients = [];

        this.init();
    }

    init() {
        this.resize(this.width, this.height);
        this.createParticles();
        this.createWaves();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cacheGradients();
    }

    cacheGradients() {
        // Cache Background Gradient - Deep charcoal electrical theme
        this.bgGradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.8
        );
        this.bgGradient.addColorStop(0, 'rgba(10, 14, 19, 1)');
        this.bgGradient.addColorStop(0.5, 'rgba(5, 12, 20, 0.98)');
        this.bgGradient.addColorStop(1, 'rgba(8, 10, 15, 1)');

        // Cache Wave Gradients (approximate since they move slightly, but vertical gradient can be fixed height large enough)
        this.waveGradients = [];
        this.waves.forEach((wave, index) => {
            // Create a gradient that covers the potential area of the wave
            const waveGradient = this.ctx.createLinearGradient(0, wave.yOffset - 100, 0, wave.yOffset + 200);
            const color = index === 0 ? this.colors.primary : index === 1 ? this.colors.secondary : this.colors.accent;
            waveGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            waveGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity})`);
            waveGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            this.waveGradients.push(waveGradient);
        });
    }

    createParticles() {
        this.particles = [];
        // Reduced density for better performance
        const particleCount = Math.min(Math.floor((this.width * this.height) / 20000), 60);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createWaves() {
        this.waves = [];
        for (let i = 0; i < 3; i++) {
            this.waves.push({
                amplitude: 40 + i * 20,
                frequency: 0.0008 + i * 0.0003,
                speed: 0.0003 + i * 0.0001,
                offset: Math.random() * 1000,
                opacity: 0.03 + i * 0.01,
                yOffset: this.height * (0.2 + i * 0.25)
            });
        }
        // Re-cache gradients when waves are recreated (usually only on init, but good practice)
        if (this.width) this.cacheGradients();
    }

    drawGradientBackground() {
        if (!this.bgGradient) return;
        this.ctx.fillStyle = this.bgGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawWaves() {
        this.waves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, wave.yOffset);

            // Optimization: Increase step size
            for (let x = 0; x < this.width; x += 10) {
                const y = wave.yOffset +
                    Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) * wave.amplitude +
                    Math.sin(x * wave.frequency * 0.5 + this.time * wave.speed * 1.3) * wave.amplitude * 0.5;

                this.ctx.lineTo(x, y);
            }

            this.ctx.lineTo(this.width, this.height);
            this.ctx.lineTo(0, this.height);
            this.ctx.closePath();

            this.ctx.fillStyle = this.waveGradients[index] || '#000';
            this.ctx.fill();
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Simplified mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            // distinct checking to avoid sqrt every frame if far away - simple bounding box first?
            // Just standard dist check is fine for <100 particles
            const distSq = dx * dx + dy * dy;

            if (distSq < 22500) { // 150^2
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * 0.5;
                particle.y += Math.sin(angle) * 0.5;
            }

            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

            // Simple bounds clamp
            if (particle.x < 0) particle.x = 0;
            if (particle.x > this.width) particle.x = this.width;
            if (particle.y < 0) particle.y = 0;
            if (particle.y > this.height) particle.y = this.height;

            const pulse = Math.sin(this.time * 0.002 + particle.pulsePhase) * 0.2 + 0.8;
            const alpha = particle.opacity * pulse;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`;  // Electric blue particles
            this.ctx.fill();

            // Glow - can be expensive, maybe skip for performance if needed? 
            // Let's keep it but optimized: use a pre-rendered canvas for particle glow? 
            // For now, removing the gradient glow per particle is a huge win.
            // Replacing gradient glow with simple larger arc or just skipping for performance.
            // Let's keep it simple for speed:
            // this.ctx.beginPath();
            // this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
            // this.ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.1})`; // constant fill is faster than gradient
            // this.ctx.fill();
        });
    }

    drawConnections() {
        const maxDistance = 120;
        const maxDistSq = maxDistance * maxDistance;

        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const opacity = (1 - Math.sqrt(distSq) / maxDistance) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;  // Electric blue connections
                    this.ctx.stroke();
                }
            }
        }
    }

    drawFloatingGeometry() {
        const geometryCount = 5;
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = `rgba(0, 217, 255, 0.08)`;  // Electric blue geometry

        for (let i = 0; i < geometryCount; i++) {
            const angle = (this.time * 0.0002 + i * (Math.PI * 2) / geometryCount) % (Math.PI * 2);
            const radius = Math.min(this.width, this.height) * 0.3;

            const x = this.width / 2 + Math.cos(angle) * radius;
            const y = this.height / 2 + Math.sin(angle) * radius;

            const size = 40 + Math.sin(this.time * 0.001 + i) * 10;
            const rotation = this.time * 0.0005 + i;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);

            this.ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const vertexAngle = (j * Math.PI * 2) / 6;
                const vx = Math.cos(vertexAngle) * size;
                const vy = Math.sin(vertexAngle) * size;

                if (j === 0) this.ctx.moveTo(vx, vy);
                else this.ctx.lineTo(vx, vy);
            }
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    drawGrid() {
        const gridSize = 60;
        const offsetX = (this.time * 0.01) % gridSize;
        const offsetY = (this.time * 0.01) % gridSize;

        this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.02)';  // Electric blue grid
        this.ctx.lineWidth = 1;

        // Optimize: Batch strokes
        this.ctx.beginPath();
        for (let x = -offsetX; x < this.width + gridSize; x += gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
        }
        for (let y = -offsetY; y < this.height + gridSize; y += gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawGradientBackground();
        this.drawGrid();
        this.drawWaves();
        this.drawFloatingGeometry();
        this.drawParticles();
        this.drawConnections();

        this.time++;
    }

    updateMouse(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
}

const Background = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const logicRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;

        const logic = new DynamicBackgroundLogic(canvas, canvas.width, canvas.height);
        logicRef.current = logic;

        const animate = () => {
            logic.animate();
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            logic.resize(canvas.width, canvas.height);
        };

        const handleMouseMove = (e) => {
            if (logicRef.current) {
                // Adjust mouse coordinates relative to canvas if needed, 
                // but window coordinates work well for fixed full-screen bg
                logicRef.current.updateMouse(e.clientX, e.clientY);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default Background;
