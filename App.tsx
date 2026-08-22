
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { CustomCursor } from './components/CustomCursor';
import { usePageTracking } from './hooks/useAnalytics';

const Gallery = lazy(() => import('./pages/Gallery'));

const ScrollToTop = () => {
    const { pathname } = useLocation();
    usePageTracking();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const PageFallback = () => (
    <div className="min-h-screen bg-[#080806] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase">LOADING...</span>
        </div>
    </div>
);

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
                <Suspense fallback={<PageFallback />}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
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
            <CustomCursor />
            <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 0.8, syncTouch: false }}>
                <Router>
                    <ScrollToTop />
                    <AnimatedRoutes />
                </Router>
            </ReactLenis>
        </HelmetProvider>
    );
};

export default App;
