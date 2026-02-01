import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

interface OscilloscopeProps {
    isPowered: boolean;
    color?: string;
    frequency?: number;
    amplitude?: number;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({ isPowered, color = "#22d3ee", frequency = 0.05, amplitude = 0.35 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useAnimationFrame((t) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize handling
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        if (!isPowered) {
            // Flat line if off
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;

        // Use props
        const waveFreq = frequency;
        const waveAmp = height * amplitude;
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

        // Scan line effect
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
