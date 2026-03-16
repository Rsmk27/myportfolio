import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

const BOOT_MESSAGES = [
    '> Initializing RSMK ENERGY GRID v2.4.1...',
    '> Scanning power nodes............. [12/12 ONLINE]',
    '> Loading GridForge subsystem......... OK',
    '> Calibrating smart meters............ OK',
    '> Connecting IoT mesh network......... OK',
    '> Solar arrays: 98.7% efficiency....... OPTIMAL',
    '> Fault detection module.............. ENABLED',
    '> Thermal management................ NOMINAL',
    '> All systems are nominal.',
    '> Welcome, Engineer. Access granted.',
];

const ASCII_ART = `
  ██████╗ ███████╗███╗   ███╗██╗  ██╗
  ██╔══██╗██╔════╝████╗ ████║██║ ██╔╝
  ██████╔╝███████╗██╔████╔██║█████╔╝ 
  ██╔══██╗╚════██║██║╚██╔╝██║██╔═██╗ 
  ██║  ██║███████║██║ ╚═╝ ██║██║  ██╗
  ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
  ─────── ENERGY GRID TERMINAL ───────
`.trim();

export const EasterEgg: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [typingText, setTypingText] = useState('');
    const seqRef = useRef<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const isTypingRef = useRef(false);

    // Konami code listener
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            seqRef.current = [...seqRef.current, e.key].slice(-KONAMI_SEQUENCE.length);
            if (seqRef.current.join(',') === KONAMI_SEQUENCE.join(',')) {
                setIsOpen(true);
                setDisplayedMessages([]);
                setCurrentMsgIndex(0);
                setTypingText('');
                isTypingRef.current = false;
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // Escape to close
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (!isOpen || isTypingRef.current) return;
        if (currentMsgIndex >= BOOT_MESSAGES.length) return;

        isTypingRef.current = true;
        const message = BOOT_MESSAGES[currentMsgIndex];
        let charIndex = 0;
        setTypingText('');

        const interval = setInterval(() => {
            charIndex++;
            setTypingText(message.slice(0, charIndex));
            if (charIndex >= message.length) {
                clearInterval(interval);
                setDisplayedMessages(prev => [...prev, message]);
                setTypingText('');
                isTypingRef.current = false;
                setTimeout(() => setCurrentMsgIndex(prev => prev + 1), 250);
            }
        }, 30);

        return () => {
            clearInterval(interval);
            isTypingRef.current = false;
        };
    }, [isOpen, currentMsgIndex]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [displayedMessages, typingText]);

    const handleClose = () => setIsOpen(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.88, opacity: 0, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-2xl rounded-lg overflow-hidden border border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,0.15)]"
                        style={{ background: '#050f05' }}
                    >
                        {/* Title bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-500/20"
                            style={{ background: '#0a170a' }}>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <span className="text-[10px] font-mono text-green-500/60 tracking-[0.2em] uppercase">
                                RSMK — ENERGY GRID — TERMINAL
                            </span>
                            <button
                                onClick={handleClose}
                                aria-label="Close terminal"
                                className="text-green-500/50 hover:text-green-400 transition-colors text-sm focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ASCII art header */}
                        <div className="px-4 pt-4 pb-2 border-b border-green-500/10">
                            <pre
                                className="text-green-400/70 leading-tight select-none"
                                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
                            >
                                {ASCII_ART}
                            </pre>
                        </div>

                        {/* Terminal output */}
                        <div
                            ref={terminalRef}
                            className="px-4 py-3 h-52 overflow-y-auto space-y-1"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            {displayedMessages.map((msg, i) => (
                                <div key={i} className="text-green-400/80 text-sm leading-relaxed">
                                    {msg}
                                </div>
                            ))}
                            {currentMsgIndex < BOOT_MESSAGES.length && typingText && (
                                <div className="text-green-300 text-sm leading-relaxed">
                                    {typingText}
                                    <span className="animate-pulse text-green-400">█</span>
                                </div>
                            )}
                            {currentMsgIndex >= BOOT_MESSAGES.length && (
                                <div className="text-cyan-400/80 text-sm mt-2 leading-relaxed">
                                    {'> '}Press{' '}
                                    <kbd className="px-1.5 py-0.5 text-xs bg-green-900/40 border border-green-500/30 rounded">
                                        ESC
                                    </kbd>{' '}
                                    or click outside to exit.
                                </div>
                            )}
                        </div>

                        {/* Status bar */}
                        <div className="px-4 py-2 border-t border-green-500/10 flex items-center gap-3"
                            style={{ background: '#0a170a' }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-mono text-green-500/50 tracking-widest">
                                SYSTEM READY — KONAMI CODE ACCEPTED
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
