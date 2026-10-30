/**
 * utils/chatbotWarmup.ts
 *
 * Real-time Chatbot Backend Warmup System for rsmk.tech
 *
 * Automatically triggers a low-priority, non-blocking wake-up ping to the
 * Render backend hosting the AI chatbot service as soon as any visitor enters
 * the portfolio website.
 *
 * Benefits:
 * - Eliminates free-tier Render container sleep delays (cold start: ~20-30s)
 *   while the user is browsing the hero, about, projects, and skills sections.
 * - By the time the user scrolls to the Contact terminal, the AI backend
 *   is pre-warmed and returns instant responses.
 * - Protects against redundant requests using a 10-minute session cooldown.
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Configuration ────────────────────────────────────────────────────────────

export const AI_SERVER_BASE_URL = 'https://project-mani-c0t3.onrender.com';
export const AI_CHAT_API_URL = `${AI_SERVER_BASE_URL}/api/chat`;

export const WARMUP_STORAGE_KEY = 'rsmk_ai_warmup_ts';
export const WARMUP_STATUS_KEY = 'rsmk_ai_warmup_status';

/**
 * Render free-tier containers idle out after 15 minutes.
 * We consider the server warm for 10 minutes after a successful ping.
 */
export const WARMUP_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export type WarmupStatus = 'idle' | 'warming' | 'ready' | 'error';

// ─── In-Memory Singleton State ─────────────────────────────────────────────────

let currentStatus: WarmupStatus = 'idle';
let activePingPromise: Promise<WarmupStatus> | null = null;
const listeners = new Set<(status: WarmupStatus) => void>();

function setStatus(next: WarmupStatus) {
    if (currentStatus === next) return;
    currentStatus = next;
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem(WARMUP_STATUS_KEY, next);
        } catch {
            // Ignore storage access errors
        }
    }
    listeners.forEach(fn => {
        try {
            fn(next);
        } catch (err) {
            console.error('[ChatbotWarmup] Listener error:', err);
        }
    });
}

/**
 * Checks if a recent warmup ping has been dispatched within the cooldown window.
 */
export function isRecentlyWarmed(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const storedTs = sessionStorage.getItem(WARMUP_STORAGE_KEY);
        if (!storedTs) return false;
        const diff = Date.now() - parseInt(storedTs, 10);
        return diff >= 0 && diff < WARMUP_COOLDOWN_MS;
    } catch {
        return false;
    }
}

/**
 * Returns current warmup status.
 */
export function getWarmupStatus(): WarmupStatus {
    if (currentStatus !== 'idle') return currentStatus;
    if (typeof window !== 'undefined') {
        try {
            const stored = sessionStorage.getItem(WARMUP_STATUS_KEY) as WarmupStatus | null;
            if (stored && ['warming', 'ready', 'error'].includes(stored)) {
                if (stored === 'ready' && !isRecentlyWarmed()) {
                    return 'idle';
                }
                currentStatus = stored;
                return stored;
            }
        } catch {
            // Ignore storage error
        }
    }
    return currentStatus;
}

/**
 * Subscribe to warmup status updates.
 */
export function subscribeWarmupStatus(cb: (status: WarmupStatus) => void): () => void {
    listeners.add(cb);
    // Immediately invoke with current status
    cb(getWarmupStatus());
    return () => {
        listeners.delete(cb);
    };
}

/**
 * Dispatches the wake-up ping to the Render chatbot backend.
 * Non-blocking, fails gracefully, and logs status to console.
 */
export async function triggerChatbotWarmup(options?: {
    force?: boolean;
    source?: string;
}): Promise<WarmupStatus> {
    if (typeof window === 'undefined') return 'idle';

    // If already in flight, reuse existing promise
    if (activePingPromise) {
        return activePingPromise;
    }

    // Check if recently warmed up unless forced
    if (!options?.force && isRecentlyWarmed()) {
        const stored = (sessionStorage.getItem(WARMUP_STATUS_KEY) as WarmupStatus) || 'ready';
        setStatus(stored);
        return stored;
    }

    setStatus('warming');

    const sourceTag = options?.source ? ` (via ${options.source})` : '';
    if (import.meta.env.DEV) {
        console.log(
            '%c[RSMK AI]%c Waking up chatbot neural uplink on site entry' + sourceTag + '...',
            'color: #00f2ff; font-weight: bold;',
            'color: #9ca3af;'
        );
    }

    activePingPromise = (async () => {
        const controller = new AbortController();
        // Give Render cold-start enough time to respond without hanging forever
        const timeoutId = window.setTimeout(() => controller.abort(), 45000);

        try {
            // Send low-priority background ping to the server root endpoint
            const res = await fetch(AI_SERVER_BASE_URL, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-store',
                signal: controller.signal,
                // Priority hint for browsers that support it
                // @ts-expect-error fetch priority is supported in modern Chrome/Edge/Firefox
                priority: 'low',
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                sessionStorage.setItem(WARMUP_STORAGE_KEY, String(Date.now()));
                setStatus('ready');
                if (import.meta.env.DEV) {
                    console.log(
                        '%c[RSMK AI]%c Chatbot backend is online & pre-warmed!',
                        'color: #10b981; font-weight: bold;',
                        'color: #9ca3af;'
                    );
                }
                return 'ready';
            } else {
                // Server responded (meaning it is awake) even if non-200
                sessionStorage.setItem(WARMUP_STORAGE_KEY, String(Date.now()));
                setStatus('ready');
                return 'ready';
            }
        } catch (err) {
            clearTimeout(timeoutId);

            // If aborted or network exception occurred, Render still likely received the TCP handshake
            // and began dyno spinup, so record timestamp to prevent flood
            sessionStorage.setItem(WARMUP_STORAGE_KEY, String(Date.now()));

            const isAbort = (err as Error)?.name === 'AbortError';
            if (isAbort) {
                // Aborted after 45s: Server is either still compiling or took longer, but was pinged
                setStatus('warming');
                return 'warming';
            }

            setStatus('error');
            return 'error';
        } finally {
            activePingPromise = null;
        }
    })();

    return activePingPromise;
}

/**
 * Initializes warmup automatically on site entry.
 * Uses requestIdleCallback or a micro-delay to never compete with critical page rendering.
 */
export function initChatbotWarmup(): void {
    if (typeof window === 'undefined') return;

    const startPing = () => {
        triggerChatbotWarmup({ source: 'site_entry' });
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => startPing(), { timeout: 1500 });
    } else {
        window.setTimeout(startPing, 200);
    }
}

/**
 * React Hook for components needing real-time chatbot warmup state.
 */
export function useChatbotWarmup() {
    const [status, setLocalStatus] = useState<WarmupStatus>(() => getWarmupStatus());

    useEffect(() => {
        return subscribeWarmupStatus(setLocalStatus);
    }, []);

    const trigger = useCallback((options?: { force?: boolean }) => {
        return triggerChatbotWarmup(options);
    }, []);

    return {
        status,
        isWarming: status === 'warming',
        isReady: status === 'ready',
        isError: status === 'error',
        triggerWarmup: trigger,
    };
}
