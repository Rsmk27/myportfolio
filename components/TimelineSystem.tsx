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
    // Combine and sort entries - simplistic approach for now, or just alternating sections
    // Since dates can be complex strings ("NOV 2023 - MAY 2024"), exact sorting is hard without parsing.
    // We will render them in two "Tracks" or a unified list if we can map years.
    // Let's render them as a "System Log" unified timeline.

    // Helper to extract year for sorting (rough approximation)
    const getYear = (dateStr: string) => {
        const match = dateStr.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
    };

    const combined = [
        ...experience.map(e => ({ type: 'exp', data: e, year: getYear(e.duration) })),
        ...education.map(e => ({ type: 'edu', data: e, year: getYear(e.year) }))
    ].sort((a, b) => b.year - a.year);

    return (
        <div className="relative max-w-5xl mx-auto p-4">
            {/* Central Timeline Line via Gradient */}
            <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2 transition-colors duration-500 ${isPowered ? 'bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0' : 'bg-gray-800'}`} />

            <div className="space-y-12">
                {combined.map((item, index) => {
                    const isExp = item.type === 'exp';
                    const expData = item.data as Experience;
                    const eduData = item.data as Education;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-8 items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Timeline Node */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-1.5 z-10">
                                <div className={`w-full h-full rounded-full border-2 transition-all duration-500 ${isPowered ? 'bg-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-900 border-gray-700'}`}>
                                    {isPowered && <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500/30" />}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="w-full md:w-[calc(50%-2rem)] ml-12 md:ml-0">
                                <div className={`relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 group
                                    ${isPowered
                                        ? 'bg-black/40 border-cyan-900/30 hover:border-cyan-500/50 hover:bg-cyan-950/10'
                                        : 'bg-gray-900/10 border-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    {/* Decor corners */}
                                    {isPowered && (
                                        <>
                                            <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyan-500/50" />
                                            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-cyan-500/50" />
                                        </>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${isPowered ? 'bg-cyan-500/10 text-cyan-400' : 'bg-gray-800 text-gray-500'}`}>
                                                {isExp ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                            </div>
                                            <span className={`text-[10px] font-mono tracking-wider uppercase ${isPowered ? 'text-cyan-600' : 'text-gray-600'}`}>
                                                {isExp ? 'SYS_LOG: WORK' : 'SYS_LOG: ACADEMIC'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Calendar size={12} />
                                            {isExp ? expData.duration : eduData.year}
                                        </div>
                                    </div>

                                    {/* Main Info */}
                                    <h3 className={`text-xl font-bold mb-1 ${isPowered ? 'text-white' : 'text-gray-800'}`}>
                                        {isExp ? expData.role : eduData.degree}
                                    </h3>
                                    <h4 className={`text-sm font-mono mb-4 ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {isExp ? `@ ${expData.company}` : `@ ${eduData.institution}`}
                                    </h4>

                                    {/* Description / List */}
                                    {isExp && expData.description && (
                                        <ul className="space-y-2 mb-4">
                                            {expData.description.slice(0, 3).map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                    <ChevronRight size={14} className={`mt-0.5 shrink-0 ${isPowered ? 'text-cyan-500' : 'text-gray-700'}`} />
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Tech Tags for Experience */}
                                    {isExp && expData.tech && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-gray-800">
                                            {expData.tech.map(t => (
                                                <span key={t} className={`text-[10px] px-2 py-1 rounded font-mono ${isPowered ? 'bg-cyan-950/30 text-cyan-300 border border-cyan-900/30' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
