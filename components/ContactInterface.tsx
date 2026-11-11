import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, Social } from '../types';
import { Mail, Github, Linkedin, Twitter, Send, Terminal, Wifi, Activity, Instagram, RefreshCw, Copy, Check } from 'lucide-react';
import { trackInteraction } from '../utils/analytics';

import { AI_CHAT_API_URL, useChatbotWarmup } from '../utils/chatbotWarmup';

// ─── Constants ────────────────────────────────────────────────────────────────

const USAGE_KEY = 'rsmk_chat_usage';
const MAX_MSGS = 20;
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
                        const isSafe = /^(https?:\/\/|mailto:)/i.test(url.trim());
                        if (isSafe) {
                            push(
                                <a key={`${key}-l${j}`} href={url.trim()} target="_blank" rel="noopener noreferrer"
                                    className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
                                    {label}
                                </a>
                            );
                        } else {
                            push(
                                <span key={`${key}-l${j}`}>
                                    {label} ({url})
                                </span>
                            );
                        }
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
    useChatbotWarmup();

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
        const trimmed = text.trim().slice(0, 500);
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
                const res = await fetch(AI_CHAT_API_URL, {
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

    const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(profile.email);
        setCopiedEmail(true);
        trackInteraction('copy_email', 'contact', profile.email);
        setTimeout(() => setCopiedEmail(false), 2200);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Social Links & Direct Channels — RF / UART Patchbay */}
            <div className="space-y-5">
                <div className={`flex justify-between items-end pb-3 border-b transition-colors ${
                    isPowered ? 'border-zinc-800/90' : 'border-zinc-900'
                }`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                            <h3 className={`text-xs font-mono tracking-[0.2em] font-bold ${isPowered ? 'text-cyan-400' : 'text-amber-400'}`}>
                                DIRECT CHANNELS &amp; COMMS
                            </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-semibold text-zinc-300">Signal:</span>
                                <div className="flex gap-0.5 items-end h-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1 rounded-sm ${isPowered ? 'bg-cyan-400 animate-signal-pulse' : 'bg-zinc-700'}`}
                                            style={isPowered ? {
                                                '--signal-height': `${barHeights[i]}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: `${0.6 + barHeights[i] / 24}s`
                                            } as React.CSSProperties : { height: '4px' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                isPowered
                                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                                    : 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                            }`}>
                                {isPowered ? '115200 BAUD' : 'STANDBY RAIL'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono font-semibold text-zinc-300">Status:</span>
                            <span className={`text-xs font-mono font-bold tracking-wider ${
                                uplinkStatus === 'TRANSMITTING' ? 'text-amber-400 animate-pulse' :
                                uplinkStatus === 'ACKNOWLEDGED' ? 'text-emerald-400' :
                                isPowered ? 'text-cyan-300' : 'text-amber-400'
                            }`}>
                                {uplinkStatus === 'IDLE' ? (isPowered ? 'READY FOR UPLINK' : 'OFFLINE') : uplinkStatus}
                            </span>
                        </div>
                    </div>

                    <div className={`p-2 rounded-lg border ${
                        isPowered ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-zinc-950 border-zinc-800'
                    }`}>
                        <Wifi size={18} className={isPowered ? 'text-cyan-400 animate-pulse' : 'text-zinc-400'} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                    <ContactCard
                        href={`mailto:${profile.email}`}
                        icon={EmailRealIcon}
                        label="EMAIL"
                        channelTag="CH-00 // SMTP"
                        value={profile.email}
                        isPowered={isPowered}
                        brandColor="#ea4335"
                        brandGlow="rgba(234, 67, 53, 0.08)"
                        extraAction={
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className={`min-h-[44px] min-w-[44px] px-3 py-2 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
                                    isPowered
                                        ? 'bg-zinc-950/90 border-zinc-700 hover:border-cyan-400 hover:text-cyan-300 text-zinc-200'
                                        : 'bg-zinc-950 border-zinc-800 hover:border-amber-400 hover:text-amber-300 text-zinc-300'
                                }`}
                                title="Copy Email to Clipboard"
                                aria-label="Copy Email to Clipboard"
                            >
                                {copiedEmail ? (
                                    <>
                                        <Check size={14} className="text-emerald-400" />
                                        <span className="text-emerald-400 font-bold">COPIED</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>COPY</span>
                                    </>
                                )}
                            </button>
                        }
                    />
                    {profile.socials.filter(s => s.platform !== 'email').map((social, idx) => {
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
                                channelTag={`CH-0${idx + 1} // LINK`}
                                value={handle}
                                isPowered={isPowered}
                                brandColor={brand.color}
                                brandGlow={brand.glow}
                            />
                        );
                    })}
                </div>
            </div>

            {/* AI Diagnostic UART Serial Console */}
            <div className={`relative rounded-xl overflow-hidden border transition-all duration-500 flex flex-col h-[500px] ${
                isPowered
                    ? 'border-cyan-500/35 bg-[#07090c] shadow-[0_0_40px_rgba(0,242,255,0.07)]'
                    : 'border-zinc-800 bg-[#090908]'
            }`}>
                {/* Instrument Bezel Header */}
                <div className={`px-4 py-2.5 border-b flex justify-between items-center flex-shrink-0 ${
                    isPowered ? 'bg-cyan-950/25 border-cyan-900/40' : 'bg-zinc-950 border-zinc-800'
                }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1 rounded border ${
                            isPowered ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-amber-400'
                        }`}>
                            <Terminal size={13} />
                        </div>
                        <span className={`text-xs font-mono font-bold tracking-wider ${isPowered ? 'text-cyan-300' : 'text-zinc-200'}`}>
                            AI ASSISTANT
                        </span>
                        {isPowered ? (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                ONLINE
                            </span>
                        ) : (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-500/35 bg-amber-950/30 text-amber-400">
                                STANDBY
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isPowered
                                ? 'border-zinc-800 bg-black/50 text-zinc-300'
                                : 'border-zinc-800 bg-black/50 text-zinc-400'
                        }`}>
                            TX {Math.max(0, remaining)}/{MAX_MSGS}
                        </span>
                        <div className="flex gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500/90' : 'bg-zinc-700'}`} />
                            <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-amber-400/90' : 'bg-amber-500/50'}`} />
                            <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-400/90' : 'bg-zinc-700'}`} />
                        </div>
                    </div>
                </div>

                {/* UART Telemetry Sub-bar */}
                <div className={`px-4 py-1.5 border-b flex items-center justify-between text-[10px] font-mono flex-shrink-0 ${
                    isPowered ? 'border-cyan-950/60 bg-black/50 text-zinc-400' : 'border-zinc-900 bg-black/40 text-zinc-400'
                }`}>
                    <span>PORT: UART0 // 8N1</span>
                    <span className={isPowered ? 'text-cyan-400' : 'text-amber-400'}>
                        {isLoading ? 'RX STREAM ACTIVE' : 'PROTO: HTTPS/JSON'}
                    </span>
                </div>

                {/* Messages — scrollable diagnostic stream */}
                <div
                    ref={scrollRef}
                    data-lenis-prevent
                    className="flex-1 p-4 font-mono text-xs overflow-y-auto relative z-10 space-y-3.5"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(8,145,178,0.35) transparent',
                        backgroundImage: 'radial-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                    }}
                >
                    {messages.map(msg => (
                        <div key={msg.id} className={msg.type === 'user' ? 'flex flex-col items-end' : ''}>
                            {/* Timestamp + prefix row */}
                            <div className="flex items-center gap-1.5 mb-1 select-none">
                                <span className="text-zinc-400 text-[10px]">{timeLabel()}</span>
                                {msg.type === 'ai' && <span className="text-cyan-400 font-bold text-[10px]">[AI]</span>}
                                {msg.type === 'error' && <span className="text-amber-400 font-bold text-[10px]">[!]</span>}
                                {msg.type === 'user' && <span className="text-emerald-400 font-bold text-[10px]">[YOU]</span>}
                                {msg.type === 'sys' && <span className="text-cyan-500 text-[10px]">[SYS]</span>}
                            </div>

                            {/* Message body */}
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={
                                    msg.type === 'user'
                                        ? 'max-w-[90%] rounded-lg px-3 py-2 bg-emerald-950/30 border border-emerald-500/30 text-white'
                                        : msg.type === 'ai'
                                            ? 'rounded-lg px-3.5 py-2.5 bg-zinc-900/75 border border-cyan-500/20 text-cyan-100'
                                            : msg.type === 'error'
                                                ? 'rounded-lg px-3 py-2 bg-amber-950/30 border border-amber-500/35 text-amber-300'
                                                : 'ml-1 text-cyan-400/90'
                                }
                            >
                                {msg.type === 'ai'
                                    ? <MiniMarkdown content={msg.text} />
                                    : <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                                }
                            </motion.div>

                            {/* Retry button */}
                            {msg.failed && (
                                <motion.button
                                    type="button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => handleRetry(msg.id)}
                                    className="mt-1.5 ml-1 flex items-center gap-1.5 text-amber-300 bg-amber-950/40 border border-amber-500/40 rounded-md px-2.5 py-1 hover:bg-amber-900/40 transition-colors text-[10px] font-mono cursor-pointer"
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
                            <div className="flex items-center gap-1.5 mb-1 select-none">
                                <span className="text-zinc-400 text-[10px]">{timeLabel()}</span>
                                <span className="text-cyan-400 font-bold text-[10px]">[AI]</span>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-zinc-900/75 border border-cyan-500/25 text-cyan-300 text-xs font-mono">
                                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                <span>thinking...</span>
                            </div>
                        </div>
                    )}

                    {/* Session limit reached */}
                    {isLimitReached && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-emerald-300 font-mono text-xs border border-emerald-500/35 rounded-lg px-3.5 py-2.5 bg-emerald-950/25"
                        >
                            You've reached the 20-message session limit. Refresh the page to start a new session 🔄
                        </motion.div>
                    )}
                </div>

                {/* Input — UART TX Command Prompt */}
                <form
                    onSubmit={handleCommand}
                    className={`p-3 border-t relative z-30 flex-shrink-0 ${
                        isPowered ? 'border-cyan-900/40 bg-zinc-950/90' : 'border-zinc-800 bg-zinc-950'
                    }`}
                >
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-1 border transition-colors ${
                        isPowered
                            ? 'bg-black/70 border-zinc-800 focus-within:border-cyan-500/60'
                            : 'bg-black/60 border-zinc-800'
                    }`}>
                        <span className={`font-mono font-bold ${isPowered ? 'text-emerald-400' : 'text-zinc-500'}`}>➜</span>
                        <input
                            type="text"
                            value={consoleInput}
                            onChange={e => setConsoleInput(e.target.value)}
                            maxLength={500}
                            placeholder={
                                !isPowered ? 'Offline' :
                                    isLimitReached ? 'Session limit reached...' :
                                        isLoading ? 'Waiting for response...' :
                                            'Ask me anything...'
                            }
                            disabled={!isPowered || isLoading || isLimitReached}
                            className={`flex-1 bg-transparent border-none outline-none font-mono text-sm py-1 ${
                                isPowered
                                    ? 'text-cyan-100 placeholder-zinc-500'
                                    : 'text-zinc-400 placeholder-zinc-500'
                            }`}
                            autoComplete="off"
                        />
                        {consoleInput.length > 0 && (
                            <span className="text-[10px] font-mono text-zinc-400 flex-shrink-0">
                                {consoleInput.length}/500
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={!isPowered || isLoading || isLimitReached || !consoleInput.trim()}
                            aria-label="Send message"
                            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md transition-all ${
                                isPowered && !isLoading && !isLimitReached && consoleInput.trim()
                                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black cursor-pointer'
                                    : 'text-zinc-500 border border-transparent'
                            }`}
                        >
                            <Send size={17} />
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
    channelTag: string;
    value: string;
    isPowered: boolean;
    brandColor?: string;
    brandGlow?: string;
    extraAction?: React.ReactNode;
}> = ({ href, icon: Icon, label, channelTag, value, isPowered, brandColor = '#22d3ee', brandGlow = 'rgba(34, 211, 238, 0.08)', extraAction }) => (
    <div
        className={`group relative overflow-hidden flex items-center justify-between gap-4 p-4 border rounded-xl transition-all duration-300 ${
            isPowered
                ? 'bg-[#0a0b0e] border-zinc-800/90 hover:border-[var(--hover-border)] shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
                : 'bg-[#0b0b09] border-zinc-800'
        }`}
        style={isPowered ? {
            '--hover-border': `${brandColor}80`,
        } as React.CSSProperties : {}}
    >
        {/* Left hardware pin indicator bar */}
        <div
            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r transition-all duration-300"
            style={{ backgroundColor: isPowered ? `${brandColor}70` : '#52525b' }}
        />

        {isPowered && (
            <>
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: brandGlow }}
                />
                <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 pointer-events-none"
                    style={{ backgroundColor: brandColor }}
                />
            </>
        )}
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackInteraction('contact_click', 'contact', `${label}: ${value}`)}
            className="flex items-center gap-4 flex-1 min-w-0 pl-1"
        >
            <div
                className={`relative z-10 p-2.5 rounded-lg border transition-all duration-300 flex-shrink-0 ${
                    isPowered
                        ? 'bg-zinc-950 border-zinc-800 group-hover:shadow-[0_0_15px_var(--brand-glow-shadow)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
                style={isPowered ? {
                    color: brandColor,
                    '--brand-glow-shadow': `${brandColor}40`
                } as React.CSSProperties : {}}
            >
                <Icon size={21} />
            </div>
            <div className="flex-1 relative z-10 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2">
                        <p className="text-[11px] text-zinc-300 font-mono font-bold tracking-wider uppercase">{label}</p>
                        {isPowered && (
                            <Activity
                                size={10}
                                className="group-hover:animate-pulse"
                                style={{ color: brandColor, opacity: 0.75 }}
                            />
                        )}
                    </div>
                    <span className="hidden sm:inline text-[9px] font-mono text-zinc-400 tracking-wider">
                        {channelTag}
                    </span>
                </div>
                <p className={`font-bold text-sm md:text-base truncate transition-colors ${
                    isPowered ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-200'
                }`}>
                    {value}
                </p>
            </div>
        </a>
        {extraAction && (
            <div className="relative z-20 flex-shrink-0">
                {extraAction}
            </div>
        )}
    </div>
);
