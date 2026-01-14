import { useState, useLayoutEffect } from 'react';

const useMobileDetect = () => {
    // Initialize with mobile check on mount to prevent hydration mismatches
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            const isMobileWidth = window.innerWidth <= 768;
            const isTouchDevice = (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
            );
            return isMobileWidth || isTouchDevice;
        }
        return false;
    });

    useLayoutEffect(() => {
        const checkMobile = () => {
            // Check for mobile screen width (768px is a common breakpoint for tablets/mobile)
            const isMobileWidth = window.innerWidth <= 768;
            
            // Check for touch capability
            const isTouchDevice = (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
            );
            
            // Consider it mobile if either condition is true
            setIsMobile(isMobileWidth || isTouchDevice);
        };

        // Check on mount
        checkMobile();

        // Listen for resize events
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export default useMobileDetect;
