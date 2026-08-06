import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Profile, Social } from '../types';
import { Mail, Github, Linkedin, Twitter, Send, Terminal, Wifi, Activity, Instagram, RefreshCw } from 'lucide-react';
import { trackInteraction } from '../utils/analytics';

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_API_URL = 'https://project-mani-c0t3.onrender.com/api/chat';
const USAGE_KEY = 'rsmk_chat_usage';
const MAX_MSGS = 999999;
const MAX_ATTEMPTS = 3;
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
                        const url = text.slice(labelEnd + 2, urlEnd);
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
                    : 'text-xs  font-bold text-cyan-300 mt-1 mb-0.5';
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
                            <span className="text-cyan-500 flex-shrink-0 font-mono">{num++}.</span>
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

const GithubRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LinkedinRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
);

const XRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const TelegramRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.24-.213-.054-.33-.373-.12l-6.87 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.536-.194 1.006.128.832.961z" />
    </svg>
);

const InstagramRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
);

const EmailRealIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.324 1.517-2.054 2.54-1.214l9.46 7.095 9.46-7.095C22.483 3.403 24 4.133 24 5.457z" />
    </svg>
);

const BRAND_DATA: Record<string, { color: string; glow: string }> = {
    email: { color: '#ea4335', glow: 'rgba(234, 67, 53, 0.08)' },
    github: { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.08)' },
    linkedin: { color: '#0a66c2', glow: 'rgba(10, 102, 194, 0.08)' },
    instagram: { color: '#e1306c', glow: 'rgba(225, 48, 108, 0.08)' },
    telegram: { color: '#24a1de', glow: 'rgba(36, 161, 222, 0.08)' },
    x: { color: '#1da1f2', glow: 'rgba(29, 161, 242, 0.08)' },
    twitter: { color: '#1da1f2', glow: 'rgba(29, 161, 242, 0.08)' }
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ContactInterface: React.FC<ContactInterfaceProps> = ({ profile, isPowered }) => {

    const [consoleInput, setConsoleInput] = useState<string>('');
    const [messages, setMessages] = useState<TermMsg[]>([
        { id: 'b1', text: '> Booting RSMK AI interface...', type: 'sys' },
        { id: 'b2', text: '> Connection established.', type: 'sys' },
        { id: 'b3', text: "Hey! I'm RSMK's AI assistant. Ask me anything about his projects, skills, or background 👋", type: 'ai' },
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uplinkStatus, setUplinkStatus] = useState<'IDLE' | 'TRANSMITTING' | 'ACKNOWLEDGED'>('IDLE');
    const [msgCount, setMsgCount] = useState<number>(() => getCount());

    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<TermMsg[]>(messages);

    const remaining = MAX_MSGS - msgCount;
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

        // Build history from existing messages
        const messageHistory = (retryClean || messagesRef.current)
            .filter(m => m.type === 'user' || m.type === 'ai')
            .map(m => ({
                role: m.type === 'user' ? 'user' : 'assistant',
                content: m.type === 'user' ? m.text.replace(/^>\s*/, '') : m.text
            }));

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
                    body: JSON.stringify({ query: trimmed, history: messageHistory }),
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || `HTTP ${res.status}`);
                }

                addMsg({ text: data.response ?? 'No response received.', type: 'ai' });
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
        trackInteraction('ai_chat_send', 'ai_terminal', consoleInput.slice(0, 50));
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
            case 'github': return GithubRealIcon;
            case 'linkedin': return LinkedinRealIcon;
            case 'twitter': return XRealIcon;
            case 'x': return XRealIcon;
            case 'instagram': return InstagramRealIcon;
            case 'telegram': return TelegramRealIcon;
            case 'email': return EmailRealIcon;
            default: return EmailRealIcon;
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
                                    <div
                                        key={i}
                                        className={`w-1 rounded-sm ${isPowered ? 'bg-cyan-500 animate-signal-pulse' : 'bg-gray-800'}`}
                                        style={isPowered ? {
                                            '--signal-height': `${barHeights[i]}px`,
                                            animationDelay: `${i * 0.1}s`,
                                            animationDuration: `${0.6 + barHeights[i] / 24}s`
                                        } as React.CSSProperties : { height: '4px' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>Status:</span>
                            <span className={`text-[10px] font-mono font-bold ${uplinkStatus === 'TRANSMITTING' ? 'text-amber-500 animate-pulse' :
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
                    <ContactCard 
                        href={`mailto:${profile.email}`} 
                        icon={EmailRealIcon} 
                        label="EMAIL" 
                        value={profile.email} 
                        isPowered={isPowered} 
                        brandColor="#ea4335"
                        brandGlow="rgba(234, 67, 53, 0.08)"
                    />
                    {profile.socials.filter(s => s.platform !== 'email').map(social => {
                        const Icon = getIcon(social.platform);
                        let handle = social.url;
                        if (social.platform === 'linkedin') handle = 'LinkedIn Profile';
                        else if (social.platform === 'github') handle = 'GitHub Profile';
                        else if (social.platform === 'instagram') handle = 'Instagram';
                        else if (social.platform === 'telegram') handle = 'Telegram';
                        else if (social.platform === 'x') handle = 'X (Twitter)';
                        else handle = social.url.replace(/^https?:\/\//, '');
                        
                        const brand = BRAND_DATA[social.platform] || { color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.08)' };
                        
                        return (
                            <ContactCard 
                                key={social.platform} 
                                href={social.url} 
                                icon={Icon}
                                label={social.platform.toUpperCase()} 
                                value={handle} 
                                isPowered={isPowered}
                                brandColor={brand.color}
                                brandGlow={brand.glow}
                            />
                        );
                    })}
                </div>
            </div>

            {/* AI Terminal */}
            <div className={`relative rounded-lg overflow-hidden border transition-all duration-500 flex flex-col h-[480px] ${isPowered
                ? 'border-cyan-900/50 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                : 'border-gray-900 bg-[#050505]'
                }`}>
                {isPowered && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]" />
                )}

                {/* Header */}
                <div className={`px-4 py-2 border-b flex justify-between items-center flex-shrink-0 ${isPowered ? 'bg-cyan-950/20 border-cyan-900/30' : 'bg-[#111] border-gray-800'
                    }`}>
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className={isPowered ? 'text-cyan-400' : 'text-gray-600'} />
                        <span className={`text-xs font-mono font-bold ${isPowered ? 'text-cyan-500' : 'text-gray-600'}`}>
                            AI ASSISTANT
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500' : 'bg-gray-800'}`} />
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-amber-500' : 'bg-gray-800'}`} />
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
                                {msg.type === 'ai' && <span className="text-cyan-500 text-[10px]">[AI]</span>}
                                {msg.type === 'error' && <span className="text-amber-500 text-[10px]">[!]</span>}
                                {msg.type === 'user' && <span className="text-green-500 text-[10px]">[YOU]</span>}
                                {msg.type === 'sys' && <span className="text-cyan-700 text-[10px]">[SYS]</span>}
                            </div>

                            {/* Message body */}
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`ml-1 ${msg.type === 'user' ? 'text-white' :
                                    msg.type === 'ai' ? 'text-cyan-200' :
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
                            <div className="ml-1 text-cyan-500 text-xs font-mono animate-pulse">
                                thinking...
                            </div>
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
                    className={`p-3 border-t relative z-30 flex-shrink-0 ${isPowered ? 'border-cyan-900/30 bg-cyan-950/10' : 'border-gray-800'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className={isPowered ? 'text-green-500' : 'text-gray-600'}>➜</span>
                        <input
                            type="text"
                            value={consoleInput}
                            onChange={e => setConsoleInput(e.target.value)}
                            placeholder={
                                !isPowered ? 'Offline' :
                                    isLimitReached ? 'Session limit reached...' :
                                        isLoading ? 'Waiting for response...' :
                                            'Ask me anything...'
                            }
                            disabled={!isPowered || isLoading || isLimitReached}
                            className={`flex-1 bg-transparent border-none outline-none font-mono text-sm ${isPowered
                                ? 'text-cyan-100 placeholder-cyan-900/50'
                                : 'text-gray-600 placeholder-gray-800'
                                }`}
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!isPowered || isLoading || isLimitReached || !consoleInput.trim()}
                            className={`p-1.5 rounded transition-all ${isPowered && !isLoading && !isLimitReached && consoleInput.trim()
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
    brandColor?: string;
    brandGlow?: string;
}> = ({ href, icon: Icon, label, value, isPowered, brandColor = '#22d3ee', brandGlow = 'rgba(34, 211, 238, 0.08)' }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackInteraction('contact_click', 'contact', `${label}: ${value}`)}
        style={isPowered ? {
            '--hover-border': `${brandColor}80`,
        } as React.CSSProperties : {}}
        className={`group relative overflow-hidden flex items-center gap-4 p-4 border rounded-xl transition-all duration-300 ${isPowered
            ? 'bg-[#0a0a0a] border-gray-800 hover:border-[var(--hover-border)]'
            : 'bg-black border-gray-900'
            }`}
    >
        {isPowered && (
            <>
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    style={{ backgroundColor: brandGlow }}
                />
                <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: brandColor }}
                />
            </>
        )}
        <div 
            className={`relative z-10 p-2.5 rounded-lg transition-all duration-300 ${isPowered
                ? 'bg-gray-900 group-hover:shadow-[0_0_15px_var(--brand-glow-shadow)]'
                : 'bg-gray-900 text-gray-600'
                }`}
            style={isPowered ? {
                color: brandColor,
                '--brand-glow-shadow': `${brandColor}40`
            } as React.CSSProperties : {}}
        >
            <Icon size={22} />
        </div>
        <div className="flex-1 relative z-10">
            <div className="flex justify-between items-center mb-0.5">
                <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">{label}</p>
                {isPowered && (
                    <Activity 
                        size={10} 
                        className="group-hover:animate-pulse" 
                        style={{ color: isPowered ? brandColor : undefined, opacity: 0.5 }} 
                    />
                )}
            </div>
            <p className={`font-bold transition-colors ${isPowered ? 'text-gray-200 group-hover:text-white' : 'text-gray-600'}`}>
                {value}
            </p>
        </div>
    </a>
);
