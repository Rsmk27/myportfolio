import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

interface OscilloscopeProps {
    isPowered: boolean;
    color?: string;
    frequency?: number;
    amplitude?: number;
    scrollVelocity?: number;
    clickPulse?: number;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
    isPowered,
    color = "#22d3ee",
    frequency = 0.05,
    amplitude = 0.35,
    scrollVelocity = 0,
    clickPulse = 0,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const effectiveAmpRef = useRef(amplitude);
    const spikeRef = useRef(0); // extra amplitude spike [0-1]
    const lastClickPulse = useRef(clickPulse);

    // Watch for clickPulse changes and trigger spike
    useEffect(() => {
        if (clickPulse !== lastClickPulse.current) {
            lastClickPulse.current = clickPulse;
            spikeRef.current = 0.5; // add 0.5 to amplitude temporarily
        }
    }, [clickPulse]);

    useAnimationFrame((t, delta) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        if (!isPowered) {
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            return;
        }

        // Decay spike exponentially over ~500ms
        if (spikeRef.current > 0) {
            spikeRef.current = Math.max(0, spikeRef.current * (1 - delta / 500));
        }

        // Map scrollVelocity 0-3000 px/s → 0-0.35 extra amplitude
        const velocityExtra = Math.min(3000, scrollVelocity) / 3000 * 0.35;
        const targetAmp = amplitude + velocityExtra + spikeRef.current;

        // Smooth effective amplitude
        effectiveAmpRef.current += (targetAmp - effectiveAmpRef.current) * 0.1;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;

        const waveFreq = frequency;
        const waveAmp = height * effectiveAmpRef.current;
        const speed = t * 0.005;

        for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin(x * waveFreq + speed) * waveAmp;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        const scanX = (t * 0.5) % width;
        const gradient = ctx.createLinearGradient(scanX, 0, scanX + 50, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    });

    return (
        <canvas ref={canvasRef} className="w-full h-full block" />
    );
};

