import React from 'react';
import { Link } from 'react-router-dom';
import { PCBBackground } from '../components/PCBBackground';
import { Helmet } from 'react-helmet-async';
import { PROFILE } from '../constants';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300">
            <Helmet>
                <title>404 — Page Not Found | {PROFILE.name}</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <PCBBackground isPowered={true} />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-6">
                {/* Glitchy 404 Number */}
                <div className="mb-8 relative">
                    <div className="text-[120px] md:text-[200px] font-black leading-none select-none">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-900">4</span>
                        <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(0,242,255,0.5)]">0</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-900">4</span>
                    </div>
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] pointer-events-none bg-[length:100%_4px] opacity-30" />
                </div>

                <div className="mb-4">
                    <span className="text-xs font-mono text-cyan-500 tracking-[0.3em] uppercase">ERROR_CODE: MODULE_NOT_FOUND</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-gray-500 mb-10 max-w-md text-sm leading-relaxed">
                    The requested module could not be located in this system. It may have been moved, deleted, or the address may be incorrect.
                </p>

                <div className="flex gap-4 flex-wrap justify-center">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-wider rounded-sm hover:bg-white hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all"
                    >
                        Return Home
                    </Link>
                    <Link
                        to="/#projects"
                        className="px-8 py-3 border border-gray-700 text-gray-300 font-bold uppercase tracking-wider rounded-sm hover:border-cyan-500 hover:text-cyan-400 transition-all backdrop-blur-sm bg-black/50"
                    >
                        View Projects
                    </Link>
                </div>

                {/* Terminal readout */}
                <div className="mt-16 text-left bg-black/60 border border-gray-800 rounded-lg p-4 max-w-md w-full font-mono text-xs">
                    <div className="text-gray-600 mb-1">&gt; system.locate(requestedPath)</div>
                    <div className="text-red-400 mb-1">&gt; FATAL: No such file or directory</div>
                    <div className="text-gray-600 mb-1">&gt; system.suggest(alternatives)</div>
                    <div className="text-cyan-400">&gt; Try navigating to <span className="text-white">/</span> or <span className="text-white">/#projects</span></div>
                    <div className="mt-2 flex items-center gap-1">
                        <span className="text-green-500">➜</span>
                        <span className="w-2 h-4 bg-cyan-500 animate-pulse inline-block ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
