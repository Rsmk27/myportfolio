import React from 'react';
import { motion } from 'framer-motion';
import { Experience, Education } from '../types';
import { Calendar, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

interface TimelineSystemProps {
    experience: Experience[];
    education: Education[];
    isPowered: boolean;
}

export const TimelineSystem: React.FC<TimelineSystemProps> = ({ experience, education, isPowered }) => {
    // Sort logic
    const getYear = (dateStr: string) => {
        const match = dateStr.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
    };

    const combined = [
        ...experience.map(e => ({ type: 'exp', data: e, year: getYear(e.duration) })),
        ...education.map(e => ({ type: 'edu', data: e, year: getYear(e.year) }))
    ].sort((a, b) => b.year - a.year);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4">
            
            {/* Header: SYSTEM TIMELINE on the top right */}
            <div className="flex justify-between items-start mb-16 border-b border-gray-900 pb-4">
                <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest self-end">
                    // SYSTEM LOGS
                </span>
                <h2 
                    className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white flex flex-col items-end"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <span>SYSTEM <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">TIMELINE</span></span>
                </h2>
            </div>

            {/* Timeline wrapper */}
            <div className="relative pl-8 md:pl-16">
                
                {/* Vertical Blue Laser Timeline Line */}
                <div 
                    className={`absolute left-0 top-2 bottom-2 w-[2px] transition-all duration-500
                        ${isPowered 
                            ? 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]' 
                            : 'bg-gray-800'
                        }`} 
                />

                {/* Timeline entries */}
                <div className="space-y-12 relative">
                    {combined.map((item, index) => {
                        const isExp = item.type === 'exp';
                        const expData = item.data as Experience;
                        const eduData = item.data as Education;

                        return (
                            <div key={index} className="relative group">
                                
                                {/* Orbital Timeline Node */}
                                <div className="absolute -left-8 md:-left-16 w-8 md:w-12 h-12 -translate-x-1/2 -translate-y-1.5 flex items-center justify-center z-10">
                                    {isPowered ? (
                                        <>
                                            {/* Concentric spinning rings */}
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                                className="absolute w-7 h-7 rounded-full border border-cyan-500/20"
                                            />
                                            <motion.div 
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                className="absolute w-5 h-5 rounded-full border border-dashed border-cyan-500/40"
                                            />
                                            {/* Glowing core */}
                                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff] relative">
                                                <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/60" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
                                    )}
                                </div>

                                {/* Connecting Wires (Horizontal connection line) */}
                                <div 
                                    className={`absolute -left-4 md:-left-10 top-4 w-4 md:w-10 h-[1px] transition-all duration-500
                                        ${isPowered 
                                            ? 'bg-cyan-500/40' 
                                            : 'bg-gray-800'
                                        }`} 
                                />

                                {/* Card Block */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.45, delay: index * 0.08 }}
                                    className={`relative rounded-xl border p-6 md:p-8 backdrop-blur-sm transition-all duration-500
                                        ${isPowered
                                            ? 'bg-black/40 border-gray-900 hover:border-cyan-500/30 hover:bg-cyan-950/5'
                                            : 'bg-white/5 border-gray-200'
                                        }`}
                                >
                                    {/* Tech details corner ornaments */}
                                    {isPowered && (
                                        <>
                                            <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-cyan-500/40 rounded-tr-sm" />
                                            <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-cyan-500/40 rounded-bl-sm" />
                                        </>
                                    )}

                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-lg border transition-colors
                                                ${isPowered 
                                                    ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400' 
                                                    : 'bg-gray-100 border-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {isExp ? <Briefcase size={16} strokeWidth={1.5} /> : <GraduationCap size={16} strokeWidth={1.5} />}
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-black tracking-tight leading-tight ${isPowered ? 'text-white' : 'text-gray-900'}`}>
                                                    {isExp ? expData.role : eduData.degree}
                                                </h4>
                                                <p className={`text-xs font-mono uppercase mt-0.5 tracking-wider ${isPowered ? 'text-cyan-500/80' : 'text-blue-600'}`}>
                                                    {isExp ? `at ${expData.company}` : `at ${eduData.institution}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold w-fit
                                            ${isPowered 
                                                ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-300' 
                                                : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}
                                        >
                                            <Calendar size={12} strokeWidth={2} />
                                            <span>{isExp ? expData.duration : eduData.year}</span>
                                        </div>
                                    </div>

                                    {/* Focus / Core Concepts (Description line or bullets) */}
                                    {isExp ? (
                                        expData.description && (
                                            <ul className="space-y-3 mb-6 pl-1">
                                                {expData.description.map((bullet, bi) => (
                                                    <li key={bi} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-400">
                                                        <ChevronRight size={14} className="mt-1 shrink-0 text-cyan-500/80" />
                                                        <span>
                                                            {bullet.split(' ').map((word, wi) => {
                                                                // Highlight key words (e.g. numbers, specific technologies)
                                                                const isHighlight = /^(11kV|440V|thermodynamic|turbine|efficiency|steam|power|transformers|insulation|motors|ISO|50001|dewatering|solar|agricultural)$/i.test(word.replace(/[,.]/g, ''));
                                                                return (
                                                                    <span key={wi} className={isHighlight && isPowered ? 'text-cyan-300 font-semibold' : ''}>
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
                                        <p className="text-sm leading-relaxed text-gray-400 pl-1 mb-2">
                                            Foundational studies in{' '}
                                            <span className={isPowered ? 'text-cyan-300 font-semibold' : 'text-gray-800'}>electrical principles</span>{' '}
                                            and{' '}
                                            <span className={isPowered ? 'text-cyan-300 font-semibold' : 'text-gray-800'}>practical applications</span>.
                                        </p>
                                    )}

                                    {/* Tech Tags for Experience */}
                                    {isExp && expData.tech && (
                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-gray-900">
                                            {expData.tech.map(t => (
                                                <span 
                                                    key={t} 
                                                    className={`text-[10px] px-2.5 py-1 rounded font-mono uppercase border tracking-wider
                                                        ${isPowered 
                                                            ? 'bg-cyan-950/10 border-cyan-900/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.02)]' 
                                                            : 'bg-gray-100 border-gray-200 text-gray-600'
                                                        }`}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                </motion.div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
