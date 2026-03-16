import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

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

export const MagneticCursor: React.FC = () => {
    const reduced = usePrefersReducedMotion();
    const [visible, setVisible] = useState(false);
    const [magnetic, setMagnetic] = useState(false);

    const rawX = useRef(0);
    const rawY = useRef(0);

    const springConfig = { stiffness: 400, damping: 30, mass: 0.5 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const INTERACTIVE = 'button, a, .cursor-magnetic';

        const onMove = (e: MouseEvent) => {
            rawX.current = e.clientX;
            rawY.current = e.clientY;
            x.set(e.clientX);
            y.set(e.clientY);
            if (!visible) setVisible(true);
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);

        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as Element).closest(INTERACTIVE)) {
                setMagnetic(true);
            }
        };
        const onMouseOut = (e: MouseEvent) => {
            if ((e.target as Element).closest(INTERACTIVE)) {
                setMagnetic(false);
            }
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        // Activate custom cursor class (scoped CSS hides default cursor)
        document.body.classList.add('magnetic-cursor-active');

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.body.classList.remove('magnetic-cursor-active');
        };
    }, [x, y, visible]);

    if (reduced) {
        return (
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
            >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </motion.div>
        );
    }

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
        >
            {/* Probe SVG */}
            <motion.svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                animate={magnetic ? { scale: 1.5 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ filter: magnetic ? 'drop-shadow(0 0 6px #00f2ff)' : 'drop-shadow(0 0 2px #00f2ff88)' }}
            >
                {/* Outer diamond */}
                <polygon
                    points="14,2 26,14 14,26 2,14"
                    fill="none"
                    stroke="#00f2ff"
                    strokeWidth={magnetic ? 1.5 : 1}
                    opacity={0.9}
                />
                {/* Inner dot */}
                <circle
                    cx="14"
                    cy="14"
                    r={magnetic ? 2.5 : 1.5}
                    fill="#00f2ff"
                />
                {/* Cross hairs */}
                <line x1="14" y1="2" x2="14" y2="8" stroke="#00f2ff" strokeWidth="1" opacity="0.5" />
                <line x1="14" y1="20" x2="14" y2="26" stroke="#00f2ff" strokeWidth="1" opacity="0.5" />
                <line x1="2" y1="14" x2="8" y2="14" stroke="#00f2ff" strokeWidth="1" opacity="0.5" />
                <line x1="20" y1="14" x2="26" y2="14" stroke="#00f2ff" strokeWidth="1" opacity="0.5" />
            </motion.svg>

            {/* Tooltip on interactive elements */}
            {magnetic && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-6 top-6 px-2 py-1 rounded text-[9px] font-mono whitespace-nowrap"
                    style={{
                        background: 'rgba(0,10,15,0.85)',
                        border: '1px solid rgba(0,242,255,0.3)',
                        color: '#00f2ff',
                        boxShadow: '0 0 8px rgba(0,242,255,0.2)',
                    }}
                >
                    {/* Decorative multimeter reading label */}
                    Status: Connected&nbsp;&nbsp;Ω: 0
                </motion.div>
            )}
        </motion.div>
    );
};
