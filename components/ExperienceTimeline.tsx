
import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '../types';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

interface ExperienceTimelineProps {
    experience: Experience[];
    isPowered: boolean;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experience, isPowered }) => {
    return (
        <div className="relative pl-8 md:pl-16 border-l-2 border-gray-800 ml-4 md:ml-10">
            {/* Bus Line Animation */}
            {isPowered && (
                <motion.div
                    className="absolute left-[-2px] top-0 w-[2px] bg-cyan-500 h-full origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.5, ease: "linear" }}
                />
            )}

            <div className="flex flex-col gap-12">
                {experience.map((exp, index) => (
                    <TimelineItem key={exp.id} data={exp} isPowered={isPowered} index={index} />
                ))}
            </div>
        </div>
    );
};

const TimelineItem: React.FC<{ data: Experience; isPowered: boolean; index: number }> = ({ data, isPowered, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative"
        >
            {/* Connector Node */}
            <div className={`absolute -left-[41px] md:-left-[73px] top-0 w-4 h-4 rounded-full border-2 bg-[#050505] transition-colors duration-500 z-10 ${isPowered ? 'border-cyan-500 shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'border-gray-700'}`}>
                {isPowered && (
                    <motion.div
                        className="w-full h-full bg-cyan-500 rounded-full"
                        initial={{ boxShadow: "0 0 0px rgba(6,182,212,0)" }}
                        whileInView={{ boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.8)", "0 0 10px rgba(6,182,212,0.5)"] }}
                        transition={{ duration: 1.5 }}
                        animate={{ scale: [0, 1, 0] }}
                    />
                )}
            </div>

            {/* Connection Trace */}
            <div className={`absolute -left-[35px] md:-left-[65px] top-2 w-[35px] md:w-[65px] h-[2px] transition-colors duration-500 ${isPowered ? 'bg-cyan-500/50' : 'bg-gray-800'}`}>
                {isPowered && (
                    <motion.div
                        className="absolute top-0 right-0 w-2 h-0.5 bg-cyan-400 blur-[1px]"
                        animate={{ right: ['100%', '0%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
                    />
                )}
            </div>

            {/* Content Card */}
            <div className={`relative p-6 border rounded-lg overflow-hidden transition-all duration-300 group hover:translate-x-2 ${isPowered ? 'bg-[#0b1213] border-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-[#0a0a0a] border-gray-900'}`}>
                {/* Tech corner accents */}
                {isPowered && (
                    <>
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-cyan-900/20" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/30" />
                    </>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                    <div>
                        <h3 className={`text-xl font-bold tracking-tight mb-1 ${isPowered ? 'text-white drop-shadow-sm' : 'text-gray-400'}`}>
                            {data.role}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-mono text-gray-500">
                            <Briefcase size={12} />
                            <span className={isPowered ? 'text-cyan-400' : ''}>{data.company}</span>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1 rounded border ${isPowered ? 'border-cyan-900/50 bg-cyan-950/20 text-cyan-400' : 'border-gray-800 bg-gray-900 text-gray-600'}`}>
                        <Calendar size={12} />
                        <span className="text-xs font-mono font-bold">{data.duration}</span>
                    </div>
                </div>

                <ul className="space-y-2 mb-6 relative z-10">
                    {data.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed font-light">
                            <ChevronRight size={14} className={`mt-1 flex-shrink-0 ${isPowered ? 'text-cyan-500' : 'text-gray-700'}`} />
                            <span>{desc}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-900/50 relative z-10">
                    {data.tech.map((tech) => (
                        <span key={tech} className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold border rounded transition-colors ${isPowered ? 'border-cyan-900/30 text-cyan-600 bg-cyan-950/10' : 'border-gray-800 text-gray-500'}`}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
