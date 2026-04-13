import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Profile, Social } from '../types';
import { Mail, Github, Linkedin, Twitter, Send, Terminal, Wifi, Activity, Instagram, RefreshCw } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_API_URL     = 'https://rsmk27-rsmk-chatbot-api.hf.space/chat';
const USAGE_KEY      = 'rsmk_chat_usage';
const MAX_MSGS       = 20;
const MAX_ATTEMPTS   = 3;
const RETRY_DELAY_MS = 6000;

function getCount(): number {
    return parseInt(sessionStorage.getItem(USAGE_KEY) ?? '0', 10);
}
function saveCount(n: number): void {
    sessionStorage.setItem(USAGE_KEY, String(n));
}

// ─── Lightweight Markdown Renderer ───────────────────────────────────────────

/**
 * Renders a markdown string into React nodes.
 * Handles: headers, bold, italic, inline code, code blocks,
 * bullet lists, numbered lists, blockquotes, links, horizontal rules,
 * and plain paragraphs.
 */
const MiniMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;

    // Inline formatter: bold, italic, inline-code, links
    const inline = (text: string, key: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let buf = '';
        let j = 0;
        const push = (node: React.ReactNode) => { parts.push(node); };
        const flush = () => { if (buf) { push(buf); buf = ''; } };

        while (j < text.length) {
            // Inline code
            if (text[j] === '`') {
                flush();
                const end = text.indexOf('`', j + 1);
                if (end !== -1) {
                    push(
                        <code key={`${key}-c${j}`}
                            className="px-1 py-0.5 rounded text-[11px] bg-cyan-950/60 text-cyan-300 font-mono border border-cyan-900/40">
                            {text.slice(j + 1, end)}
                        </code>
                    );
                    j = end + 1;
                    continue;
                }
            }
            // Bold **text**
            if (text[j] === '*' && text[j + 1] === '*') {
                flush();
                const end = text.indexOf('**', j + 2);
                if (end !== -1) {
                    push(<strong key={`${key}-b${j}`} className="font-bold text-white">{text.slice(j + 2, end)}</strong>);
                    j = end + 2;
                    continue;
                }
            }
            // Italic *text*
            if (text[j] === '*' && text[j + 1] !== '*') {
                flush();
                const end = text.indexOf('*', j + 1);
                if (end !== -1) {
                    push(<em key={`${key}-i${j}`} className="italic text-cyan-200">{text.slice(j + 1, end)}</em>);
                    j = end + 1;
                    continue;
                }
            }
            // Link [label](url)
            if (text[j] === '[') {
                const labelEnd = text.indexOf(']', j);
                if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
                    const urlEnd = text.indexOf(')', labelEnd + 2);
                    if (urlEnd !== -1) {
                        flush();
                        const label = text.slice(j + 1, labelEnd);
                        const url   = text.slice(labelEnd + 2, urlEnd);
                        push(
                            <a key={`${key}-l${j}`} href={url} target="_blank" rel="noopener noreferrer"
                                className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
                                {label}
                            </a>
                        );
                        j = urlEnd + 1;
                        continue;
                    }
                }
            }
            buf += text[j];
            j++;
        }
        flush();
        return <>{parts}</>;
    };

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Fenced code block ```
        if (trimmed.startsWith('```')) {
            const lang = trimmed.slice(3).trim();
            const blockLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                blockLines.push(lines[i]);
                i++;
            }
            nodes.push(
                <div key={`cb-${i}`} className="my-2 rounded-md overflow-hidden border border-cyan-900/40">
                    {lang && (
                        <div className="px-3 py-1 bg-cyan-950/60 text-[10px] text-cyan-500 font-mono tracking-wider border-b border-cyan-900/40">
                            {lang}
                        </div>
                    )}
                    <pre className="px-3 py-2 overflow-x-auto text-[11px] leading-relaxed text-cyan-200 bg-black/60">
                        <code>{blockLines.join('\n')}</code>
                    </pre>
                </div>
            );
            i++;
            continue;
        }

        // Horizontal rule ---
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            nodes.push(<hr key={`hr-${i}`} className="my-2 border-cyan-900/40" />);
            i++;
            continue;
        }

        // Heading ## / ### / ####
        const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const cls = level === 1 ? 'text-base font-bold text-white mt-2 mb-1'
                      : level === 2 ? 'text-sm  font-bold text-cyan-200 mt-2 mb-1'
                      :               'text-xs  font-bold text-cyan-300 mt-1 mb-0.5';
            nodes.push(
                <p key={`h-${i}`} className={cls}>{inline(headingMatch[2], `h${i}`)}</p>
            );
            i++;
            continue;
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
            nodes.push(
                <blockquote key={`bq-${i}`}
                    className="border-l-2 border-cyan-600 pl-3 my-1 text-cyan-400/80 italic">
                    {inline(trimmed.slice(2), `bq${i}`)}
                </blockquote>
            );
            i++;
            continue;
        }

        // Bullet list
        if (/^[-*+]\s/.test(trimmed)) {
            const items: string[] = [];
            while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().slice(2));
                i++;
            }
            nodes.push(
                <ul key={`ul-${i}`} className="my-1 space-y-0.5 pl-3">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
                            <span>{inline(item, `ul${i}-${idx}`)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
            const items: string[] = [];
            let num = 1;
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
                i++;
            }
            nodes.push(
                <ol key={`ol-${i}`} className="my-1 space-y-0.5 pl-3">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-cyan-500 flex-shrink-0 font-mono">{num++ }.</span>
                            <span>{inline(item, `ol${i}-${idx}`)}</span>
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Blank line — spacer
        if (trimmed === '') {
            nodes.push(<div key={`sp-${i}`} className="h-1" />);
            i++;
            continue;
        }

        // Plain paragraph
        nodes.push(
            <p key={`p-${i}`} className="leading-relaxed">{inline(trimmed, `p${i}`)}</p>
        );
        i++;
    }

    return <div className="text-[12px] space-y-0.5">{nodes}</div>;
};

// ─── Types ────────────────────────────────────────────────────────────────────

type MsgType = 'sys' | 'user' | 'ai' | 'error';

interface TermMsg {
    id: string;
    text: string;
    type: MsgType;
    failed?: boolean;
    userText?: string;
}

interface ContactInterfaceProps {
    profile: Profile;
    isPowered: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ContactInterface: React.FC<ContactInterfaceProps> = ({ profile, isPowered }) => {

    const [consoleInput, setConsoleInput] = useState<string>('');
    const [messages, setMessages]         = useState<TermMsg[]>([
        { id: 'b1', text: '> Booting RSMK AI interface...', type: 'sys' },
        { id: 'b2', text: '> Connection established.', type: 'sys' },
        { id: 'b3', text: "Hey! I'm RSMK's AI assistant. Ask me anything about his projects, skills, or background 👋", type: 'ai' },
    ]);
    const [isLoading, setIsLoading]       = useState<boolean>(false);
    const [uplinkStatus, setUplinkStatus] = useState<'IDLE' | 'TRANSMITTING' | 'ACKNOWLEDGED'>('IDLE');
    const [msgCount, setMsgCount]         = useState<number>(() => getCount());

    const scrollRef   = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<TermMsg[]>(messages);

    const remaining      = MAX_MSGS - msgCount;
    const isLimitReached = remaining <= 0;

    const barHeights = useMemo(
        () => Array.from({ length: 8 }, () => Math.random() * 12 + 4),
        []
    );

    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const uid = (): string => `${Date.now()}-${Math.random()}`;

    const addMsg = useCallback((msg: Omit<TermMsg, 'id'>): void => {
        setMessages(prev => [...prev, { ...msg, id: uid() }]);
    }, []);

    const timeLabel = (): string =>
        new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // ── Core AI call ──────────────────────────────────────────────────────────

    const sendToAI = useCallback(async (text: string, retryClean?: TermMsg[]): Promise<void> => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const cur = getCount();
        if (cur >= MAX_MSGS) { setMsgCount(cur); return; }

        // HF Space crashes on non-empty history — always send []
        const history: { role: string; content: string }[] = [];

        if (!retryClean) {
            addMsg({ text: `> ${trimmed}`, type: 'user' });
            setConsoleInput('');
        }

        setIsLoading(true);
        setUplinkStatus('TRANSMITTING');

        const newCount = cur + 1;
        saveCount(newCount);
        setMsgCount(newCount);

        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                const res = await fetch(AI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: trimmed, history }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                addMsg({ text: data.reply ?? 'No response received.', type: 'ai' });
                setUplinkStatus('ACKNOWLEDGED');
                setTimeout(() => setUplinkStatus('IDLE'), 2000);
                lastError = null;
                break;
            } catch (err) {
                lastError = err as Error;
                if (attempt < MAX_ATTEMPTS) {
                    await new Promise<void>(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
        }

        if (lastError !== null) {
            addMsg({ text: 'Server is waking up... please click retry in a moment!', type: 'error', failed: true, userText: trimmed });
            saveCount(newCount - 1);
            setMsgCount(newCount - 1);
            setUplinkStatus('IDLE');
        }

        setIsLoading(false);
    }, [isLoading, addMsg]);

    const handleCommand = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!consoleInput.trim() || isLoading || isLimitReached) return;
        sendToAI(consoleInput);
    };

    const handleRetry = (failedId: string): void => {
        const failedMsg = messagesRef.current.find(m => m.id === failedId);
        if (!failedMsg?.userText) return;
        const cleaned = messagesRef.current.filter(m => m.id !== failedId);
        setMessages(cleaned);
        sendToAI(failedMsg.userText, cleaned);
    };

    const getIcon = (platform: Social['platform']) => {
        switch (platform) {
            case 'github':    return Github;
            case 'linkedin':  return Linkedin;
            case 'twitter':   return Twitter;
            case 'x':         return Twitter;
            case 'instagram': return Instagram;
            case 'telegram':  return Send;
            case 'email':     return Mail;
            default:          return Mail;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Social Links */}
            <div className="space-y-6">
                <div className="flex justify-between items-end pb-2 border-b border-gray-800">
                    <div>
                        <h3 className={`text-xs font-mono tracking-[0.2em] mb-1 ${isPowered ? 'text-cyan-400' : 'text-gray-600'}`}>
                            CONTACT CHANNELS
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>Signal</span>
                            <div className="flex gap-0.5 items-end h-4">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`w-1 rounded-sm ${isPowered ? 'bg-cyan-500' : 'bg-gray-800'}`}
                                        animate={isPowered ? { height: [4, barHeights[i], 4], opacity: [0.5, 1, 0.5] } : { height: 4 }}
                                        transition={{ duration: 0.5 + barHeights[i] / 24, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>Status:</span>
                            <span className={`text-[10px] font-mono font-bold ${
                                uplinkStatus === 'TRANSMITTING' ? 'text-amber-500 animate-pulse' :
                                uplinkStatus === 'ACKNOWLEDGED' ? 'text-emerald-500' :
                                isPowered ? 'text-cyan-500' : 'text-gray-600'
                            }`}>
                                {uplinkStatus === 'IDLE' ? (isPowered ? 'READY' : 'OFFLINE') : uplinkStatus}
                            </span>
                        </div>
                    </div>
                    <Wifi size={18} className={isPowered ? 'text-cyan-500 animate-pulse' : 'text-gray-800'} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ContactCard href={`mailto:${profile.email}`} icon={Mail} label="EMAIL" value={profile.email} isPowered={isPowered} />
                    {profile.socials.filter(s => s.platform !== 'email').map(social => {
                        const Icon = getIcon(social.platform);
                        let handle = social.url;
                        if (social.platform === 'linkedin')       handle = 'LinkedIn Profile';
                        else if (social.platform === 'github')    handle = 'GitHub Profile';
                        else if (social.platform === 'instagram') handle = 'Instagram';
                        else if (social.platform === 'telegram')  handle = 'Telegram';
                        else if (social.platform === 'x')         handle = 'X (Twitter)';
                        else handle = social.url.replace(/^https?:\/\//, '');
                        return (
                            <ContactCard key={social.platform} href={social.url} icon={Icon}
                                label={social.platform.toUpperCase()} value={handle} isPowered={isPowered} />
                        );
                    })}
                </div>
            </div>

            {/* AI Terminal */}
            <div className={`relative rounded-lg overflow-hidden border transition-all duration-500 flex flex-col h-[480px] ${
                isPowered
                    ? 'border-cyan-900/50 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                    : 'border-gray-900 bg-[#050505]'
            }`}>
                {isPowered && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]" />
                )}

                {/* Header */}
                <div className={`px-4 py-2 border-b flex justify-between items-center flex-shrink-0 ${
                    isPowered ? 'bg-cyan-950/20 border-cyan-900/30' : 'bg-[#111] border-gray-800'
                }`}>
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className={isPowered ? 'text-cyan-400' : 'text-gray-600'} />
                        <span className={`text-xs font-mono font-bold ${isPowered ? 'text-cyan-500' : 'text-gray-600'}`}>
                            AI ASSISTANT
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500'     : 'bg-gray-800'}`} />
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-amber-500'   : 'bg-gray-800'}`} />
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                    </div>
                </div>

                {/* Messages — scrollable */}
                <div
                    ref={scrollRef}
                    data-lenis-prevent
                    className="flex-1 p-4 font-mono text-xs overflow-y-auto relative z-10 space-y-3"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(8,145,178,0.3) transparent',
                    }}
                >
                    {messages.map(msg => (
                        <div key={msg.id}>
                            {/* Timestamp + prefix row */}
                            <div className="flex items-center gap-1.5 mb-0.5 select-none">
                                <span className="opacity-30 text-[10px]">{timeLabel()}</span>
                                {msg.type === 'ai'    && <span className="text-cyan-500 text-[10px]">[AI]</span>}
                                {msg.type === 'error' && <span className="text-amber-500 text-[10px]">[!]</span>}
                                {msg.type === 'user'  && <span className="text-green-500 text-[10px]">[YOU]</span>}
                                {msg.type === 'sys'   && <span className="text-cyan-700 text-[10px]">[SYS]</span>}
                            </div>

                            {/* Message body */}
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`ml-1 ${
                                    msg.type === 'user'  ? 'text-white' :
                                    msg.type === 'ai'    ? 'text-cyan-200' :
                                    msg.type === 'error' ? 'text-amber-400' :
                                                           'text-cyan-700'
                                }`}
                            >
                                {msg.type === 'ai'
                                    ? <MiniMarkdown content={msg.text} />
                                    : <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                                }
                            </motion.div>

                            {/* Retry button */}
                            {msg.failed && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => handleRetry(msg.id)}
                                    className="mt-1.5 ml-1 flex items-center gap-1.5 text-amber-400 border border-amber-800/50 rounded px-2 py-0.5 hover:bg-amber-900/20 transition-colors text-[10px] font-mono"
                                >
                                    <RefreshCw size={10} />
                                    retry
                                </motion.button>
                            )}
                        </div>
                    ))}

                    {/* Thinking indicator */}
                    {isLoading && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-0.5 select-none">
                                <span className="opacity-30 text-[10px]">{timeLabel()}</span>
                                <span className="text-cyan-500 text-[10px]">[AI]</span>
                            </div>
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="ml-1 text-cyan-500 text-xs font-mono"
                            >
                                thinking...
                            </motion.div>
                        </div>
                    )}

                    {/* Session limit reached */}
                    {isLimitReached && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-1 text-emerald-400 font-mono text-xs border border-emerald-900/40 rounded px-3 py-2 bg-emerald-950/20"
                        >
                            You've reached the 20-message session limit. Refresh the page to start a new session 🔄
                        </motion.div>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleCommand}
                    className={`p-3 border-t relative z-30 flex-shrink-0 ${
                        isPowered ? 'border-cyan-900/30 bg-cyan-950/10' : 'border-gray-800'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className={isPowered ? 'text-green-500' : 'text-gray-600'}>➜</span>
                        <input
                            type="text"
                            value={consoleInput}
                            onChange={e => setConsoleInput(e.target.value)}
                            placeholder={
                                !isPowered     ? 'Offline' :
                                isLimitReached ? 'Session limit reached...' :
                                isLoading      ? 'Waiting for response...' :
                                                 'Ask me anything...'
                            }
                            disabled={!isPowered || isLoading || isLimitReached}
                            className={`flex-1 bg-transparent border-none outline-none font-mono text-sm ${
                                isPowered
                                    ? 'text-cyan-100 placeholder-cyan-900/50'
                                    : 'text-gray-600 placeholder-gray-800'
                            }`}
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!isPowered || isLoading || isLimitReached || !consoleInput.trim()}
                            className={`p-1.5 rounded transition-all ${
                                isPowered && !isLoading && !isLimitReached && consoleInput.trim()
                                    ? 'text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-200'
                                    : 'text-gray-700'
                            }`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── ContactCard ──────────────────────────────────────────────────────────────

const ContactCard: React.FC<{
    href: string;
    icon: React.ElementType;
    label: string;
    value: string;
    isPowered: boolean;
}> = ({ href, icon: Icon, label, value, isPowered }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative overflow-hidden flex items-center gap-4 p-4 border rounded-xl transition-all duration-300 ${
            isPowered
                ? 'bg-[#0a0a0a] border-gray-800 hover:border-cyan-500/50'
                : 'bg-black border-gray-900'
        }`}
    >
        {isPowered && (
            <>
                <div className="absolute inset-0 bg-transparent group-hover:bg-cyan-950/10 transition-colors duration-300" />
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-500"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                />
            </>
        )}
        <div className={`relative z-10 p-2.5 rounded-lg transition-colors ${
            isPowered
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
