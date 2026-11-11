import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';

// ── Cursor state ─────────────────────────────────────────────────────────────
type CursorState =
    | 'default'   // oscilloscope probe reticle
    | 'pointer'   // interactive element (button / link)
    | 'project'   // project card hover
    | 'text'      // text inputs / textareas
    | 'zoom'      // lightbox / zoomable image
    | 'label';    // data-cursor-label elements (BACK, SCROLL…)

// ── Per-state ring profile ────────────────────────────────────────────────────
const RING_PROFILE: Record<CursorState, {
    size: number;
    border: string;
    bg: string;
    dotScale: number;
    borderRadius: string | number;
    rotate: number;
}> = {
    default: {
        size: 34,
        border: 'rgba(0, 242, 255, 0.36)',
        bg: 'rgba(0, 242, 255, 0.02)',
        dotScale: 1,
        borderRadius: '50%',
        rotate: 0,
    },
    pointer: {
        size: 44,
        border: 'rgba(0, 242, 255, 0.78)',
        bg: 'rgba(0, 242, 255, 0.10)',
        dotScale: 0.45,
        borderRadius: '10px',
        rotate: 45,
    },
    project: {
        size: 58,
        border: 'rgba(0, 242, 255, 0.25)',
        bg: 'rgba(0, 242, 255, 0.12)',
        dotScale: 0,
        borderRadius: '50%',
        rotate: 0,
    },
    text: {
        size: 4,
        border: 'rgba(0, 242, 255, 0)',
        bg: 'rgba(0, 242, 255, 0)',
        dotScale: 0,
        borderRadius: 0,
        rotate: 0,
    },
    zoom: {
        size: 60,
        border: 'rgba(255, 255, 255, 0.8)',
        bg: 'rgba(8, 12, 16, 0.45)',
        dotScale: 0,
        borderRadius: '50%',
        rotate: 0,
    },
    label: {
        size: 92,
        border: 'rgba(0, 242, 255, 0.65)',
        bg: 'rgba(0, 242, 255, 0.14)',
        dotScale: 0,
        borderRadius: '50%',
        rotate: 0,
    },
};

const CARDINAL_TICKS: Array<'n' | 's' | 'e' | 'w'> = ['n', 's', 'e', 'w'];
const CORNER_TICKS: Array<'tl' | 'tr' | 'bl' | 'br'> = ['tl', 'tr', 'bl', 'br'];

// ── Component ─────────────────────────────────────────────────────────────────
export const CustomCursor: React.FC = () => {
    const mouseX = useMotionValue(-300);
    const mouseY = useMotionValue(-300);
    const prefersReducedMotion = useReducedMotion() ?? false;

    // Ring trails with precision damped spring — feels like an optical probe magnifier
    const springCfg = prefersReducedMotion
        ? { stiffness: 1200, damping: 60, mass: 0.2 }
        : { stiffness: 420, damping: 28, mass: 0.34 };
    const ringX = useSpring(mouseX, springCfg);
    const ringY = useSpring(mouseY, springCfg);

    const [state, setState] = useState<CursorState>('default');
    const [label, setLabel] = useState('');
    const [visible, setVisible] = useState(false);
    const [clicking, setClicking] = useState(false);
    const visibleRef = useRef(false);

    useEffect(() => {
        const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        let moveRaf: number | null = null;
        const onMove = (e: MouseEvent) => {
            if (!visibleRef.current) {
                visibleRef.current = true;
                setVisible(true);
            }
            if (moveRaf !== null) cancelAnimationFrame(moveRaf);
            moveRaf = requestAnimationFrame(() => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            });
        };

        let lastTarget: Element | null = null;
        const classify = (e: MouseEvent) => {
            const rawTarget = e.target;
            if (!(rawTarget instanceof Element) || rawTarget === lastTarget) return;
            lastTarget = rawTarget;

            // — zoom-out: lightbox backdrop
            if (
                rawTarget.closest('[class*="cursor-zoom"]') ||
                (rawTarget as HTMLElement).style?.cursor === 'zoom-out'
            ) {
                setState('zoom');
                setLabel('CLOSE');
                return;
            }

            // — text / textarea / contenteditable
            if (
                rawTarget.closest('input') ||
                rawTarget.closest('textarea') ||
                (rawTarget as HTMLElement).isContentEditable
            ) {
                setState('text');
                setLabel('');
                return;
            }

            // — project card
            if (rawTarget.closest('.project-card')) {
                setState('project');
                setLabel('VIEW');
                return;
            }

            // — data-cursor-label (custom labels from JSX)
            const labelEl = rawTarget.closest('[data-cursor-label]') as HTMLElement | null;
            if (labelEl?.dataset.cursorLabel) {
                setState('label');
                setLabel(labelEl.dataset.cursorLabel);
                return;
            }

            // — generic interactive (button, link, data-cursor=pointer)
            if (
                rawTarget.closest('a') ||
                rawTarget.closest('button') ||
                rawTarget.closest('[data-cursor="pointer"]') ||
                rawTarget.closest('[role="button"]') ||
                rawTarget.closest('[tabindex]') ||
                rawTarget.tagName === 'SELECT'
            ) {
                const micro = rawTarget.closest('a') ? 'VISIT' : '';
                setState('pointer');
                setLabel(micro);
                return;
            }

            setState('default');
            setLabel('');
        };

        const onLeave = () => {
            visibleRef.current = false;
            setVisible(false);
        };
        const onEnter = () => {
            visibleRef.current = true;
            setVisible(true);
        };
        const onDown = () => setClicking(true);
        const onUp = () => setClicking(false);

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', classify, { passive: true });
        window.addEventListener('mousedown', onDown, { passive: true });
        window.addEventListener('mouseup', onUp, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave, { passive: true });
        document.documentElement.addEventListener('mouseenter', onEnter, { passive: true });

        return () => {
            if (moveRaf !== null) cancelAnimationFrame(moveRaf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', classify);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeEventListener('mouseenter', onEnter);
        };
    }, [mouseX, mouseY]);

    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice || !visible) return null;

    const p = RING_PROFILE[state];
    const rs = clicking ? p.size * 0.84 : p.size;
    const dotPx = 5;

    return (
        <>
            {/* ── Precision Probe Tip — snaps directly to cursor ── */}
            <motion.div
                aria-hidden="true"
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    x: mouseX,
                    y: mouseY,
                    zIndex: 10001,
                    willChange: 'transform',
                }}
            >
                <motion.div
                    style={{
                        width: dotPx,
                        height: dotPx,
                        marginLeft: -dotPx / 2,
                        marginTop: -dotPx / 2,
                        borderRadius: state === 'text' ? 1 : '50%',
                    }}
                    animate={{
                        scale: clicking
                            ? 0.65
                            : state === 'text'
                                ? 0
                                : p.dotScale,
                        backgroundColor:
                            state === 'zoom'
                                ? '#ffffff'
                                : clicking
                                    ? '#ffae00'
                                    : '#00f2ff',
                        boxShadow:
                            clicking
                                ? '0 0 8px rgba(255,174,0,0.95), 0 0 16px rgba(255,174,0,0.45)'
                                : state === 'default'
                                    ? '0 0 6px rgba(0,242,255,0.9), 0 0 14px rgba(0,242,255,0.4)'
                                    : '0 0 4px rgba(0,242,255,0.6)',
                    }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                />
            </motion.div>

            {/* ── Oscilloscope Reticle Ring — spring-lagged ── */}
            <motion.div
                aria-hidden="true"
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    x: ringX,
                    y: ringY,
                    zIndex: 10000,
                    willChange: 'transform',
                }}
            >
                <motion.div
                    className="relative flex items-center justify-center p-0 m-0"
                    animate={{
                        width: rs,
                        height: rs,
                        marginLeft: -rs / 2,
                        marginTop: -rs / 2,
                        borderWidth: clicking ? 2 : 1.25,
                        borderStyle: 'solid',
                        borderColor: clicking && state !== 'zoom' ? 'rgba(255, 174, 0, 0.85)' : p.border,
                        backgroundColor: p.bg,
                        scale: clicking ? 0.88 : 1,
                        borderRadius: p.borderRadius,
                        rotate: p.rotate,
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25, mass: 0.5 }}
                >
                    {/* Counter-rotated inner layer so telemetry labels stay upright */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: -p.rotate }}
                        transition={{ duration: 0 }}
                    >
                        {/* Default state: oscilloscope corner brackets + cardinal probe crosshairs */}
                        {state === 'default' && (
                            <>
                                {CORNER_TICKS.map((pos) => (
                                    <span key={pos} style={cornerTick(pos)} />
                                ))}
                                {CARDINAL_TICKS.map((dir) => (
                                    <span key={dir} style={cardinalTick(dir, clicking)} />
                                ))}
                            </>
                        )}

                        {/* Pointer state: precision target-lock corner accents */}
                        {state === 'pointer' && (
                            <span
                                style={{
                                    position: 'absolute',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255, 174, 0, 0.75)',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}

                        {/* Inner telemetry label */}
                        <AnimatePresence mode="wait">
                            {(state === 'project' || state === 'label' || state === 'zoom') && label && (
                                <motion.span
                                    key={label}
                                    initial={{ opacity: 0, scale: 0.75 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.75 }}
                                    transition={{ duration: 0.14 }}
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: '0.16em',
                                        color:
                                            state === 'zoom'
                                                ? 'rgba(255,255,255,0.92)'
                                                : 'rgba(0,242,255,0.96)',
                                        textShadow:
                                            state === 'zoom'
                                                ? 'none'
                                                : '0 0 8px rgba(0,242,255,0.45)',
                                        userSelect: 'none',
                                        textTransform: 'uppercase',
                                        pointerEvents: 'none',
                                        position: 'absolute',
                                    }}
                                >
                                    {state === 'zoom' ? '✕' : label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Rotating dashed arc overlay on zoom */}
                    {state === 'zoom' && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: -6,
                                borderRadius: '50%',
                                border: '1px dashed rgba(255,255,255,0.28)',
                                animation: prefersReducedMotion ? undefined : 'cursor-spin 5s linear infinite',
                                pointerEvents: 'none',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}

                    {/* Dual-channel oscilloscope capture ring for Project hover */}
                    {state === 'project' && (
                        <>
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    inset: -7,
                                    borderRadius: '50%',
                                    border: '1.5px solid transparent',
                                    borderTopColor: 'rgba(0,242,255,0.9)',
                                    borderBottomColor: 'rgba(0,242,255,0.9)',
                                    animation: prefersReducedMotion ? undefined : 'cursor-spin 2.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
                                    pointerEvents: 'none',
                                }}
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            />
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    inset: -11,
                                    borderRadius: '50%',
                                    border: '1px solid transparent',
                                    borderLeftColor: 'rgba(255,174,0,0.55)',
                                    borderRightColor: 'rgba(255,174,0,0.55)',
                                    animation: prefersReducedMotion ? undefined : 'spin-reverse 3.5s linear infinite',
                                    pointerEvents: 'none',
                                }}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                            />
                        </>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};

// ── Corner bracket helper ────────────────────────────────────────────────────
function cornerTick(pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties {
    const base: React.CSSProperties = {
        position: 'absolute',
        width: 5,
        height: 5,
        borderColor: 'rgba(0, 242, 255, 0.68)',
        borderStyle: 'solid',
    };
    const corners: Record<'tl' | 'tr' | 'bl' | 'br', React.CSSProperties> = {
        tl: { top: 2, left: 2, borderWidth: '1.25px 0 0 1.25px' },
        tr: { top: 2, right: 2, borderWidth: '1.25px 1.25px 0 0' },
        bl: { bottom: 2, left: 2, borderWidth: '0 0 1.25px 1.25px' },
        br: { bottom: 2, right: 2, borderWidth: '0 1.25px 1.25px 0' },
    };
    return { ...base, ...corners[pos] };
}

// ── Cardinal oscilloscope crosshair tick helper ──────────────────────────────
function cardinalTick(dir: 'n' | 's' | 'e' | 'w', active: boolean): React.CSSProperties {
    const color = active ? 'rgba(255, 174, 0, 0.85)' : 'rgba(0, 242, 255, 0.55)';
    const positions: Record<'n' | 's' | 'e' | 'w', React.CSSProperties> = {
        n: { top: -4, left: '50%', width: 1, height: 5, marginLeft: -0.5, backgroundColor: color },
        s: { bottom: -4, left: '50%', width: 1, height: 5, marginLeft: -0.5, backgroundColor: color },
        e: { right: -4, top: '50%', width: 5, height: 1, marginTop: -0.5, backgroundColor: color },
        w: { left: -4, top: '50%', width: 5, height: 1, marginTop: -0.5, backgroundColor: color },
    };
    return {
        position: 'absolute',
        pointerEvents: 'none',
        ...positions[dir],
    };
}
