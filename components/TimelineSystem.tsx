import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Experience, Education } from '../types';
import { Calendar, Briefcase, GraduationCap, ChevronRight, Activity } from 'lucide-react';
import { EXPERIENCE, EDUCATION } from '../constants';

interface TimelineSystemProps {
    experience?: Experience[];
    education?: Education[];
    isPowered: boolean;
}

const HIGHLIGHT_TERM_RE =
    /^(11kV|11kV\/440V|440V|thermodynamic|turbine|efficiency|steam|power|transformers|insulation|motors|three-phase|induction|distribution|diagnostic|ISO|50001|dewatering|solar|agricultural)$/i;

export const TimelineSystem: React.FC<TimelineSystemProps> = ({
    experience = EXPERIENCE,
    education = EDUCATION,
    isPowered,
}) => {
    const reducedMotion = useReducedMotion();

    // Sort chronologically (most recent year first)
    const combined = useMemo(() => {
        const getYear = (dateStr: string) => {
            const match = dateStr.match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        };

        return [
            ...experience.map((e) => ({ type: 'exp' as const, data: e, year: getYear(e.duration) })),
            ...education.map((e) => ({ type: 'edu' as const, data: e, year: getYear(e.year) })),
        ].sort((a, b) => b.year - a.year);
    }, [experience, education]);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4">
            {/* Logic-Analyzer Bus Header Bar (h3 preserves h2 -> h3 -> h4 hierarchy) */}
            <div
                className={`mb-10 rounded-xl border px-4 py-3.5 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono ${
                    isPowered
                        ? 'bg-[#090b0f]/90 border-cyan-500/25 shadow-[0_0_24px_rgba(6,182,212,0.08)]'
                        : 'bg-zinc-950/90 border-zinc-800'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-lg border shrink-0 ${
                            isPowered
                                ? 'bg-cyan-950/40 border-cyan-500/35 text-cyan-300'
                                : 'bg-zinc-900 border-amber-500/35 text-amber-400'
                        }`}
                    >
                        <Activity size={16} strokeWidth={2} />
                    </div>
                    <div>
                        <p
                            className={`text-[10px] uppercase tracking-[0.22em] ${
                                isPowered ? 'text-cyan-400' : 'text-amber-400'
                            }`}
                        >
                            LOGIC_BUS // TRACE_LOG
                        </p>
                        <h3
                            className={`text-sm md:text-base font-bold tracking-tight ${
                                isPowered ? 'text-white' : 'text-zinc-200'
                            }`}
                        >
                            Chronological Signal Trace
                        </h3>
                    </div>
                </div>

                {/* Channel Legend & Capture State */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                            isPowered
                                ? 'bg-cyan-950/35 border-cyan-500/30 text-cyan-200'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isPowered ? '#22d3ee' : '#fbbf24' }}
                        />
                        CH0: EXP
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                            isPowered
                                ? 'bg-emerald-950/35 border-emerald-500/30 text-emerald-200'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isPowered ? '#34d399' : '#a1a1aa' }}
                        />
                        CH1: EDU
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                            isPowered
                                ? 'bg-black/60 border-zinc-700 text-zinc-200'
                                : 'bg-zinc-900 border-amber-500/35 text-amber-300'
                        }`}
                    >
                        {combined.length} NODES · {isPowered ? 'LIVE' : 'STANDBY'}
                    </span>
                </div>
            </div>

            {/* Timeline PCB-Bus Wrapper */}
            <div className="relative pl-8 md:pl-16">
                {/* Main Vertical Differential PCB Bus Conduit */}
                <div
                    aria-hidden="true"
                    className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-500 ${
                        isPowered
                            ? 'bg-gradient-to-b from-cyan-400 via-sky-500/80 to-emerald-400/70 shadow-[0_0_14px_rgba(34,211,238,0.45)]'
                            : 'bg-gradient-to-b from-amber-500/60 via-zinc-700 to-zinc-800'
                    }`}
                />

                {/* Top & Bottom Bus Termination Pads */}
                <div
                    aria-hidden="true"
                    className={`absolute -left-[4px] top-1 w-2.5 h-2.5 rounded-full border ${
                        isPowered
                            ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_8px_#22d3ee]'
                            : 'bg-amber-400 border-amber-300'
                    }`}
                />
                <div
                    aria-hidden="true"
                    className={`absolute -left-[4px] bottom-1 w-2.5 h-2.5 rounded-full border ${
                        isPowered
                            ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#34d399]'
                            : 'bg-zinc-700 border-zinc-500'
                    }`}
                />

                {/* Timeline Milestone Entries */}
                <div className="space-y-10 relative">
                    {combined.map((item, index) => {
                        const isExp = item.type === 'exp';
                        const expData = item.data as Experience;
                        const eduData = item.data as Education;
                        const channelAccent = isPowered
                            ? isExp
                                ? '#22d3ee'
                                : '#34d399'
                            : isExp
                                ? '#fbbf24'
                                : '#d4d4d8';
                        const nodeCode = `${isExp ? 'CH0' : 'CH1'} // N${String(index + 1).padStart(2, '0')}`;

                        return (
                            <div key={item.data.id ?? index} className="relative group">
                                {/* PCB Node Fiducial Target */}
                                <div
                                    aria-hidden="true"
                                    className="absolute -left-8 md:-left-16 w-8 md:w-12 h-12 -translate-x-1/2 top-4 flex items-center justify-center z-10"
                                >
                                    {isPowered ? (
                                        <>
                                            <div
                                                className={`absolute w-8 h-8 rounded-full border ${
                                                    reducedMotion ? '' : 'animate-[spin_8s_linear_infinite]'
                                                }`}
                                                style={{ borderColor: `${channelAccent}35` }}
                                            />
                                            <div
                                                className={`absolute w-5 h-5 rounded-full border border-dashed ${
                                                    reducedMotion ? '' : 'animate-spin-reverse'
                                                }`}
                                                style={{ borderColor: `${channelAccent}75` }}
                                            />
                                            <div
                                                className="w-2.5 h-2.5 rounded-full relative"
                                                style={{
                                                    backgroundColor: channelAccent,
                                                    boxShadow: `0 0 10px ${channelAccent}`,
                                                }}
                                            >
                                                {!reducedMotion && (
                                                    <div
                                                        className="absolute inset-0 rounded-full animate-ping opacity-55"
                                                        style={{ backgroundColor: channelAccent }}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-amber-500/40 bg-zinc-950">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: channelAccent }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Horizontal Trace Conduit & Solder Edge Pad */}
                                <div
                                    aria-hidden="true"
                                    className="absolute -left-4 md:-left-10 top-[39px] w-4 md:w-10 flex items-center pointer-events-none"
                                >
                                    <div
                                        className="w-full h-[2px] transition-all duration-300"
                                        style={{
                                            background: isPowered
                                                ? `linear-gradient(90deg, ${channelAccent}75, ${channelAccent})`
                                                : 'rgba(217, 179, 98, 0.45)',
                                        }}
                                    />
                                    <span
                                        className="w-1.5 h-3 rounded-l-[1px] shrink-0"
                                        style={{
                                            backgroundColor: isPowered ? channelAccent : '#fbbf24',
                                        }}
                                    />
                                </div>

                                {/* Milestone Dossier Card */}
                                <motion.div
                                    initial={reducedMotion ? false : { opacity: 0, x: 18 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.4, delay: index * 0.07 }}
                                    className={`relative rounded-xl border overflow-hidden backdrop-blur-sm transition-all duration-300 ${
                                        isPowered
                                            ? 'bg-[#0a0b0f]/85 border-zinc-800 hover:border-cyan-500/45 shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
                                            : 'bg-[#0b0b09]/92 border-zinc-800 hover:border-amber-500/45'
                                    }`}
                                >
                                    {/* Top Specular Rim Accent */}
                                    <div
                                        aria-hidden="true"
                                        className="h-[2px] w-full"
                                        style={{
                                            background: isPowered
                                                ? `linear-gradient(90deg, ${channelAccent}, rgba(56,189,248,0.25), transparent)`
                                                : 'linear-gradient(90deg, #f59e0b, rgba(161,161,170,0.2), transparent)',
                                        }}
                                    />

                                    {/* Corner Fiducial Marks */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-2.5 right-3 text-[10px] font-mono text-zinc-400 select-none"
                                    >
                                        +
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-400 select-none"
                                    >
                                        +
                                    </span>

                                    <div className="p-5 sm:p-6 md:p-7">
                                        {/* Telemetry Metadata Strip + Date Badge */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-3 border-b border-zinc-800/80">
                                            <div className="flex items-center gap-2 font-mono text-[11px]">
                                                <span
                                                    className="px-2 py-0.5 rounded border font-bold tracking-wider"
                                                    style={{
                                                        color: channelAccent,
                                                        borderColor: isPowered
                                                            ? `${channelAccent}45`
                                                            : 'rgba(251,191,36,0.4)',
                                                        backgroundColor: isPowered
                                                            ? `${channelAccent}14`
                                                            : 'rgba(251,191,36,0.08)',
                                                    }}
                                                >
                                                    {nodeCode}
                                                </span>
                                                <span className="uppercase tracking-[0.16em] text-zinc-300">
                                                    {isExp ? 'Industrial Fieldwork' : 'Academic Foundation'}
                                                </span>
                                            </div>

                                            {/* Telemetry Date Badge */}
                                            <div
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono font-bold ${
                                                    isPowered
                                                        ? isExp
                                                            ? 'bg-cyan-950/45 border-cyan-500/35 text-cyan-200'
                                                            : 'bg-emerald-950/45 border-emerald-500/35 text-emerald-200'
                                                        : 'bg-zinc-900 border-amber-500/40 text-amber-300'
                                                }`}
                                            >
                                                <Calendar size={12} strokeWidth={2} />
                                                <span>{isExp ? expData.duration : eduData.year}</span>
                                            </div>
                                        </div>

                                        {/* Role / Degree Header (h4 preserved for test contract) */}
                                        <div className="flex items-start gap-3.5 mb-5">
                                            <div
                                                className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                                                    isPowered
                                                        ? isExp
                                                            ? 'bg-cyan-950/40 border-cyan-500/35 text-cyan-300'
                                                            : 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300'
                                                        : 'bg-zinc-900 border-amber-500/35 text-amber-400'
                                                }`}
                                            >
                                                {isExp ? (
                                                    <Briefcase size={18} strokeWidth={1.75} />
                                                ) : (
                                                    <GraduationCap size={18} strokeWidth={1.75} />
                                                )}
                                            </div>
                                            <div>
                                                <h4
                                                    className={`text-lg md:text-xl font-black tracking-tight leading-snug ${
                                                        isPowered ? 'text-white' : 'text-zinc-100'
                                                    }`}
                                                >
                                                    {isExp ? expData.role : eduData.degree}
                                                </h4>
                                                <p
                                                    className={`text-xs md:text-sm font-mono uppercase mt-1 tracking-wider ${
                                                        isPowered
                                                            ? isExp
                                                                ? 'text-cyan-300'
                                                                : 'text-emerald-300'
                                                            : 'text-amber-400'
                                                    }`}
                                                >
                                                    {isExp ? `at ${expData.company}` : `at ${eduData.institution}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Engineering Telemetry Bullets or Academic Summary */}
                                        {isExp ? (
                                            expData.description && (
                                                <ul className="space-y-2.5 mb-5 pl-0.5">
                                                    {expData.description.map((bullet, bi) => (
                                                        <li
                                                            key={bi}
                                                            className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
                                                        >
                                                            <ChevronRight
                                                                size={15}
                                                                className={`mt-1 shrink-0 ${
                                                                    isPowered ? 'text-cyan-400' : 'text-amber-400'
                                                                }`}
                                                            />
                                                            <span>
                                                                {bullet.split(' ').map((word, wi) => {
                                                                    const cleanWord = word.replace(/[,.]/g, '');
                                                                    const isHighlight = HIGHLIGHT_TERM_RE.test(cleanWord);
                                                                    return (
                                                                        <span
                                                                            key={wi}
                                                                            className={
                                                                                isHighlight
                                                                                    ? isPowered
                                                                                        ? 'text-cyan-300 font-semibold'
                                                                                        : 'text-amber-300 font-semibold'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            {word}{' '}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )
                                        ) : (
                                            <p className="text-sm leading-relaxed text-zinc-300 pl-0.5 mb-1">
                                                Core curriculum in{' '}
                                                <span
                                                    className={
                                                        isPowered
                                                            ? 'text-emerald-300 font-semibold'
                                                            : 'text-amber-300 font-semibold'
                                                    }
                                                >
                                                    electrical machines, power networks &amp; embedded systems
                                                </span>{' '}
                                                paired with{' '}
                                                <span
                                                    className={
                                                        isPowered
                                                            ? 'text-emerald-300 font-semibold'
                                                            : 'text-amber-300 font-semibold'
                                                    }
                                                >
                                                    hands-on laboratory instrumentation
                                                </span>
                                                .
                                            </p>
                                        )}

                                        {/* Signal / Tech Pin Tags */}
                                        {isExp && expData.tech && (
                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-800">
                                                {expData.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md font-mono uppercase border tracking-wider ${
                                                            isPowered
                                                                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                                                                : 'bg-zinc-900/95 border-zinc-700 text-amber-300'
                                                        }`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="w-1.5 h-1.5 rounded-full"
                                                            style={{
                                                                backgroundColor: isPowered ? '#22d3ee' : '#fbbf24',
                                                            }}
                                                        />
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
