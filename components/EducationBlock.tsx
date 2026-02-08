
import React from 'react';
import { motion } from 'framer-motion';
import { Education } from '../types';
import { GraduationCap, Award } from 'lucide-react';

interface EducationBlockProps {
    education: Education[];
    isPowered: boolean;
}

export const EducationBlock: React.FC<EducationBlockProps> = ({ education, isPowered }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
                <EduCard key={edu.id} data={edu} isPowered={isPowered} index={index} />
            ))}
        </div>
    );
};

const EduCard: React.FC<{ data: Education; isPowered: boolean; index: number }> = ({ data, isPowered, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={`relative p-6 border rounded-xl overflow-hidden group ${isPowered ? 'bg-[#0a0a0a] border-gray-800' : 'bg-black border-gray-900'
            }`}
    >
        {/* Background Pattern */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isPowered ? 'opacity-[0.08]' : 'opacity-[0.02]'}`}
            style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}
        />

        {/* Chip Contacts */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 flex justify-between">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-b-sm transition-colors ${isPowered ? 'bg-cyan-900' : 'bg-gray-900'}`} />
            ))}
        </div>

        <div className="relative z-10 flex items-start gap-4">
            <div className={`p-3 rounded-lg flex items-center justify-center transition-all duration-500 ${isPowered ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50' : 'bg-gray-900 text-gray-700'}`}>
                <GraduationCap size={24} />
            </div>

            <div className="flex-1">
                <h4 className={`text-lg font-bold mb-1 tracking-tight ${isPowered ? 'text-gray-100' : 'text-gray-500'}`}>
                    {data.degree}
                </h4>
                <p className={`text-sm font-mono mb-2 transition-colors ${isPowered ? 'text-cyan-600/80' : 'text-gray-600'}`}>
                    {data.institution}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <Award size={12} className={isPowered ? 'text-amber-500' : 'text-gray-700'} />
                        <span className={`text-[10px] font-bold tracking-widest ${isPowered ? 'text-gray-400' : 'text-gray-800'}`}>
                            {data.year}
                        </span>
                    </div>
                    {isPowered && (
                        <div className="flex gap-0.5">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 h-1 bg-cyan-500 rounded-full"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Hover Effect - Scanning Line */}
        {isPowered && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        )}

        <div className={`absolute bottom-0 right-0 px-2 py-1 text-[8px] font-mono ${isPowered ? 'text-gray-700' : 'text-gray-900'}`}>
            Year: {data.year}
        </div>
    </motion.div>
);
