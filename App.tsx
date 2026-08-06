
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';


import { usePageTracking } from './hooks/useAnalytics';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    usePageTracking();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    useEffect(() => {
        const consoleAscii = `
%c  ____  ____  __  __ _  __
 |  _ \\/ ___||  \\/  | |/ /
 | |_) \\___ \\| |\\/| | ' / 
 |  _ < ___) | |  | | . \\ 
 |_| \\_\\____/|_|  |_|_|\\_\\

%c     ⚡  Passionate about Hardware, IoT & EEE?
     🛠️  Let's collaborate or build projects!
     🚀  https://rsmk.me
`;
        console.log(consoleAscii, 'color: #00f2ff; font-weight: bold; font-family: monospace;', 'color: #ffae00; font-weight: bold;');
    }, []);

    return (
        <HelmetProvider>
            <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 0.8, smoothTouch: false, syncTouch: false }}>
                <Router>
                    <ScrollToTop />
                    <AnimatedRoutes />
                </Router>
            </ReactLenis>
        </HelmetProvider>
    );
};

export default App;
