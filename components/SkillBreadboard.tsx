import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, Wifi, Code2, Zap, Cog, Activity, Radio, type LucideIcon } from 'lucide-react';
import { trackInteraction } from '../utils/analytics';

interface SkillBreadboardProps {
    isPowered: boolean;
}

interface SkillCategory {
    id: string;
    designator: string;
    busSpec: string;
    title: string;
    icon: LucideIcon;
    label: string;
    accent: string;
    standbyAccent: string;
    textClass: string;
    badgeClass: string;
    activeChipClass: string;
    glowShadow: string;
    skills: string[];
    note?: string;
}

// Map skill names to their PNG/SVG logo URLs
const SKILL_LOGO_MAP: Record<string, string> = {
    'PLC Programming': '/assets/logos/codesys.svg',
    'CODESYS': '/assets/logos/codesys.svg',
    'Factory I/O': '/assets/logos/factoryio.svg',
    'Connected Components Workbench': '/assets/logos/ccw.svg',
    'Optix Studio HMI': '/assets/logos/optix-studio.svg',
    'Optix Studio': '/assets/logos/optix-studio.svg',
    'Modbus TCP': '/assets/logos/modbus.svg',
    'SCADA': '/assets/logos/factoryio.svg',
    'Ladder Logic': '/assets/logos/codesys.svg',
    'ESP32': '/assets/logos/esp32.svg',
    'Arduino': '/assets/logos/arduino.svg',
    'Embedded C/C++': '/assets/logos/cplusplus.svg',
    'UART / I2C / SPI': '/assets/logos/modbus.svg',
    'Wokwi': '/assets/logos/wokwi.svg',
    'TinkerCAD': '/assets/logos/tinkercad.svg',
    'IoT System Design': '/assets/logos/mqtt.svg',
    'MQTT': '/assets/logos/mqtt.svg',
    'Firebase RTDB': '/assets/logos/firebase.svg',
    'Firebase': '/assets/logos/firebase.svg',
    'Telemetry & Dashboards': '/assets/logos/thingspeak.svg',
    'ThingSpeak Cloud': '/assets/logos/thingspeak.svg',
    'Blynk IoT': '/assets/logos/blynk.svg',
    'Substation Transformers': '/assets/issuers/coromandel.png',
    'Generation, Transmission & Distribution': '/assets/logos/power-grid.svg',
    'Generation, Transmission and Distribution': '/assets/logos/power-grid.svg',
    'Electrical Machines': '/assets/logos/modbus.svg',
    'Converters & Inverters': '/assets/logos/esp32.svg',
    'MATLAB / Simulink': '/assets/issuers/mathworks.png',
    'MATLAB': '/assets/issuers/mathworks.png',
    'Simulink': '/assets/issuers/mathworks.png',
    'Python': '/assets/logos/python.svg',
    'C/C++': '/assets/logos/cplusplus.svg',
    'GitHub': '/assets/issuers/github.png',
    'VS Code': '/assets/logos/vscode.svg',
};

const CATEGORIES: SkillCategory[] = [
    {
        id: 'automation',
        designator: 'U1',
        busSpec: 'IEC-61131 // 24VDC',
        title: 'Industrial Automation & Control',
        icon: Cog,
        label: 'Automation Domain',
        accent: '#22d3ee',
        standbyAccent: '#fbbf24',
        textClass: 'text-cyan-300',
        badgeClass: 'bg-cyan-950/50 text-cyan-100 border-cyan-400/30 hover:bg-cyan-900/50 hover:border-cyan-300/70',
        activeChipClass: 'bg-cyan-900/60 text-white border-cyan-300/80 shadow-[0_0_14px_rgba(34,211,238,0.28)]',
        glowShadow: '0 0 32px rgba(34,211,238,0.16), inset 0 1px 0 rgba(34,211,238,0.2)',
        skills: ['PLC Programming', 'CODESYS', 'Factory I/O', 'Connected Components Workbench', 'Optix Studio HMI', 'Modbus TCP', 'SCADA', 'Ladder Logic'],
        note: 'Hands-on project & simulation-based control learning',
    },
    {
        id: 'embedded',
        designator: 'U2',
        busSpec: '3.3V CMOS // MCU',
        title: 'Embedded Systems & Firmware',
        icon: Cpu,
        label: 'Hardware & Firmware',
        accent: '#38bdf8',
        standbyAccent: '#fbbf24',
        textClass: 'text-sky-300',
        badgeClass: 'bg-sky-950/50 text-sky-100 border-sky-400/30 hover:bg-sky-900/50 hover:border-sky-300/70',
        activeChipClass: 'bg-sky-900/60 text-white border-sky-300/80 shadow-[0_0_14px_rgba(56,189,248,0.28)]',
        glowShadow: '0 0 32px rgba(56,189,248,0.16), inset 0 1px 0 rgba(56,189,248,0.2)',
        skills: ['ESP32', 'Arduino', 'Embedded C/C++', 'UART / I2C / SPI', 'Wokwi', 'TinkerCAD'],
    },
    {
        id: 'iot',
        designator: 'U3',
        busSpec: '2.4GHz // MQTT-RT',
        title: 'Internet of Things (IoT) & Telemetry',
        icon: Wifi,
        label: 'IoT & Telemetry',
        accent: '#34d399',
        standbyAccent: '#fbbf24',
        textClass: 'text-emerald-300',
        badgeClass: 'bg-emerald-950/50 text-emerald-100 border-emerald-400/30 hover:bg-emerald-900/50 hover:border-emerald-300/70',
        activeChipClass: 'bg-emerald-900/60 text-white border-emerald-300/80 shadow-[0_0_14px_rgba(52,211,153,0.28)]',
        glowShadow: '0 0 32px rgba(52,211,153,0.16), inset 0 1px 0 rgba(52,211,153,0.2)',
        skills: ['IoT System Design', 'MQTT', 'Firebase RTDB', 'Telemetry & Dashboards', 'ThingSpeak Cloud', 'Blynk IoT'],
    },
    {
        id: 'power',
        designator: 'U4',
        busSpec: '11kV / 440V // HV',
        title: 'Power Systems & Power Electronics',
        icon: Zap,
        label: 'Power & Energy',
        accent: '#fbbf24',
        standbyAccent: '#f59e0b',
        textClass: 'text-amber-300',
        badgeClass: 'bg-amber-950/45 text-amber-100 border-amber-400/35 hover:bg-amber-900/45 hover:border-amber-300/75',
        activeChipClass: 'bg-amber-900/60 text-white border-amber-300/85 shadow-[0_0_14px_rgba(251,191,36,0.28)]',
        glowShadow: '0 0 32px rgba(251,191,36,0.16), inset 0 1px 0 rgba(251,191,36,0.2)',
        skills: ['Generation, Transmission & Distribution', 'Substation Transformers', 'Electrical Machines', 'Converters & Inverters'],
    },
    {
        id: 'software',
        designator: 'U5',
        busSpec: 'EDA // SIM-ENV',
        title: 'Engineering Software & Tools',
        icon: Code2,
        label: 'Software & Tools',
        accent: '#a5b4fc',
        standbyAccent: '#fbbf24',
        textClass: 'text-indigo-300',
        badgeClass: 'bg-indigo-950/50 text-indigo-100 border-indigo-400/30 hover:bg-indigo-900/50 hover:border-indigo-300/70',
        activeChipClass: 'bg-indigo-900/60 text-white border-indigo-300/80 shadow-[0_0_14px_rgba(165,180,252,0.28)]',
        glowShadow: '0 0 32px rgba(165,180,252,0.16), inset 0 1px 0 rgba(165,180,252,0.2)',
        skills: ['MATLAB / Simulink', 'Python', 'C/C++', 'GitHub', 'VS Code'],
        note: 'Engineering simulation tools, version control & development environments',
    },
];

const TOTAL_PINS = CATEGORIES.reduce((acc, cat) => acc + cat.skills.length, 0);

/* ── ENIG Gold / Copper Mounting Via Pad ────────────────── */
const CornerViaPad: React.FC<{ isPowered: boolean; isActive: boolean; accent: string }> = ({
    isPowered,
    isActive,
    accent,
}) => (
    <span
        aria-hidden="true"
        className="w-3 h-3 rounded-full flex items-center justify-center border transition-all duration-300"
        style={{
            borderColor: isPowered
                ? isActive
                    ? accent
                    : 'rgba(217, 179, 98, 0.55)'
                : 'rgba(217, 179, 98, 0.38)',
            background: isPowered
                ? 'radial-gradient(circle, rgba(251,191,36,0.32) 0%, rgba(120,83,24,0.28) 65%, transparent 100%)'
                : 'radial-gradient(circle, rgba(161,161,170,0.18) 0%, rgba(39,39,42,0.4) 70%, transparent 100%)',
        }}
    >
        <span className="w-1 h-1 rounded-full bg-[#080806] border border-zinc-700/80" />
    </span>
);

/* ── Tactile IC Pin / Breadboard Header Chip ────────────── */
const SkillChip: React.FC<{
    label: string;
    pinCode: string;
    badgeClass: string;
    activeChipClass: string;
    accent: string;
    delay: number;
    isPowered: boolean;
    isProbed: boolean;
    onProbe: (label: string | null) => void;
}> = ({ label, pinCode, badgeClass, activeChipClass, accent, delay, isPowered, isProbed, onProbe }) => {
    const logoUrl = SKILL_LOGO_MAP[label];

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, delay }}
            onMouseEnter={() => onProbe(label)}
            onMouseLeave={() => onProbe(null)}
            className={`group/pin relative inline-flex items-center px-2.5 py-1.5 rounded-md border text-[11px] md:text-xs font-mono
                tracking-wide cursor-crosshair transition-all duration-200 select-none gap-2
                ${isPowered
                    ? isProbed
                        ? activeChipClass
                        : badgeClass
                    : isProbed
                        ? 'bg-zinc-800 text-amber-300 border-amber-400/70 shadow-sm'
                        : 'bg-zinc-900/90 text-zinc-200 border-zinc-700/90 hover:bg-zinc-800 hover:border-amber-400/60'
                }`}
        >
            {/* Gold / Copper Contact Pad + Silkscreen Pin Number */}
            <span className="inline-flex items-center gap-1 shrink-0">
                <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover/pin:scale-125"
                    style={{
                        backgroundColor: isPowered ? (isProbed ? '#ffffff' : accent) : '#fbbf24',
                        boxShadow: isPowered && isProbed ? `0 0 6px ${accent}` : 'none',
                    }}
                />
                <span
                    className={`text-[10px] font-bold tracking-tight ${
                        isPowered ? 'text-zinc-300' : 'text-amber-400'
                    }`}
                >
                    {pinCode}
                </span>
            </span>

            {/* Pin Divider Trace */}
            <span
                aria-hidden="true"
                className={`w-px h-3.5 ${isPowered ? 'bg-white/15' : 'bg-zinc-700'}`}
            />

            {logoUrl && (
                <img
                    src={logoUrl}
                    alt={label}
                    loading="lazy"
                    className="w-4 h-4 object-contain inline-block shrink-0"
                />
            )}
            <span className="font-medium leading-none">{label}</span>
        </motion.span>
    );
};

/* ── IC Bank Daughterboard Card ─────────────────────────── */
const CategoryCard: React.FC<{
    cat: SkillCategory;
    idx: number;
    isActive: boolean;
    isPowered: boolean;
    probedSkill: string | null;
    onProbeSkill: (pinCode: string, label: string | null) => void;
    onActivate: () => void;
    reducedMotion: boolean | null;
    className?: string;
}> = ({
    cat,
    idx,
    isActive,
    isPowered,
    probedSkill,
    onProbeSkill,
    onActivate,
    reducedMotion,
    className = '',
}) => {
    const Icon = cat.icon;
    const pinCountLabel = `${String(cat.skills.length).padStart(2, '0')}-PIN`;
    const activeBorderColor = isPowered
        ? isActive
            ? `${cat.accent}70`
            : 'rgba(63, 63, 70, 0.7)'
        : isActive
            ? 'rgba(251, 191, 36, 0.55)'
            : 'rgba(63, 63, 70, 0.85)';

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            onClick={onActivate}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onActivate();
                }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={isActive}
            aria-label={`${cat.designator} ${cat.title} module (${cat.skills.length} skills)`}
            className={`relative rounded-xl border overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}
                ${isPowered
                    ? 'bg-[#0a0b0e]/85 backdrop-blur-md hover:bg-[#0d1016]/90'
                    : 'bg-[#0b0b09]/90 hover:bg-[#10100d]/95'
                }`}
            style={{
                borderColor: activeBorderColor,
                boxShadow: isPowered && isActive ? cat.glowShadow : undefined,
            }}
        >
            {/* Subtle PCB micro-grid texture inside card */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                    backgroundImage:
                        'radial-gradient(rgba(161, 161, 170, 0.14) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
            />

            {/* Corner gold mounting pads */}
            <div aria-hidden="true" className="absolute top-2 left-2 z-10 pointer-events-none">
                <CornerViaPad isPowered={isPowered} isActive={isActive} accent={cat.accent} />
            </div>
            <div aria-hidden="true" className="absolute top-2 right-2 z-10 pointer-events-none">
                <CornerViaPad isPowered={isPowered} isActive={isActive} accent={cat.accent} />
            </div>
            <div aria-hidden="true" className="absolute bottom-2 left-2 z-10 pointer-events-none">
                <CornerViaPad isPowered={isPowered} isActive={isActive} accent={cat.accent} />
            </div>
            <div aria-hidden="true" className="absolute bottom-2 right-2 z-10 pointer-events-none">
                <CornerViaPad isPowered={isPowered} isActive={isActive} accent={cat.accent} />
            </div>

            {/* Ambient glow blob */}
            <div
                aria-hidden="true"
                className="absolute -right-14 -top-14 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
                style={{
                    backgroundColor: isPowered ? `${cat.accent}1f` : 'rgba(251, 191, 36, 0.08)',
                    opacity: isActive ? 1 : 0.35,
                }}
            />

            {/* Top DIP Pin Header Strip */}
            <div
                aria-hidden="true"
                className={`relative px-7 pt-2.5 pb-1.5 flex items-center justify-between border-b text-[10px] font-mono ${
                    isPowered ? 'border-zinc-800/80 bg-black/40' : 'border-zinc-800 bg-zinc-950/80'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider border"
                        style={{
                            color: isPowered ? cat.accent : '#fbbf24',
                            borderColor: isPowered ? `${cat.accent}45` : 'rgba(251,191,36,0.4)',
                            backgroundColor: isPowered ? `${cat.accent}14` : 'rgba(251,191,36,0.08)',
                        }}
                    >
                        {cat.designator}
                    </span>
                    <span className={isPowered ? 'text-zinc-300' : 'text-zinc-300'}>
                        {cat.busSpec}
                    </span>
                </div>

                {/* Miniature Brass/Gold Pin-Row Graphic */}
                <div className="hidden sm:flex items-center gap-1" title={`${pinCountLabel} header`}>
                    {cat.skills.map((_, pinIdx) => (
                        <span
                            key={pinIdx}
                            className="w-1.5 h-2.5 rounded-[1px] border transition-all duration-300"
                            style={{
                                borderColor: isActive
                                    ? isPowered
                                        ? cat.accent
                                        : '#fbbf24'
                                    : 'rgba(217, 179, 98, 0.45)',
                                backgroundColor: isActive
                                    ? isPowered
                                        ? `${cat.accent}55`
                                        : 'rgba(251,191,36,0.35)'
                                    : 'rgba(217, 179, 98, 0.16)',
                            }}
                        />
                    ))}
                    <span className="ml-1.5 text-[10px] text-zinc-300 tracking-wider">
                        {pinCountLabel}
                    </span>
                </div>
            </div>

            {/* IC Module Header */}
            <div className={`relative px-6 pt-4 pb-3.5 border-b ${isPowered ? 'border-zinc-800/70' : 'border-zinc-800/80'}`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                        <div
                            className="p-2.5 rounded-lg border shrink-0 transition-all duration-300"
                            style={{
                                borderColor: isPowered ? `${cat.accent}45` : 'rgba(251,191,36,0.35)',
                                backgroundColor: isPowered ? `${cat.accent}16` : 'rgba(39,39,42,0.85)',
                            }}
                        >
                            <Icon size={18} style={{ color: isPowered ? cat.accent : '#fbbf24' }} />
                        </div>
                        <div>
                            <p
                                className={`text-[11px] uppercase tracking-[0.18em] mb-0.5 font-mono ${
                                    isPowered ? cat.textClass : 'text-amber-400'
                                }`}
                            >
                                {cat.label}
                            </p>
                            <h3
                                className={`text-base md:text-lg font-bold tracking-tight leading-snug ${
                                    isPowered ? 'text-white' : 'text-zinc-100'
                                }`}
                            >
                                {cat.title}
                            </h3>
                        </div>
                    </div>

                    {/* Signal Status LED */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-1">
                        <span
                            className={`text-[10px] font-mono uppercase tracking-wider ${
                                isActive
                                    ? isPowered
                                        ? 'text-zinc-200'
                                        : 'text-amber-300'
                                    : 'text-zinc-400'
                            }`}
                        >
                            {isActive ? (isPowered ? 'LOCK' : 'STBY') : 'IDLE'}
                        </span>
                        {isPowered ? (
                            <motion.div
                                animate={
                                    isActive && !reducedMotion
                                        ? { opacity: [0.45, 1, 0.45], scale: [0.95, 1.15, 0.95] }
                                        : { opacity: isActive ? 1 : 0.35 }
                                }
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    backgroundColor: cat.accent,
                                    boxShadow: isActive ? `0 0 8px ${cat.accent}` : 'none',
                                }}
                            />
                        ) : (
                            <div
                                className={`w-2.5 h-2.5 rounded-full border ${
                                    isActive
                                        ? 'bg-amber-400 border-amber-300'
                                        : 'bg-zinc-800 border-zinc-600'
                                }`}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Pinout Matrix (Skill Chips) */}
            <div className="relative px-6 py-5 flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => {
                        const pinCode = `P${String(si + 1).padStart(2, '0')}`;
                        return (
                            <SkillChip
                                key={skill}
                                label={skill}
                                pinCode={pinCode}
                                badgeClass={cat.badgeClass}
                                activeChipClass={cat.activeChipClass}
                                accent={cat.accent}
                                delay={reducedMotion ? 0 : si * 0.03}
                                isPowered={isPowered}
                                isProbed={probedSkill === skill}
                                onProbe={(lbl) => onProbeSkill(pinCode, lbl)}
                            />
                        );
                    })}
                </div>

                {cat.note && (
                    <p
                        className={`mt-4 pt-3 border-t border-dashed text-xs font-mono tracking-wide flex items-center gap-2 ${
                            isPowered
                                ? 'border-zinc-800 text-zinc-300'
                                : 'border-zinc-800 text-zinc-300'
                        }`}
                    >
                        <span style={{ color: isPowered ? cat.accent : '#fbbf24' }}>//</span>
                        <span>{cat.note}</span>
                    </p>
                )}
            </div>

            {/* Bottom Energized Bus Trace Line */}
            <div
                aria-hidden="true"
                className="relative h-[2px] w-full overflow-hidden"
                style={{
                    backgroundColor: isPowered ? 'rgba(39,39,42,0.8)' : 'rgba(39,39,42,0.9)',
                }}
            >
                <div
                    className="h-full transition-all duration-500"
                    style={{
                        width: isActive ? '100%' : '28%',
                        background: isPowered
                            ? `linear-gradient(90deg, ${cat.accent}, transparent)`
                            : 'linear-gradient(90deg, #f59e0b, transparent)',
                        opacity: isActive ? 0.95 : 0.4,
                    }}
                />
            </div>
        </motion.div>
    );
};

/* ══ Main Component ══════════════════════════════════════ */
export const SkillBreadboard: React.FC<SkillBreadboardProps> = ({ isPowered }) => {
    const [activeId, setActiveId] = useState(CATEGORIES[0].id);
    const [probeTarget, setProbeTarget] = useState<{
        designator: string;
        pinCode: string;
        skill: string;
    } | null>(null);
    const reducedMotion = useReducedMotion();

    const activeCategory = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

    const handleProbeSkill = (designator: string, pinCode: string, skill: string | null) => {
        if (!skill) {
            setProbeTarget(null);
            return;
        }
        setProbeTarget({ designator, pinCode, skill });
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4">
            {/* Background ambient field tied to active bus */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 pointer-events-none flex justify-center overflow-hidden">
                <motion.div
                    animate={
                        isPowered && !reducedMotion
                            ? { opacity: [0.14, 0.26, 0.14] }
                            : { opacity: isPowered ? 0.18 : 0.08 }
                    }
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[75%] h-64 blur-3xl rounded-full"
                    style={{
                        background: isPowered
                            ? `radial-gradient(circle, ${activeCategory.accent}55 0%, transparent 70%)`
                            : 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Section heading with PCB silkscreen header */}
            <div className="relative mb-10 text-center">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border mb-4 font-mono text-[11px] uppercase tracking-[0.2em] bg-black/50 border-zinc-700/80">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: isPowered ? activeCategory.accent : '#fbbf24',
                            boxShadow: isPowered ? `0 0 8px ${activeCategory.accent}` : 'none',
                        }}
                    />
                    <span className={isPowered ? 'text-zinc-200' : 'text-amber-300'}>
                        PCB_MATRIX // U1–U5 · {TOTAL_PINS} PINOUTS
                    </span>
                    <span className="text-zinc-400 hidden sm:inline">
                        | {isPowered ? 'VCC +5.0V' : 'STBY +3.3V'}
                    </span>
                </div>

                <h2
                    className={`text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 ${
                        isPowered ? 'text-white' : 'text-zinc-200'
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Skills Engine
                </h2>
                <p
                    className={`text-sm md:text-base font-mono max-w-2xl mx-auto ${
                        isPowered ? 'text-zinc-300' : 'text-zinc-300'
                    }`}
                >
                    Domain expertise across hardware, firmware, power systems, software &amp; industrial protocols.
                </p>
            </div>

            {/* Live Logic-Probe Readout Strip */}
            <div
                className={`relative mb-5 px-4 py-2.5 rounded-lg border font-mono text-xs flex flex-wrap items-center justify-between gap-3 ${
                    isPowered
                        ? 'bg-[#090b0f]/90 border-zinc-800 text-zinc-200'
                        : 'bg-zinc-950/90 border-zinc-800 text-zinc-300'
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <Activity
                        size={14}
                        className="shrink-0"
                        style={{ color: isPowered ? activeCategory.accent : '#fbbf24' }}
                    />
                    <span className="text-zinc-400 uppercase tracking-wider shrink-0">
                        {probeTarget ? 'PROBE_LOCK:' : 'BUS_SEL:'}
                    </span>
                    {probeTarget ? (
                        <span className="truncate font-semibold text-white">
                            [{probeTarget.designator}.{probeTarget.pinCode}]{' '}
                            <span style={{ color: isPowered ? activeCategory.accent : '#fbbf24' }}>
                                {probeTarget.skill}
                            </span>
                        </span>
                    ) : (
                        <span className="truncate">
                            <span
                                className="font-bold"
                                style={{ color: isPowered ? activeCategory.accent : '#fbbf24' }}
                            >
                                {activeCategory.designator}
                            </span>{' '}
                            // {activeCategory.title} ({activeCategory.skills.length} pins)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 text-[11px] shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-zinc-300">
                        <Radio
                            size={12}
                            style={{ color: isPowered ? '#34d399' : '#fbbf24' }}
                        />
                        {isPowered ? 'SIGNAL: ENERGIZED' : 'SIGNAL: STANDBY'}
                    </span>
                </div>
            </div>

            {/* 5 Grouped IC-Bank Categories Grid - Bento balanced */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 items-stretch">
                {CATEGORIES.map((cat, idx) => (
                    <CategoryCard
                        key={cat.id}
                        cat={cat}
                        idx={idx}
                        isActive={cat.id === activeId}
                        isPowered={isPowered}
                        probedSkill={
                            probeTarget?.designator === cat.designator ? probeTarget.skill : null
                        }
                        onProbeSkill={(pinCode, skill) => handleProbeSkill(cat.designator, pinCode, skill)}
                        onActivate={() => setActiveId(cat.id)}
                        reducedMotion={reducedMotion}
                        className={idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                    />
                ))}
            </div>

            {/* Signal Bus Domain Selector Pills */}
            <div
                className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
                role="group"
                aria-label="Filter skill domain modules"
            >
                {CATEGORIES.map((cat) => {
                    const isActive = cat.id === activeId;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                                setActiveId(cat.id);
                                trackInteraction('skill_filter_click', 'skills', cat.title);
                            }}
                            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] border rounded-lg
                                inline-flex items-center gap-2 transition-all duration-200
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                                ${isActive
                                    ? ''
                                    : isPowered
                                        ? 'border-zinc-700/80 bg-black/40 text-zinc-300 hover:border-zinc-500 hover:text-white'
                                        : 'border-zinc-700/80 bg-zinc-950/70 text-zinc-300 hover:border-amber-400/60 hover:text-amber-300'
                                }`}
                            style={
                                isActive && isPowered
                                    ? {
                                          borderColor: `${cat.accent}80`,
                                          color: '#ffffff',
                                          backgroundColor: `${cat.accent}20`,
                                          boxShadow: `0 0 16px ${cat.accent}25`,
                                      }
                                    : isActive
                                        ? {
                                              borderColor: '#f59e0b',
                                              color: '#fbbf24',
                                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                                          }
                                        : {}
                            }
                            aria-label={`Filter to ${cat.title}`}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    backgroundColor: isPowered
                                        ? cat.accent
                                        : isActive
                                            ? '#fbbf24'
                                            : '#a1a1aa',
                                }}
                            />
                            <span className="font-bold opacity-85">{cat.designator}</span>
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
