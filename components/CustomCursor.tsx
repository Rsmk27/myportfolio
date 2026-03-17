import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'pointer' | 'project';

export const CustomCursor: React.FC = () => {
    const mouseX = useMotionValue(-200);
    const mouseY = useMotionValue(-200);

    const springCfg = { stiffness: 280, damping: 22, mass: 0.5 };
    const ringX = useSpring(mouseX, springCfg);
    const ringY = useSpring(mouseY, springCfg);

    const [state, setState] = useState<CursorState>('default');
    const [label, setLabel] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!visible) setVisible(true);
        };

        const onOver = (e: MouseEvent) => {
            const t = e.target as Element;
            const customLabelEl = t.closest('[data-cursor-label]') as HTMLElement | null;
            if (t.closest('.project-card')) {
                setState('project');
                setLabel('VIEW');
            } else if (customLabelEl?.dataset.cursorLabel) {
                setState('pointer');
                setLabel(customLabelEl.dataset.cursorLabel);
            } else if (t.closest('a')) {
                setState('pointer');
                setLabel('VISIT');
            } else if (
                t.closest('button') ||
                t.closest('[data-cursor="pointer"]')
            ) {
                setState('pointer');
                setLabel('OPEN');
            } else {
                setState('default');
                setLabel('');
            }
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        document.documentElement.addEventListener('mouseleave', onLeave);
        document.documentElement.addEventListener('mouseenter', onEnter);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeEventListener('mouseenter', onEnter);
        };
    }, [mouseX, mouseY, visible]);

    const ringSize = state === 'project' ? 56 : state === 'pointer' ? 52 : 32;
    const ringBgColor = state !== 'default' ? 'rgba(0, 242, 255, 0.12)' : 'transparent';
    const ringBorderColor = state !== 'default' ? 'rgba(0, 242, 255, 1)' : 'rgba(0, 242, 255, 0.55)';

    if (!visible) return null;

    return (
        <>
            {/* Small filled dot — exact cursor position */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none"
                style={{ x: mouseX, y: mouseY }}
            >
                <div
                    className="rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,242,255,0.8)]"
                    style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
                />
            </motion.div>

            {/* Larger hollow ring — spring-lagged */}
            <motion.div
                className="fixed top-0 left-0 z-[9998] pointer-events-none"
                style={{ x: ringX, y: ringY }}
            >
                <motion.div
                    className="rounded-full flex items-center justify-center"
                    animate={{
                        width: ringSize,
                        height: ringSize,
                        marginLeft: -ringSize / 2,
                        marginTop: -ringSize / 2,
                        backgroundColor: ringBgColor,
                        borderColor: ringBorderColor,
                        borderWidth: 1.5,
                        borderStyle: 'solid',
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                    {state !== 'default' && label && (
                        <span className="text-cyan-400 text-[9px] font-mono font-bold tracking-widest select-none">
                            {label}
                        </span>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};
