import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

const BOOT_SEQUENCE = [
    { text: '> Initializing RSMK ENERGY GRID v3.0 // DIAGNOSTIC CONSOLE', delay: 320 },
    { text: '> Verifying Modbus-TCP & ESP32 telemetry bus..... [OK]', delay: 260 },
    { text: '> Loading oscilloscope & relay diagnostic hooks.... [OK]', delay: 220 },
    { text: '> Welcome, ADMIN. Hardware override access granted.', delay: 360 },
    { text: 'Type "help" for available diagnostic commands (Tab to autocomplete).', delay: 100 },
];

const AVAILABLE_COMMANDS = [
    'help', 'status', 'probe', 'pins', 'overload', 'matrix', 'hack', 'theme', 'clear', 'ls', 'whoami', 'exit',
];

interface HistoryLine {
    id: number | string;
    text: React.ReactNode;
    isCommand?: boolean;
    color?: string;
}

type ThemeKey = 'green' | 'amber' | 'blue' | 'red';

const THEMES: Record<ThemeKey, {
    text: string;
    textLight: string;
    textDark: string;
    border: string;
    bg: string;
    titleBg: string;
    titleBorder: string;
    shadow: string;
    caret: string;
    glow: string;
    led: string;
}> = {
    green: {
        text: 'text-emerald-400',
        textLight: 'text-emerald-300',
        textDark: 'text-emerald-500',
        border: 'border-emerald-500/40',
        bg: '#030804',
        titleBg: 'bg-[#051408]',
        titleBorder: 'border-emerald-500/25',
        shadow: 'shadow-[0_0_80px_rgba(16,185,129,0.16),inset_0_0_32px_rgba(16,185,129,0.06)]',
        caret: 'caret-emerald-400',
        glow: 'rgba(16, 185, 129, 0.55)',
        led: 'bg-emerald-400',
    },
    amber: {
        text: 'text-amber-400',
        textLight: 'text-amber-300',
        textDark: 'text-amber-500',
        border: 'border-amber-500/40',
        bg: '#090601',
        titleBg: 'bg-[#160d02]',
        titleBorder: 'border-amber-500/25',
        shadow: 'shadow-[0_0_80px_rgba(245,158,11,0.16),inset_0_0_32px_rgba(245,158,11,0.06)]',
        caret: 'caret-amber-400',
        glow: 'rgba(245, 158, 11, 0.55)',
        led: 'bg-amber-400',
    },
    blue: {
        text: 'text-cyan-400',
        textLight: 'text-cyan-300',
        textDark: 'text-cyan-500',
        border: 'border-cyan-500/40',
        bg: '#02080b',
        titleBg: 'bg-[#03151e]',
        titleBorder: 'border-cyan-500/25',
        shadow: 'shadow-[0_0_80px_rgba(6,182,212,0.16),inset_0_0_32px_rgba(6,182,212,0.06)]',
        caret: 'caret-cyan-400',
        glow: 'rgba(0, 242, 255, 0.55)',
        led: 'bg-cyan-400',
    },
    red: {
        text: 'text-red-400',
        textLight: 'text-red-300',
        textDark: 'text-red-500',
        border: 'border-red-500/40',
        bg: '#080101',
        titleBg: 'bg-[#1b0303]',
        titleBorder: 'border-red-500/25',
        shadow: 'shadow-[0_0_80px_rgba(239,68,68,0.16),inset_0_0_32px_rgba(239,68,68,0.06)]',
        caret: 'caret-red-400',
        glow: 'rgba(239, 68, 68, 0.55)',
        led: 'bg-red-400',
    },
};

const GridLogo: React.FC<{ theme: ThemeKey }> = ({ theme }) => {
    // 5 rows x 23 columns dot-matrix "RSMK" emblem
    const gridData = [
        [1,1,1,1,0, 0, 0,1,1,1,0, 0, 1,0,0,0,1, 0, 1,0,0,0,1],
        [1,0,0,0,1, 0, 1,0,0,0,0, 0, 1,1,0,1,1, 0, 1,0,0,1,0],
        [1,1,1,1,0, 0, 0,1,1,1,0, 0, 1,0,1,0,1, 0, 1,1,1,0,0],
        [1,0,0,1,0, 0, 0,0,0,0,1, 0, 1,0,0,0,1, 0, 1,0,0,1,0],
        [1,0,0,0,1, 0, 0,1,1,1,0, 0, 1,0,0,0,1, 0, 1,0,0,0,1],
    ];

    const colors = THEMES[theme];

    return (
        <div className={`flex flex-col gap-[3px] xs:gap-[4px] md:gap-[5px] my-3 select-none ${colors.text}`}>
            {gridData.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-[3px] xs:gap-[4px] md:gap-[5px]">
                    {row.map((cell, cIdx) => (
                        <div
                            key={cIdx}
                            className={`w-[8px] h-[8px] xs:w-[10px] xs:h-[10px] sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] rounded-[1px] md:rounded-[2px] transition-all duration-300 ${
                                cell
                                    ? 'bg-current shadow-[0_0_8px_currentColor]'
                                    : 'bg-zinc-900/40 border border-zinc-800/15'
                            }`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const EasterEgg: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<HistoryLine[]>([]);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [cmdIndex, setCmdIndex] = useState(-1);
    const [input, setInput] = useState('');
    const [isBooting, setIsBooting] = useState(true);
    const [isGlitching, setIsGlitching] = useState(false);
    const [themeName, setThemeName] = useState<ThemeKey>('green');

    const prefersReducedMotion = useReducedMotion() ?? false;
    const seqRef = useRef<string[]>([]);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const timersRef = useRef<number[]>([]);

    const currentTheme = useMemo(() => THEMES[themeName], [themeName]);

    const clearPendingTimers = useCallback(() => {
        timersRef.current.forEach((id) => window.clearTimeout(id));
        timersRef.current = [];
    }, []);

    const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
        const id = window.setTimeout(fn, ms);
        timersRef.current.push(id);
        return id;
    }, []);

    const handleClose = useCallback(() => {
        clearPendingTimers();
        setIsGlitching(false);
        setIsOpen(false);
    }, [clearPendingTimers]);

    const startTerminal = useCallback(() => {
        clearPendingTimers();
        setIsOpen(true);
        setHistory([]);
        setInput('');
        setCmdIndex(-1);
        setIsBooting(true);
        setIsGlitching(false);

        let currentDelay = 0;

        scheduleTimeout(() => {
            setHistory([{ id: 'logo', text: '' }]);
        }, 80);

        BOOT_SEQUENCE.forEach((step, index) => {
            currentDelay += step.delay;
            scheduleTimeout(() => {
                setHistory((prev) => [...prev, { id: `${Date.now()}-${index}`, text: step.text }]);
                if (index === BOOT_SEQUENCE.length - 1) {
                    setIsBooting(false);
                }
            }, currentDelay);
        });
    }, [clearPendingTimers, scheduleTimeout]);

    // Cleanup timers on unmount
    useEffect(() => clearPendingTimers, [clearPendingTimers]);

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
    }, [isOpen, startTerminal]);

    // Handle escape key
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, handleClose]);

    // Focus input and scroll
    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
        if (isOpen && !isBooting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [history, isOpen, isBooting]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        setInput('');
        setCmdHistory((prev) => [cmd, ...prev.slice(0, 29)]);
        setCmdIndex(-1);
        const newCmdLine: HistoryLine = { id: `${Date.now()}-cmd`, text: `ADMIN> ${cmd}`, isCommand: true };
        setHistory((prev) => [...prev, newCmdLine]);

        scheduleTimeout(() => processCommand(cmd), 110);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            if (cmdHistory.length === 0) return;
            e.preventDefault();
            const nextIdx = Math.min(cmdIndex + 1, cmdHistory.length - 1);
            setCmdIndex(nextIdx);
            setInput(cmdHistory[nextIdx]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (cmdIndex <= 0) {
                setCmdIndex(-1);
                setInput('');
            } else {
                const nextIdx = cmdIndex - 1;
                setCmdIndex(nextIdx);
                setInput(cmdHistory[nextIdx]);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const trimmed = input.trim().toLowerCase();
            if (!trimmed) return;
            const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(trimmed));
            if (match) setInput(match);
        }
    };

    const processCommand = (inputLine: string) => {
        const timestamp = Date.now();
        const pushLine = (text: React.ReactNode, color?: string) => {
            setHistory((prev) => [...prev, { id: timestamp + Math.random(), text, color }]);
        };

        const tokens = inputLine.trim().split(/\s+/);
        const cmd = tokens[0].toLowerCase();
        const arg = tokens[1]?.toLowerCase();

        switch (cmd) {
            case 'help':
                pushLine(
                    <>
                        Available diagnostic commands:<br />
                        &nbsp;&nbsp;<span className="text-white">help</span>     - Show this command reference<br />
                        &nbsp;&nbsp;<span className="text-white">status</span>   - Run electrical &amp; grid bus diagnostics<br />
                        &nbsp;&nbsp;<span className="text-white">probe</span>    - Sample live CH1/CH2 oscilloscope waveform<br />
                        &nbsp;&nbsp;<span className="text-white">pins</span>     - Inspect ESP32 &amp; Modbus-TCP I/O mapping<br />
                        &nbsp;&nbsp;<span className="text-white">overload</span> - Simulate transient surge &amp; auto-recovery<br />
                        &nbsp;&nbsp;<span className="text-white">matrix</span>   - Sample raw bus telemetry stream<br />
                        &nbsp;&nbsp;<span className="text-white">hack</span>     - Initiate grid override simulator<br />
                        &nbsp;&nbsp;<span className="text-white">theme</span>    - Switch phosphor tint (green/amber/blue/red)<br />
                        &nbsp;&nbsp;<span className="text-white">clear</span>    - Clear terminal output<br />
                        &nbsp;&nbsp;<span className="text-white">exit</span>     - Close diagnostic console
                    </>,
                    currentTheme.textLight
                );
                break;
            case 'status':
                pushLine(
                    <>
                        DIAGNOSTICS SEQUENCE INITIATED...<br />
                        [████████████░░] 85% BUS VOLTAGE CAPACITY (11.0kV / 440V)<br />
                        [██████████████] 100% ROUTING &amp; PLC SYNC EFFICIENCY<br />
                        [████░░░░░░░░░░] 25% THERMAL STRESS (34.2°C)<br />
                        GRID STATUS:{' '}
                        <span
                            className={`${currentTheme.text} font-bold`}
                            style={{ textShadow: `0 0 8px ${currentTheme.glow}` }}
                        >
                            NOMINAL
                        </span>
                    </>
                );
                break;
            case 'probe':
            case 'scope':
                pushLine(
                    <div className="whitespace-pre text-xs sm:text-sm leading-snug">
                        {`OSCILLOSCOPE CAPTURE // TRIGGER: RISING EDGE (CH1)
CH1 [AC LINE] :  230.4 Vrms  |  50.00 Hz  |  THD: 1.4%
CH2 [ESP32]   :   3.30 Vdc   |  PWM 20kHz |  DUTY: 64%
────────────────────────────────────────────────────
   ╭──╮      ╭──╮      ╭──╮      ╭──╮
──╯   ╰──╮  ╯   ╰──╮  ╯   ╰──╮  ╯   ╰──  CH1 50Hz
         ╰──╯      ╰──╯      ╰──╯
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─ CH2 PWM`}
                    </div>,
                    currentTheme.textLight
                );
                break;
            case 'pins':
                pushLine(
                    <div className="whitespace-pre text-xs sm:text-sm leading-snug">
                        {`HARDWARE BUS & MCU PINOUT MAP:
  GPIO21 / GPIO22  ──► I2C  (MPU-6050 IMU @ 0x68)
  GPIO16 / GPIO17  ──► UART2 (NEO-6M GPS @ 9600bps)
  GPIO04           ──► ADC1 (MQ-2 GAS / THERMAL SENSOR)
  GPIO26 / GPIO27  ──► PWM  (L298N MOTOR BRIDGE)
  ETH / WIFI       ──► MODBUS-TCP (:502) // CODESYS PLC`}
                    </div>,
                    currentTheme.text
                );
                break;
            case 'clear':
                setHistory([{ id: Date.now(), text: 'Terminal buffer cleared.' }]);
                break;
            case 'exit':
                pushLine('Disconnecting from hardware diagnostic bus...', currentTheme.textDark);
                scheduleTimeout(() => handleClose(), 650);
                break;
            case 'overload':
                pushLine('WARNING: INITIATING SYSTEM OVERLOAD!', 'text-red-500 font-bold');
                setIsGlitching(true);
                scheduleTimeout(() => {
                    pushLine('ERROR: POWER SURGE DETECTED ON FEEDER BUS 7G', 'text-red-500 font-bold');
                }, 700);
                scheduleTimeout(() => {
                    pushLine('CRITICAL: BREAKER TRIPPED — THERMAL INTERLOCK ACTIVE', 'text-red-500 font-bold');
                }, 1450);
                scheduleTimeout(() => {
                    setIsGlitching(false);
                    pushLine('AUTO-RECOVERY ENGAGED. Surge cleared; rail stabilized.', `${currentTheme.text} mt-2`);
                }, 3100);
                break;
            case 'matrix':
                pushLine('Sampling raw telemetry frames...', currentTheme.textDark);
                scheduleTimeout(() => {
                    const generateStream = () =>
                        Array.from({ length: 12 })
                            .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 93)))
                            .join(' ');
                    pushLine(
                        <div
                            className="break-all tracking-widest leading-relaxed opacity-75 mt-1 select-none"
                            style={{ textShadow: `0 0 6px ${currentTheme.glow}` }}
                        >
                            {generateStream()}<br />
                            {generateStream()}<br />
                            {generateStream()}<br />
                            {generateStream()}
                        </div>,
                        currentTheme.text
                    );
                }, 130);
                break;
            case 'hack':
                pushLine('INITIATING GRID OVERRIDE SIMULATOR...', 'text-amber-400 font-bold');
                scheduleTimeout(() => {
                    pushLine('Scanning Modbus-TCP relay nodes... found 12 active coils', currentTheme.text);
                }, 450);
                scheduleTimeout(() => {
                    pushLine('Synchronizing phase locks on nodes 1-4... [LOCKED]', currentTheme.text);
                }, 1050);
                scheduleTimeout(() => {
                    pushLine('Synchronizing phase locks on nodes 5-8... [LOCKED]', currentTheme.text);
                }, 1650);
                scheduleTimeout(() => {
                    pushLine('Bypassing interlock simulation guard... [OVERRIDE]', 'text-red-400 font-bold');
                }, 2250);
                scheduleTimeout(() => {
                    pushLine('Reading distribution telemetry keys... [DONE]', currentTheme.text);
                }, 2850);
                scheduleTimeout(() => {
                    pushLine(
                        'ACCESS GRANTED: Full diagnostic grid control active.',
                        'text-white font-bold'
                    );
                }, 3450);
                break;
            case 'theme':
                if (arg === 'green' || arg === 'amber' || arg === 'blue' || arg === 'red') {
                    setThemeName(arg);
                    const colorMap: Record<ThemeKey, string> = {
                        green: 'GREEN (PHOSPHOR)',
                        amber: 'AMBER (STANDBY)',
                        blue: 'CYAN (ONLINE)',
                        red: 'RED (FAULT)',
                    };
                    pushLine(`Terminal phosphor theme switched to ${colorMap[arg]}.`);
                } else {
                    pushLine(
                        <>
                            Usage: <span className="text-white">theme [green|amber|blue|red]</span><br />
                            Current theme: <span className="text-white font-bold">{themeName.toUpperCase()}</span>
                        </>
                    );
                }
                break;
            case 'sudo':
            case 'su':
                pushLine('Nice try. Privilege level is already ADMIN_01.', 'text-amber-300');
                break;
            case 'whoami':
                pushLine('ADMIN_01 // ALIET EEE LAB // VIJAYAWADA');
                break;
            case 'ls':
            case 'dir':
                pushLine(
                    <>
                        <span className="text-cyan-400 font-bold">bin/</span> &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                        <span className="text-cyan-400 font-bold">schematics/</span><br />
                        <span className="text-cyan-400 font-bold">firmware/</span> &nbsp;
                        <span className="text-zinc-300">grid_telemetry.log</span><br />
                        <span className="text-amber-400 font-bold">modbus_override.sh</span>
                    </>
                );
                break;
            default:
                pushLine(`Command not found: ${cmd}. Type "help" for a list of commands.`, 'text-red-400');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="RSMK Root Hardware Diagnostic Terminal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    {/* CRT Scanline Overlay */}
                    <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.28)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_4px,3px_100%] z-50" />

                    {/* Screen glare/vignette */}
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.96)] z-40" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 18 }}
                        animate={
                            isGlitching && !prefersReducedMotion
                                ? {
                                      x: [-3, 3, -3, 3, 0],
                                      y: [-3, 3, -3, 3, 0],
                                      filter: [
                                          'hue-rotate(0deg)',
                                          'hue-rotate(90deg)',
                                          'hue-rotate(-45deg)',
                                          'hue-rotate(0deg)',
                                      ],
                                      transition: { repeat: Infinity, duration: 0.15 },
                                  }
                                : {
                                      scale: 1,
                                      opacity: 1,
                                      y: 0,
                                      transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                                  }
                        }
                        exit={{ scale: 0.9, opacity: 0, y: 18 }}
                        className={`relative w-full max-w-3xl rounded-xl overflow-hidden border ${
                            isGlitching
                                ? 'border-red-500/80 shadow-[0_0_100px_rgba(239,68,68,0.4)]'
                                : `${currentTheme.border} ${currentTheme.shadow}`
                        }`}
                        style={{ background: currentTheme.bg }}
                    >
                        {/* Instrument Title Bar */}
                        <div
                            className={`flex items-center justify-between px-4 py-2.5 border-b ${
                                isGlitching
                                    ? 'border-red-500/40 bg-red-950/30'
                                    : `${currentTheme.titleBorder} ${currentTheme.titleBg}`
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/75" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/75" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/75" />
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isGlitching ? 'bg-red-500 animate-ping' : currentTheme.led}`} />
                                    {isGlitching ? 'FAULT: OVERVOLTAGE' : 'BUS: MODBUS-TCP'}
                                </span>
                            </div>
                            <span
                                className={`text-[10px] font-mono tracking-[0.2em] font-bold uppercase ${
                                    isGlitching ? 'text-red-400' : currentTheme.text
                                }`}
                                style={{
                                    textShadow: isGlitching
                                        ? '0 0 8px rgba(239,68,68,0.85)'
                                        : `0 0 8px ${currentTheme.glow}`,
                                }}
                            >
                                {isGlitching ? 'CRITICAL FAILURE' : 'ROOT DIAGNOSTIC TERMINAL'}
                            </span>
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close diagnostic terminal"
                                className={`${currentTheme.text} opacity-65 hover:opacity-100 transition-opacity text-sm px-1.5 py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 cursor-pointer`}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Terminal Body */}
                        <div
                            className="px-5 py-4 h-[65vh] max-h-[520px] overflow-y-auto font-mono text-sm leading-relaxed"
                            style={{
                                textShadow: isGlitching
                                    ? '0 0 8px rgba(239,68,68,0.75)'
                                    : `0 0 5px ${currentTheme.glow}`,
                                fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
                            }}
                            onClick={() => !isBooting && inputRef.current?.focus()}
                        >
                            <div className="space-y-1.5 flex flex-col pb-4">
                                {history.map((line) => {
                                    if (line.id === 'logo') {
                                        return (
                                            <div key={line.id} className="pb-2">
                                                <GridLogo theme={themeName} />
                                                <div className={`text-xs opacity-85 ${currentTheme.text} tracking-[0.2em] font-bold mt-3`}>
                                                    ─── ROOT HARDWARE DIAGNOSTIC SHELL ───
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={line.id}
                                            className={`${line.color || (isGlitching ? 'text-red-400' : currentTheme.text)} ${line.isCommand ? 'opacity-85 mt-2' : ''}`}
                                        >
                                            {line.text}
                                        </div>
                                    );
                                })}

                                <div ref={terminalEndRef} />

                                {!isBooting && (
                                    <form onSubmit={handleCommand} className="flex items-center mt-3 group">
                                        <span
                                            className={`${
                                                isGlitching ? 'text-red-500' : currentTheme.textLight
                                            } font-bold mr-2 shrink-0`}
                                            style={{
                                                textShadow: isGlitching
                                                    ? '0 0 8px rgba(239,68,68,0.8)'
                                                    : `0 0 6px ${currentTheme.glow}`,
                                            }}
                                        >
                                            ADMIN&gt;
                                        </span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleInputKeyDown}
                                            aria-label="Terminal command input"
                                            className={`flex-1 bg-transparent border-none outline-none text-white font-mono ${isGlitching ? 'caret-red-500' : currentTheme.caret} focus:ring-0 placeholder-transparent`}
                                            spellCheck={false}
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
