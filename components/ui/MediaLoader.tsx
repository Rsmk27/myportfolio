import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const MediaLoader: React.FC<{ progress?: number }> = ({ progress }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            <div className="relative w-8 h-8 md:w-12 md:h-12">
                <motion.span
                    className="absolute inset-0 border-2 border-cyan-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                    className="absolute inset-2 border-2 border-cyan-300/50 rounded-full border-b-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                {progress !== undefined && (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono text-cyan-500">
                        {Math.round(progress)}%
                    </div>
                )}
            </div>
        </div>
    );
};
