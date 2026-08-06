/**
 * Analytics Utility for Google Analytics 4 (GA4) & Microsoft Clarity
 * 
 * Facilitates custom section viewing tracking, dwell time monitoring,
 * scroll depth logging, and interactive user action analytics.
 */

export const GA_MEASUREMENT_ID = 'G-44KP7M10FT';
export const CLARITY_ID = 'xu4xh3aqb9';

/**
 * Safely invokes Google Analytics (gtag.js)
 */
export const sendGAEvent = (eventName: string, params: Record<string, any> = {}) => {
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    } catch (err) {
        console.warn('[GA4] Event dispatch error:', err);
    }
};

/**
 * Safely invokes Microsoft Clarity API
 */
export const sendClarityEvent = (eventName: string) => {
    try {
        if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
            window.clarity('event', eventName);
        }
    } catch (err) {
        console.warn('[Clarity] Event dispatch error:', err);
    }
};

/**
 * Sets a custom tag key-value pair in Microsoft Clarity
 */
export const setClarityTag = (key: string, value: string) => {
    try {
        if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
            window.clarity('set', key, value);
        }
    } catch (err) {
        console.warn('[Clarity] Tag set error:', err);
    }
};

/**
 * Triggers a Microsoft Clarity session upgrade / snapshot refresh for key user actions or route updates
 */
export const upgradeClaritySession = (reason: string) => {
    try {
        if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
            window.clarity('upgrade', reason);
        }
    } catch (err) {
        console.warn('[Clarity] Session upgrade error:', err);
    }
};

/**
 * Track SPA Page View across GA4 and Clarity
 */
export const trackPageView = (path: string, title?: string) => {
    const pageTitle = title || document.title;
    
    // GA4 Page View
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            page_title: pageTitle,
        });
        window.gtag('event', 'page_view', {
            page_location: window.location.href,
            page_path: path,
            page_title: pageTitle,
        });
    }

    // Clarity Tag & Snapshot Refresh
    setClarityTag('page_path', path);
    sendClarityEvent(`page_view_${path.replace(/[^a-zA-Z0-9]/g, '_')}`);
    upgradeClaritySession(`route_${path.replace(/[^a-zA-Z0-9]/g, '_')}`);
};

/**
 * Track Section View (Fired when a user scrolls into a specific section)
 */
export const trackSectionView = (sectionId: string, sectionName: string) => {
    // GA4 Custom Event
    sendGAEvent('section_view', {
        section_id: sectionId,
        section_name: sectionName,
        timestamp: new Date().toISOString(),
    });

    // Clarity Custom Tag & Event
    setClarityTag('active_section', sectionId);
    sendClarityEvent(`section_view_${sectionId}`);
};

/**
 * Track Section Dwell Time (How many seconds the user spent viewing the section)
 */
export const trackSectionDwell = (sectionId: string, sectionName: string, durationSeconds: number) => {
    // Only log meaningful dwell durations (> 1 second)
    if (durationSeconds < 1) return;

    const roundedSeconds = Math.round(durationSeconds);

    // GA4 Dwell Event
    sendGAEvent('section_dwell', {
        section_id: sectionId,
        section_name: sectionName,
        duration_seconds: roundedSeconds,
    });

    // Clarity Custom Event
    sendClarityEvent(`section_dwell_${sectionId}`);
};

/**
 * Track Scroll Depth Milestones (25%, 50%, 75%, 90%, 100%)
 */
export const trackScrollDepth = (depthPercentage: number) => {
    sendGAEvent('scroll_depth', {
        depth_percentage: depthPercentage,
    });

    sendClarityEvent(`scroll_${depthPercentage}_percent`);
};

/**
 * Track General User Interactions (Buttons, Links, Downloads, Modals)
 */
export const trackInteraction = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    sendGAEvent(action, {
        event_category: category,
        event_label: label,
        value: value,
    });

    sendClarityEvent(`${category}_${action}`);
};
