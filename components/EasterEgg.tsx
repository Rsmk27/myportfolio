import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

const BOOT_SEQUENCE = [
    { text: '> Initializing RSMK ENERGY GRID v3.0 // OVERRIDE MODE', delay: 400 },
    { text: '> Bypassing security protocols............. [OK]', delay: 300 },
    { text: '> Accessing root subroutines............... [OK]', delay: 200 },
    { text: '> Welcome, ADMIN. Terminal access granted.', delay: 500 },
    { text: 'Type "help" for a list of commands.', delay: 100 },
];

const ASCII_ART = `
  ██████╗ ███████╗███╗   ███╗██╗  ██╗
  ██╔══██╗██╔════╝████╗ ████║██║ ██╔╝
  ██████╔╝███████╗██╔████╔██║█████╔╝ 
  ██╔══██╗╚════██║██║╚██╔╝██║██╔═██╗ 
  ██║  ██║███████║██║ ╚═╝ ██║██║  ██╗
  ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
  ─── ROOT TERMINAL ACCESS GRANTED ──
`.trim();

interface HistoryLine {
    id: number;
    text: React.ReactNode;
    isCommand?: boolean;
    color?: string;
}

export const EasterEgg: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<HistoryLine[]>([]);
    const [input, setInput] = useState('');
    const [isBooting, setIsBooting] = useState(true);
    const [isGlitching, setIsGlitching] = useState(false);
    
    const seqRef = useRef<string[]>([]);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Konami code listener
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            seqRef.current = [...seqRef.current, e.key].slice(-KONAMI_SEQUENCE.length);
            if (seqRef.current.join(',').toLowerCase() === KONAMI_SEQUENCE.join(',').toLowerCase()) {
                if (!isOpen) startTerminal();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // Focus input and scroll
    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
        if (isOpen && !isBooting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [history, isOpen, isBooting]);

    const startTerminal = () => {
        setIsOpen(true);
        setHistory([]);
        setInput('');
        setIsBooting(true);
        setIsGlitching(false);

        let currentDelay = 0;
        
        setTimeout(() => {
            setHistory([{ id: Date.now(), text: <pre className="text-[10px] md:text-xs leading-tight text-emerald-400 select-none pb-2">{ASCII_ART}</pre> }]);
        }, 100);

        BOOT_SEQUENCE.forEach((step, index) => {
            currentDelay += step.delay;
            setTimeout(() => {
                setHistory(prev => [...prev, { id: Date.now() + index, text: step.text }]);
                if (index === BOOT_SEQUENCE.length - 1) {
                    setIsBooting(false);
                }
            }, currentDelay);
        });
    };

    const handleClose = () => setIsOpen(false);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        setInput('');
        const newCmdLine = { id: Date.now(), text: `ADMIN> ${cmd}`, isCommand: true };
        setHistory(prev => [...prev, newCmdLine]);

        setTimeout(() => processCommand(cmd), 150);
    };

    const processCommand = (cmd: string) => {
        const timestamp = Date.now();
        const pushLine = (text: React.ReactNode, color?: string) => {
            setHistory(prev => [...prev, { id: timestamp + Math.random(), text, color }]);
        };

        switch (cmd) {
            case 'help':
                pushLine(<>
                    Available commands:<br/>
                    &nbsp;&nbsp;<span className="text-white">help</span>     - Show this manual<br/>
                    &nbsp;&nbsp;<span className="text-white">status</span>   - Run diagnostics on grid<br/>
                    &nbsp;&nbsp;<span className="text-white">overload</span> - Initiate controlled system overload<br/>
                    &nbsp;&nbsp;<span className="text-white">matrix</span>   - Toggle visual matrix stream<br/>
                    &nbsp;&nbsp;<span className="text-white">clear</span>    - Clear terminal History<br/>
                    &nbsp;&nbsp;<span className="text-white">exit</span>     - Drop connection
                </>, 'text-emerald-300');
                break;
            case 'status':
                pushLine(<>
                    DIAGNOSTICS SEQUENCE INITIATED...<br/>
                    [████████████░░] 85% VOLTAGE CAPACITY<br/>
                    [██████████████] 100% ROUTING EFFICIENCY<br/>
                    [████░░░░░░░░░░] 25% THERMAL STRESS<br/>
                    GRID STATUS: <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">NOMINAL</span>
                </>);
                break;
            case 'clear':
                setHistory([{ id: Date.now(), text: 'Terminal cleared.' }]);
                break;
            case 'exit':
                pushLine('Disconnecting from root mainframe...', 'text-emerald-500');
                setTimeout(() => handleClose(), 800);
                break;
            case 'overload':
                pushLine('WARNING: INITIATING SYSTEM OVERLOAD!', 'text-red-500 font-bold');
                setIsGlitching(true);
                setTimeout(() => {
                    pushLine('ERROR: POWER SURGE DETECTED IN SECTOR 7G', 'text-red-500 font-bold');
                }, 800);
                setTimeout(() => {
                    pushLine('CRITICAL: COOLING SYS OFFLINE', 'text-red-500 font-bold');
                }, 1600);
                setTimeout(() => {
                    setIsGlitching(false);
                    pushLine('AUTO-RECOVERY ENGAGED. Overload purged.', 'text-emerald-400 mt-2');
                }, 3500);
                break;
            case 'matrix':
                pushLine('Accessing the construct...', 'text-emerald-500');
                const generateStream = () => Array.from({length:6}).map(() => Math.random().toString(36).substring(2, 10).toUpperCase()).join(' ');
                pushLine(<div className="break-all tracking-widest mt-2">
                    {generateStream()}<br/>{generateStream()}<br/>{generateStream()}
                </div>, 'text-[#10b981] opacity-70 drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]');
                break;
            case 'sudo':
            case 'su':
                pushLine('Nice try. But you are already ADMIN.', 'text-yellow-400');
                break;
            case 'whoami':
                pushLine('ADMIN_01. Location: CLASSIFIED.');
                break;
            case 'ls':
            case 'dir':
                pushLine(<>
                    <span className="text-blue-400 font-bold">bin/</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="text-blue-400 font-bold">schematics/</span><br/>
                    <span className="text-blue-400 font-bold">config/</span> &nbsp;&nbsp;<span className="text-gray-300">grid_logs.txt</span><br/>
                    <span className="text-red-400 font-bold">master_override.sh</span>
                </>);
                break;
            default:
                pushLine(`Command not found: ${cmd}. Type "help" for a list of commands.`, 'text-red-400');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-hidden"
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    {/* CRT Scanline Overlay */}
                    <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50"></div>
                    
                    {/* Screen glare/vignette */}
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,1)] z-40"></div>

                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 20 }}
                        animate={
                            isGlitching 
                                ? { x: [-3, 3, -3, 3, 0], y: [-3, 3, -3, 3, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(-45deg)', 'hue-rotate(0deg)'], transition: { repeat: Infinity, duration: 0.15 } }
                                : { scale: 1, opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
                        }
                        exit={{ scale: 0.88, opacity: 0, y: 20 }}
                        className={`relative w-full max-w-3xl rounded-xl overflow-hidden border ${isGlitching ? 'border-red-500/80 shadow-[0_0_100px_rgba(239,68,68,0.4)]' : 'border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.15),inset_0_0_30px_rgba(16,185,129,0.05)]'}`}
                        style={{ background: '#020703' }}
                    >
                        {/* Title bar */}
                        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isGlitching ? 'border-red-500/40 bg-red-950/30' : 'border-emerald-500/20 bg-[#041207]'}`}>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                            </div>
                            <span className={`text-[10px] font-mono tracking-[0.2em] font-bold uppercase ${isGlitching ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'text-emerald-500/70'}`}>
                                {isGlitching ? 'CRITICAL FAILURE' : 'ROOT SECURE TERMINAL'}
                            </span>
                            <button
                                onClick={handleClose}
                                className="text-emerald-500/50 hover:text-emerald-400 transition-colors text-sm focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Terminal Body */}
                        <div 
                            className="px-5 py-4 h-[65vh] max-h-[500px] overflow-y-auto font-mono text-sm leading-relaxed"
                            style={{ 
                                textShadow: isGlitching ? '0 0 8px rgba(239,68,68,0.8)' : '0 0 5px rgba(16,185,129,0.6)',
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
                            }}
                            onClick={() => !isBooting && inputRef.current?.focus()}
                        >
                            <div className="space-y-1.5 flex flex-col pb-4">
                                {history.map((line) => (
                                    <div 
                                        key={line.id} 
                                        className={`${line.color || (isGlitching ? 'text-red-400' : 'text-emerald-400/95')} ${line.isCommand ? 'opacity-80 mt-2' : ''}`}
                                    >
                                        {line.text}
                                    </div>
                                ))}
                                
                                <div ref={terminalEndRef} />
                                
                                {!isBooting && (
                                    <form onSubmit={handleCommand} className="flex items-center mt-3 group">
                                        <span className={`${isGlitching ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-emerald-300 drop-shadow-[0_0_6px_rgba(110,231,183,0.8)]'} font-bold mr-2`}>
                                            ADMIN&gt;
                                        </span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className={`flex-1 bg-transparent border-none outline-none text-white font-mono ${isGlitching ? 'caret-red-500' : 'caret-emerald-400'} focus:ring-0 placeholder-transparent`}
                                            spellCheck="false"
                                            autoComplete="off"
                                            autoFocus
                                            disabled={isGlitching || isBooting}
                                        />
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

