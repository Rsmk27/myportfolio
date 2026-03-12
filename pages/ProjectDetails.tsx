import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, PROFILE, PCB_COLORS } from '../constants';
import { ArrowLeft, ExternalLink, Cpu, Image as ImageIcon, CheckCircle, Terminal, X, Play } from 'lucide-react';
import { PCBBackground } from '../components/PCBBackground';
import { Helmet } from 'react-helmet-async';

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const project = PROJECTS.find(p => p.id === id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Assume powered on state for inner pages or reuse the context if we had one. 
    // For now we pass true to background to keep it alive.
    const isPowered = true;

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-black text-gray-400 font-mono">
                <h1 className="text-4xl font-bold mb-4 text-red-500">404 // Project Not Found</h1>
                <p className="mb-8">The requested project module could not be initialized.</p>
                <Link to="/" className="px-6 py-2 border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-500/10 transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300">
            <Helmet>
                {/* Title — unique per project */}
                <title>{`${project.title} | ${PROFILE.name} Portfolio`}</title>

                {/* Primary SEO */}
                <meta name="description" content={(project.details || project.description).slice(0, 155) + ((project.details || project.description).length > 155 ? '\u2026' : '')} />
                <meta name="author" content={PROFILE.name} />
                <meta name="keywords" content={`${project.title}, ${project.tech.join(', ')}, ${PROFILE.name}, RSMK, Portfolio`} />
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <link rel="canonical" href={`https://rsmk.me/project/${project.id}`} />

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://rsmk.me/project/${project.id}`} />
                <meta property="og:site_name" content="Srinivasa Manikanta Portfolio" />
                <meta property="og:title" content={`${project.title} | ${PROFILE.name}`} />
                <meta property="og:description" content={(project.details || project.description).slice(0, 155) + '\u2026'} />
                <meta property="og:image" content={`https://rsmk.me${project.image}`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={`${project.title} project by ${PROFILE.name}`} />
                <meta property="og:locale" content="en_IN" />

                {/* Twitter / X */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SrinivasManik20" />
                <meta name="twitter:creator" content="@SrinivasManik20" />
                <meta name="twitter:title" content={`${project.title} | ${PROFILE.name}`} />
                <meta name="twitter:description" content={(project.details || project.description).slice(0, 155) + '\u2026'} />
                <meta name="twitter:image" content={`https://rsmk.me${project.image}`} />
                <meta name="twitter:image:alt" content={`${project.title} project by ${PROFILE.name}`} />

                {/* JSON-LD: SoftwareApplication per project */}
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": project.title,
                    "description": project.details || project.description,
                    "url": project.link || `https://rsmk.me/project/${project.id}`,
                    "image": `https://rsmk.me${project.image}`,
                    "author": { "@type": "Person", "name": PROFILE.name, "url": "https://rsmk.me" },
                    "keywords": project.tech.join(', '),
                    ...(project.award ? { "award": project.award } : {})
                })}</script>
            </Helmet>

            <PCBBackground isPowered={isPowered} />

            <div className="relative z-10 pt-24 pb-20 container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm text-cyan-500 hover:text-cyan-400 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>

                    {project.award && (
                        <div className="relative overflow-hidden shine-effect mb-4 inline-block px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg shadow-lg shadow-amber-500/10 backdrop-blur-sm">
                            <span className="relative z-10 text-amber-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                {project.award}
                            </span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-cyan-950/30 border border-cyan-900/50 rounded-full text-xs text-cyan-300">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left/Top: Hero Image & Key Features */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Main Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedImage(project.image)}
                            className="rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(0,242,255,0.1)] group relative aspect-video bg-[#050505] cursor-pointer"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            {/* Overlay Scanlines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none bg-[length:100%_2px,3px_100%]" />
                        </motion.div>

                        {/* Description */}
                        <div className="bg-[#0a0a0a]/80 backdrop-blur border border-gray-800 p-8 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <Terminal size={64} />
                            </div>
                            <h3 className="text-sm font-bold text-cyan-500 mb-4 tracking-widest uppercase flex items-center gap-2">
                                <Cpu size={14} /> DESCRIPTION
                            </h3>
                            <p className="text-lg leading-relaxed text-gray-300">
                                {project.details || project.description}
                            </p>

                            {project.link && (
                                <div className="mt-8 pt-8 border-t border-gray-800">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]"
                                    >
                                        <span>CHECK LIVE</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                                    <ImageIcon size={14} /> GALLERY
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.gallery.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            onClick={() => setSelectedImage(img)}
                                            className="rounded-lg overflow-hidden border border-gray-800 relative group aspect-video bg-black cursor-pointer"
                                        >
                                            {img.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <div className="relative w-full h-full">
                                                    <video
                                                        src={img}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                                                        muted
                                                        playsInline
                                                        onMouseOver={e => e.currentTarget.play()}
                                                        onMouseOut={e => e.currentTarget.pause()}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                                        <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20">
                                                            <Play size={24} className="text-white fill-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right/Sidebar: Specs & Features */}
                    <div className="space-y-8">
                        {project.features && (
                            <div className="p-6 border border-cyan-900/30 bg-cyan-950/10 rounded-xl">
                                <h3 className="text-xs font-bold text-cyan-400 mb-6 tracking-widest uppercase">
                                    KEY FEATURES
                                </h3>
                                <div className="space-y-4">
                                    {project.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="text-cyan-500 flex-shrink-0 mt-0.5">
                                                <CheckCircle size={14} />
                                            </div>
                                            <p className="text-sm text-gray-400 leading-snug">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-6 border border-gray-800 bg-[#0a0a0a] rounded-xl">
                            <h3 className="text-xs font-bold text-gray-500 mb-6 tracking-widest uppercase">
                                TECH STACK
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((t, i) => (
                                    <div key={i} className="px-2 py-1 bg-gray-900 text-gray-500 text-xs font-mono rounded border border-gray-800">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full border border-gray-800 transition-colors"
                        >
                            <X size={24} />
                        </motion.button>

                        {selectedImage.match(/\.(mp4|webm|ogg)$/i) ? (
                            <motion.video
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={selectedImage}
                                controls
                                autoPlay
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={selectedImage}
                                alt="Preview"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectDetails;
