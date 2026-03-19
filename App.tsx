
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';

const ScrollToTop = () => {
    const { pathname } = useLocation();
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
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <AnimatedRoutes />
            </Router>
        </HelmetProvider>
    );
};

export default App;
