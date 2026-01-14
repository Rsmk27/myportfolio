import { useState, useEffect } from 'react';

const useMobileDetect = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
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
