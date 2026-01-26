
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, Social } from '../types';
import { Mail, Github, Linkedin, Twitter, Send, Terminal, Wifi, Activity, Instagram } from 'lucide-react';

import { PROJECTS, SKILLS, EXPERIENCE } from '../constants';

interface ContactInterfaceProps {
    profile: Profile;
    isPowered: boolean;
}

export const ContactInterface: React.FC<ContactInterfaceProps> = ({ profile, isPowered }) => {
    const [consoleInput, setConsoleInput] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string, type: 'sys' | 'user' | 'success' | 'info' }>>([
        { text: '> INITIALIZING COMM_UPLINK...', type: 'sys' },
        { text: '> SECURE CHANNEL ESTABLISHED', type: 'sys' },
        { text: '> TYPE "HELP" FOR COMMAND_LIST', type: 'info' }

    ]);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const processCommand = (cmd: string) => {
        const lowerCmd = cmd.toLowerCase().trim();
        let response = '';
        let type: 'sys' | 'success' | 'info' = 'info';

        if (lowerCmd === 'help' || lowerCmd === 'commands') {
            response = 'AVAILABLE_COMMANDS: [ABOUT, PROJECTS, SKILLS, EXP, CONTACT, CLEAR]';
            type = 'sys';
        } else if (lowerCmd === 'clear') {
            setMessages([]);
            return;
        } else if (lowerCmd.includes('about') || lowerCmd.includes('who') || lowerCmd === 'bio') {
            response = profile.bio;
        } else if (lowerCmd.includes('project') || lowerCmd === 'work') {
            response = `LOADED_MODULES:\n${PROJECTS.map(p => `> ${p.title}`).join('\n')}`;
        } else if (lowerCmd.includes('skill') || lowerCmd === 'stack') {
            response = `ACTIVE_PROTOCOLS:\n${SKILLS.map(s => `> ${s.name} (${s.level}%)`).join('\n')}`;
        } else if (lowerCmd.includes('exp') || lowerCmd.includes('job') || lowerCmd === 'history') {
            response = `CAREER_LOGS:\n${EXPERIENCE.map(e => `> ${e.role} @ ${e.company}`).join('\n')}`;
        } else if (lowerCmd.includes('contact') || lowerCmd.includes('mail') || lowerCmd.includes('social')) {
            response = `Please use the "Primary Channel" or "Social Uplinks" panel on the left to establish connection.`;
        } else if (['hi', 'hello', 'hey'].some(g => lowerCmd.includes(g))) {
            response = `GREETINGS USER. I AM TERM_V2.0. HOW MAY I ASSIST?`;
        } else {
            response = `ERR_UNKNOWN_CMD: "${cmd}". TYPE "HELP" FOR MANUAL.`;
            type = 'sys';
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: response, type }]);
            setIsSending(false);
        }, 500);
    };

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consoleInput.trim() || isSending) return;

        const cmd = consoleInput;
        setConsoleInput('');
        setMessages(prev => [...prev, { text: `> ${cmd}`, type: 'user' }]);
        setIsSending(true);

        processCommand(cmd);
    };

    const getIcon = (platform: Social['platform']) => {
        switch (platform) {
            case 'github': return Github;
            case 'linkedin': return Linkedin;
            case 'twitter': return Twitter;
            case 'x': return Twitter; // Using Twitter icon for X
            case 'instagram': return Instagram;
            case 'telegram': return Send;
            case 'email': return Mail;
            default: return Mail;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Social Links Panel */}
            <div className="space-y-6">
                <div className="flex justify-between items-end pb-2 border-b border-gray-800">
                    <div>
                        <h3 className={`text-xs font-mono tracking-[0.2em] mb-1 ${isPowered ? 'text-cyan-400' : 'text-gray-600'}`}>
                            // FREQUENCY_MODULATION
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>SIGNAL_STRENGTH</span>
                            <div className="flex gap-0.5 items-end h-4">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`w-1 rounded-sm ${isPowered ? 'bg-cyan-500' : 'bg-gray-800'}`}
                                        animate={isPowered ? {
                                            height: [4, Math.random() * 12 + 4, 4],
                                            opacity: [0.5, 1, 0.5]
                                        } : { height: 4 }}
                                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <Wifi size={18} className={isPowered ? 'text-cyan-500 animate-pulse' : 'text-gray-800'} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ContactCard
                        href={`mailto:${profile.email}`}
                        icon={Mail}
                        label="PRIMARY_CHANNEL"
                        value={profile.email}
                        isPowered={isPowered}
                    />

                    {profile.socials.filter(s => s.platform !== 'email').map((social) => {
                        const Icon = getIcon(social.platform);
                        let handle = social.url;
                        if (social.platform === 'linkedin') handle = 'LinkedIn Profile';
                        else if (social.platform === 'github') handle = 'GitHub Profile';
                        else if (social.platform === 'instagram') handle = 'Instagram';
                        else if (social.platform === 'telegram') handle = 'Telegram';
                        else if (social.platform === 'x') handle = 'X (Twitter)';
                        else handle = social.url.replace(/^https?:\/\//, '');

                        return (
                            <ContactCard
                                key={social.platform}
                                href={social.url}
                                icon={Icon}
                                label={`${social.platform}_UPLINK`}
                                value={handle}
                                isPowered={isPowered}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Interactive Console */}
            <div className={`relative rounded-lg overflow-hidden border transition-all duration-500 flex flex-col h-[400px] ${isPowered ? 'border-cyan-900/50 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'border-gray-900 bg-[#050505]'}`}>
                {/* CRT Screen Effect */}
                {isPowered && <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]" />}

                {/* Header */}
                <div className={`px-4 py-2 border-b flex justify-between items-center ${isPowered ? 'bg-cyan-950/20 border-cyan-900/30' : 'bg-[#111] border-gray-800'}`}>
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className={isPowered ? 'text-cyan-400' : 'text-gray-600'} />
                        <span className={`text-xs font-mono font-bold ${isPowered ? 'text-cyan-500' : 'text-gray-600'}`}>TERM_V2.0 // REMOTE_ACCESS</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500' : 'bg-gray-800'}`} />
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-amber-500' : 'bg-gray-800'}`} />
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                    </div>
                </div>

                {/* Terminal Window */}
                <div ref={scrollRef} className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 relative z-10 scrollbar-hide">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`whitespace-pre-wrap ${msg.type === 'user' ? 'text-white' :
                                msg.type === 'success' ? 'text-emerald-400' :
                                    msg.type === 'info' ? 'text-cyan-400' :
                                        'text-cyan-600'
                                }`}
                        >
                            <span className="opacity-50 mr-2">
                                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.text}
                        </motion.div>
                    ))}
                    {isSending && (
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-cyan-500"
                        >
                            _
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleCommand} className={`p-3 border-t relative z-30 ${isPowered ? 'border-cyan-900/30 bg-cyan-950/10' : 'border-gray-800'}`}>
                    <div className="flex items-center gap-2">
                        <span className={`${isPowered ? 'text-green-500' : 'text-gray-600'}`}>➜</span>
                        <input
                            type="text"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            placeholder={isPowered ? "Enter message sequence..." : "TERMINAL OFFLINE"}
                            disabled={!isPowered || isSending}
                            className={`flex-1 bg-transparent border-none outline-none font-mono text-sm ${isPowered ? 'text-cyan-100 placeholder-cyan-900/50' : 'text-gray-600 placeholder-gray-800'}`}
                            autoComplete="off"
                        />
                        <button
                            disabled={!isPowered || isSending}
                            className={`p-1.5 rounded transition-all ${isPowered ? 'text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-200' : 'text-gray-700'}`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContactCard: React.FC<{ href: string; icon: any; label: string; value: string; isPowered: boolean }> = ({ href, icon: Icon, label, value, isPowered }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative overflow-hidden flex items-center gap-4 p-4 border rounded-xl transition-all duration-300 ${isPowered
            ? 'bg-[#0a0a0a] border-gray-800 hover:border-cyan-500/50'
            : 'bg-black border-gray-900'
            }`}
    >
        {isPowered && (
            <>
                <div className="absolute inset-0 bg-transparent group-hover:bg-cyan-950/10 transition-colors duration-300" />
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-500"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                />
            </>
        )}

        <div className={`relative z-10 p-2.5 rounded-lg transition-colors ${isPowered
            ? 'bg-gray-900 text-cyan-400 group-hover:text-cyan-300 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]'
            : 'bg-gray-900 text-gray-600'
            }`}>
            <Icon size={22} />
        </div>

        <div className="flex-1 relative z-10">
            <div className="flex justify-between items-center mb-0.5">
                <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">{label}</p>
                {isPowered && <Activity size={10} className="text-cyan-500/50 group-hover:animate-pulse" />}
            </div>
            <p className={`font-bold transition-colors ${isPowered ? 'text-gray-200 group-hover:text-white' : 'text-gray-600'}`}>
                {value}
            </p>
        </div>
    </a>
);
