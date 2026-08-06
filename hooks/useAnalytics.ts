import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    trackPageView,
    trackSectionView,
    trackSectionDwell,
    trackScrollDepth
} from '../utils/analytics';

export interface SectionMap {
    [key: string]: string;
}

const DEFAULT_SECTIONS: SectionMap = {
    hero: 'Hero Banner',
    about: 'About Me',
    projects: 'Projects Showcase',
    skills: 'Skills Breadboard',
    certifications: 'Certifications',
    experience: 'Experience & Education Timeline',
    contact: 'Contact Uplink'
};

/**
 * Hook to automatically observe sections in view and record view count + dwell time
 */
export const useSectionObserver = (sections: SectionMap = DEFAULT_SECTIONS) => {
    const activeSectionRef = useRef<string | null>(null);
    const sectionStartTimes = useRef<{ [key: string]: number }>({});
    const observedSections = useRef<Set<string>>(new Set());

    useEffect(() => {
        const sectionIds = Object.keys(sections);
        const startTimes = sectionStartTimes.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id;
                    const sectionName = sections[sectionId] || sectionId;

                    if (entry.isIntersecting) {
                        // Section entered viewport
                        activeSectionRef.current = sectionId;
                        startTimes[sectionId] = Date.now();

                        // Fire Section View Event
                        trackSectionView(sectionId, sectionName);
                        observedSections.current.add(sectionId);
                    } else {
                        // Section exited viewport -> calculate dwell duration
                        if (startTimes[sectionId]) {
                            const durationSeconds = (Date.now() - startTimes[sectionId]) / 1000;
                            trackSectionDwell(sectionId, sectionName, durationSeconds);
                            delete startTimes[sectionId];
                        }
                    }
                });
            },
            {
                // Trigger when 20% of section is visible or within threshold
                threshold: 0.2,
                rootMargin: '-10% 0px -20% 0px'
            }
        );

        // Attach observer to DOM elements
        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // Cleanup on unmount: record remaining dwell times
        return () => {
            observer.disconnect();
            Object.keys(startTimes).forEach((sectionId) => {
                const durationSeconds = (Date.now() - startTimes[sectionId]) / 1000;
                const sectionName = sections[sectionId] || sectionId;
                trackSectionDwell(sectionId, sectionName, durationSeconds);
            });
        };
    }, [sections]);
};

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 90%, 100%)
 */
export const useScrollDepthTracking = () => {
    const trackedDepths = useRef<Set<number>>(new Set());

    useEffect(() => {
        const milestones = [25, 50, 75, 90, 100];

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) return;

            const currentDepth = Math.round((scrollTop / scrollHeight) * 100);

            milestones.forEach((milestone) => {
                if (currentDepth >= milestone && !trackedDepths.current.has(milestone)) {
                    trackedDepths.current.add(milestone);
                    trackScrollDepth(milestone);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
};

/**
 * Hook to track SPA route transitions
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname + location.search;
        trackPageView(path);
    }, [location]);
};
