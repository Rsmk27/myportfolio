import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// ── Cursor state ─────────────────────────────────────────────────────────────
type CursorState =
    | 'default'   // bare crosshair
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
    mixBlend: 'normal' | 'difference' | 'exclusion';
}> = {
    default: {
        size: 28,
        border: 'rgba(0,242,255,0.45)',
        bg: 'transparent',
        dotScale: 1,
        mixBlend: 'normal',
    },
    pointer: {
        size: 46,
        border: 'rgba(0,242,255,0.9)',
        bg: 'rgba(0,242,255,0.08)',
        dotScale: 0.5,
        mixBlend: 'normal',
    },
    project: {
        size: 64,
        border: 'rgba(0,242,255,1)',
        bg: 'rgba(0,242,255,0.10)',
        dotScale: 0,
        mixBlend: 'normal',
    },
    text: {
        size: 4,
        border: 'rgba(0,242,255,0)',
        bg: 'rgba(0,242,255,0)',
        dotScale: 1,
        mixBlend: 'difference',
    },
    zoom: {
        size: 56,
        border: 'rgba(255,255,255,0.7)',
        bg: 'rgba(255,255,255,0.06)',
        dotScale: 0,
        mixBlend: 'normal',
    },
    label: {
        size: 56,
        border: 'rgba(0,242,255,0.85)',
        bg: 'rgba(0,242,255,0.08)',
        dotScale: 0,
        mixBlend: 'normal',
    },
};

// ── Component ─────────────────────────────────────────────────────────────────
export const CustomCursor: React.FC = () => {
    const mouseX = useMotionValue(-300);
    const mouseY = useMotionValue(-300);

    // Ring lags behind with spring — feel like a trailing magnifier
    const springCfg = { stiffness: 320, damping: 26, mass: 0.45 };
    const ringX = useSpring(mouseX, springCfg);
    const ringY = useSpring(mouseY, springCfg);

    const [state, setState] = useState<CursorState>('default');
    const [label, setLabel] = useState('');
    const [visible, setVisible] = useState(false);
    const [clicking, setClicking] = useState(false);

    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!visible) setVisible(true);
        };

        const classify = (e: MouseEvent) => {
            const t = e.target as Element;

            // — zoom-out: lightbox backdrop
            if (t.closest('[class*="cursor-zoom"]') || (t as HTMLElement).style?.cursor === 'zoom-out') {
                setState('zoom');
                setLabel('CLOSE');
                return;
            }

            // — text / textarea / contenteditable
            if (
                t.closest('input') ||
                t.closest('textarea') ||
                (t as HTMLElement).isContentEditable
            ) {
                setState('text');
                setLabel('');
                return;
            }

            // — project card
            if (t.closest('.project-card')) {
                setState('project');
                setLabel('VIEW');
                return;
            }

            // — data-cursor-label (custom labels from JSX)
            const labelEl = t.closest('[data-cursor-label]') as HTMLElement | null;
            if (labelEl?.dataset.cursorLabel) {
                setState('label');
                setLabel(labelEl.dataset.cursorLabel);
                return;
            }

            // — generic interactive (button, link, data-cursor=pointer)
            if (
                t.closest('a') ||
                t.closest('button') ||
                t.closest('[data-cursor="pointer"]') ||
                t.closest('[role="button"]') ||
                t.closest('[tabindex]') ||
                (t as HTMLElement).tagName === 'SELECT'
            ) {
                // pick a context-aware micro-label
                let micro = '';
                if (t.closest('a')) micro = 'VISIT';
                else if (t.closest('button')) micro = '';
                setState('pointer');
                setLabel(micro);
                return;
            }

            setState('default');
            setLabel('');
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);
        const onDown  = () => setClicking(true);
        const onUp    = () => setClicking(false);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', classify);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        document.documentElement.addEventListener('mouseleave', onLeave);
        document.documentElement.addEventListener('mouseenter', onEnter);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', classify);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeEventListener('mouseenter', onEnter);
        };
    }, [mouseX, mouseY, visible]);

    if (!visible) return null;

    const p = RING_PROFILE[state];
    const rs = clicking ? p.size * 0.82 : p.size;
    const dotPx = 5; // core dot size

    return (
        <>
            {/* ── Core dot — snaps exactly to cursor ── */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    x: mouseX,
                    y: mouseY,
                    zIndex: 10001,
                    mixBlendMode: p.mixBlend,
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
                            ? 0.6
                            : state === 'text'
                            ? 0      // hide dot in text mode (caret replaces it)
                            : p.dotScale,
                        backgroundColor:
                            state === 'zoom'
                                ? '#ffffff'
                                : '#00f2ff',
                        boxShadow:
                            state === 'default'
                                ? '0 0 6px rgba(0,242,255,0.9), 0 0 14px rgba(0,242,255,0.4)'
                                : '0 0 3px rgba(0,242,255,0.5)',
                    }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                />
            </motion.div>

            {/* ── Ring — spring-lagged ── */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    x: ringX,
                    y: ringY,
                    zIndex: 10000,
                }}
            >
                <motion.div
                    className="relative flex items-center justify-center"
                    style={{ borderRadius: '50%' }}
                    animate={{
                        width:  rs,
                        height: rs,
                        marginLeft: -rs / 2,
                        marginTop:  -rs / 2,
                        borderWidth: clicking ? 2 : 1.5,
                        borderStyle: 'solid',
                        borderColor: p.border,
                        backgroundColor: p.bg,
                        scale: clicking ? 0.9 : 1,
                    }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Corner tick marks on ring — only in default state */}
                    {state === 'default' && (
                        <>
                            <span style={tick('tl')} />
                            <span style={tick('tr')} />
                            <span style={tick('bl')} />
                            <span style={tick('br')} />
                        </>
                    )}

                    {/* Inner label */}
                    <AnimatePresence mode="wait">
                        {(state === 'project' || state === 'label' || state === 'zoom') && label && (
                            <motion.span
                                key={label}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: '0.14em',
                                    color:
                                        state === 'zoom'
                                            ? 'rgba(255,255,255,0.85)'
                                            : 'rgba(0,242,255,0.95)',
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

                    {/* Rotating dashed arc overlay on project / zoom */}
                    {(state === 'project' || state === 'zoom') && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: -6,
                                borderRadius: '50%',
                                border: `1px dashed ${state === 'zoom' ? 'rgba(255,255,255,0.22)' : 'rgba(0,242,255,0.25)'}`,
                                animation: 'cursor-spin 4s linear infinite',
                                pointerEvents: 'none',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};

// ── Tick mark helper ─────────────────────────────────────────────────────────
function tick(pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties {
    const base: React.CSSProperties = {
        position: 'absolute',
        width: 5,
        height: 5,
        borderColor: 'rgba(0,242,255,0.7)',
        borderStyle: 'solid',
    };
    const corners: Record<string, React.CSSProperties> = {
        tl: { top: 2,    left: 2,    borderWidth: '1.5px 0 0 1.5px' },
        tr: { top: 2,    right: 2,   borderWidth: '1.5px 1.5px 0 0' },
        bl: { bottom: 2, left: 2,    borderWidth: '0 0 1.5px 1.5px' },
        br: { bottom: 2, right: 2,   borderWidth: '0 1.5px 1.5px 0' },
    };
    return { ...base, ...corners[pos] };
}
