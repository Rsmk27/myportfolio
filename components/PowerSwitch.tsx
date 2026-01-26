
import React from 'react';
import { motion } from 'framer-motion';

interface PowerSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={onToggle}
        className="relative w-24 h-40 bg-[#1a1a1a] rounded-lg cursor-pointer border-4 border-[#333] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center p-2"
      >
        <motion.div
          animate={{ y: isOn ? -30 : 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-16 h-20 rounded-md shadow-2xl relative flex flex-col items-center justify-center ${
            isOn 
            ? 'bg-gradient-to-b from-[#444] to-[#222]' 
            : 'bg-gradient-to-t from-[#444] to-[#222]'
          }`}
        >
          {/* Decorative switch face */}
          <div className="absolute inset-1 border border-[#ffffff10] rounded pointer-events-none" />
          <div className={`w-3 h-3 rounded-full mb-2 ${isOn ? 'bg-cyan-500 shadow-[0_0_10px_#00f2ff]' : 'bg-red-900'}`} />
          <span className="text-[10px] text-gray-500 font-bold uppercase select-none">
            {isOn ? 'ON' : 'OFF'}
          </span>
        </motion.div>
      </div>
      <div className="flex flex-col items-center">
        <p className={`text-xs font-bold transition-colors duration-500 ${isOn ? 'text-cyan-400' : 'text-gray-600'}`}>
          MAIN_POWER_BUS
        </p>
        <div className={`h-1 w-24 mt-1 transition-all duration-500 ${isOn ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-gray-800'}`} />
      </div>
    </div>
  );
};
