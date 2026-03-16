import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VoltageScrollMeterProps {
    isPowered: boolean;
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return reduced;
}

export const VoltageScrollMeter: React.FC<VoltageScrollMeterProps> = ({ isPowered }) => {
    const reduced = usePrefersReducedMotion();
    const [scrollPct, setScrollPct] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0;
            setScrollPct(Math.min(1, Math.max(0, pct)));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!isPowered) return null;

    // Map 0-1 scroll to 0-5V
    const voltage = scrollPct * 5;
    const voltageText = voltage.toFixed(1) + 'V';

    // Gauge geometry
    const gaugeH = 160;
    const gaugeW = 8;
    const fillH = scrollPct * gaugeH;

    // Needle angle: -120deg (0V) to +120deg (5V), centered at top
    const needleAngle = -90 + scrollPct * 180;
    const needleLen = 32;
    const cx = 30;
    const cy = 30;
    const rad = (needleAngle * Math.PI) / 180;
    const nx = cx + Math.cos(rad) * needleLen;
    const ny = cy + Math.sin(rad) * needleLen;

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 select-none">
            {/* Gauge face */}
            <div
                style={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(0,242,255,0.2)',
                    borderRadius: 8,
                    padding: '10px 8px',
                    boxShadow: '0 0 16px rgba(0,242,255,0.08)',
                    width: 66,
                }}
            >
                {/* Semicircular gauge */}
                <svg width="60" height="38" viewBox="0 0 60 38" style={{ display: 'block', margin: '0 auto' }}>
                    {/* Gauge arc ticks */}
                    {[0, 1, 2, 3, 4, 5].map((v) => {
                        const a = -90 + (v / 5) * 180;
                        const r = (a * Math.PI) / 180;
                        const r1 = 28, r2 = 24;
                        const x1 = cx + Math.cos(r) * r1;
                        const y1 = cy + Math.sin(r) * r1;
                        const x2 = cx + Math.cos(r) * r2;
                        const y2 = cy + Math.sin(r) * r2;
                        const lx = cx + Math.cos(r) * 20;
                        const ly = cy + Math.sin(r) * 20;
                        return (
                            <g key={v}>
                                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,242,255,0.4)" strokeWidth="1" />
                                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,242,255,0.5)" fontSize="4" fontFamily="monospace">{v}</text>
                            </g>
                        );
                    })}
                    {/* Gauge arc */}
                    <path d="M 2 30 A 28 28 0 0 1 58 30" fill="none" stroke="rgba(0,242,255,0.15)" strokeWidth="1.5" />
                     {/* Needle - use transform rotate to animate smoothly */}
                    <line
                        x1={cx} y1={cy}
                        x2={cx} y2={cy - needleLen}
                        stroke="#00f2ff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{
                            filter: 'drop-shadow(0 0 3px #00f2ff)',
                            transformOrigin: `${cx}px ${cy}px`,
                            transform: `rotate(${needleAngle + 90}deg)`,
                            transition: reduced ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    />
                    <circle cx={cx} cy={cy} r="2.5" fill="#00f2ff" style={{ filter: 'drop-shadow(0 0 3px #00f2ff)' }} />
                </svg>

                {/* Liquid bar */}
                <div style={{ width: gaugeW, height: gaugeH, background: 'rgba(0,242,255,0.06)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 4, margin: '6px auto', position: 'relative', overflow: 'hidden' }}>
                    <motion.div
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, #00f2ff, rgba(0,242,255,0.4))', boxShadow: '0 0 8px rgba(0,242,255,0.6)', borderRadius: '0 0 3px 3px' }}
                        animate={reduced ? { height: fillH } : { height: fillH }}
                        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 20 }}
                    />
                    {/* Tick marks */}
                    {[1, 2, 3, 4].map((v) => (
                        <div key={v} style={{ position: 'absolute', bottom: (v / 5) * gaugeH, left: 0, right: 0, height: 1, background: 'rgba(0,242,255,0.2)' }} />
                    ))}
                </div>

                {/* Voltage label */}
                <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 9, color: '#00f2ff', letterSpacing: '0.1em', textShadow: '0 0 6px #00f2ff' }}>
                    {voltageText}
                </div>
                <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 7, color: 'rgba(0,242,255,0.4)', marginTop: 2 }}>
                    TTL
                </div>
            </div>
        </div>
    );
};
