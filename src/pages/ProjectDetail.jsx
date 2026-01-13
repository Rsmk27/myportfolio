import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projects';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fadeInUp, staggerContainer } from '../utils/animations';

const ProjectDetail = () => {
    const { id } = useParams();
    const project = projectsData[id];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <>
                <Header />
                <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Project Not Found</h2>
                    <p>The project you are looking for does not exist or is under construction.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* 1. Project Hero */}
            <section className="project-page-header">
                <motion.div
                    className="container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={staggerContainer}
                >
                    <motion.span className="mono text-accent" variants={fadeInUp}>{project.category}</motion.span>
                    <motion.h1 className="project-title" style={{ fontSize: '3rem', marginTop: '1rem' }} variants={fadeInUp}>{project.title}</motion.h1>
                    <motion.p className="project-tagline" variants={fadeInUp}>
                        {project.tagline}
                    </motion.p>

                    <motion.div className="project-tech-stack" style={{ justifyContent: 'center', border: 'none', padding: 0, margin: '2rem 0' }} variants={fadeInUp}>
                        {project.techStack.map((tech, index) => (
                            <span key={index} className="tech-pill">{tech}</span>
                        ))}
                    </motion.div>

                    <motion.div className="project-actions" style={{ justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }} variants={fadeInUp}>
                        {project.actions.map((action, index) => (
                            <a key={index} href={action.link} target="_blank" rel="noreferrer" className="action-btn">
                                <i className={action.icon}></i> {action.label}
                            </a>
                        ))}
                    </motion.div>

                    <motion.div className="project-image-container"
                        style={{ maxWidth: '800px', height: '400px', margin: '4rem auto -120px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                        variants={fadeInUp}
                    >
                        <img src={project.heroImage} 
                             alt={`${project.title} - ${project.tagline}`}
                             width="800"
                             height="400"
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                </motion.div>
            </section>

            {/* Report Content */}
            <div className="project-report-container">
                {project.sections.map((section, index) => (
                    <motion.section
                        key={index}
                        className="report-section"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={fadeInUp}
                    >
                        <h2>{section.title}</h2>
                        {section.content && (
                            <p dangerouslySetInnerHTML={{ __html: section.content }}></p>
                        )}

                        {/* Diagram Type */}
                        {section.type === 'diagram' && (
                            <div className="architecture-diagram">
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', padding: '2rem', flexWrap: 'wrap' }}>
                                    {section.diagramItems.map((item, i) => (
                                        <React.Fragment key={i}>
                                            <div className="diagram-block">{item}</div>
                                            {i < section.diagramItems.length - 1 && (
                                                item === "+" ? <i className="fas fa-plus margin-horizontal-sm"></i> : <i className="fas fa-arrow-right text-accent"></i>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {section.diagramCaption && (
                                    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>{section.diagramCaption}</p>
                                )}
                            </div>
                        )}

                        {/* Grid Type (Implementation) */}
                        {section.type === 'grid' && (
                            <div className="tech-implementation-grid">
                                {section.gridItems.map((item, i) => (
                                    <div key={i} className="tech-block">
                                        <h4><i className={item.icon}></i> {item.title}</h4>
                                        <p dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stats Type */}
                        {section.type === 'stats' && (
                            <>
                                <div className="results-grid">
                                    {section.stats.map((stat, i) => (
                                        <div key={i} className="result-stat">
                                            <span className="stat-value">{stat.value}</span>
                                            <span className="stat-label">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                                {section.description && (
                                    <p style={{ marginTop: '2rem', textAlign: 'center' }}>{section.description}</p>
                                )}
                            </>
                        )}

                        {/* Challenges Type */}
                        {section.type === 'challenges' && section.challenges.map((challenge, i) => (
                            <div key={i} className="challenge-card">
                                <span className="challenge-title">{challenge.title}</span>
                                <p>{challenge.problem}</p>
                                <p><strong>Solution:</strong> {challenge.solution}</p>
                            </div>
                        ))}

                        {/* List Type (Future) */}
                        {section.type === 'list' && (
                            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginLeft: '1.5rem' }}>
                                {section.items.map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
                                ))}
                            </ul>
                        )}

                        {/* Actions Type (Resources) */}
                        {section.type === 'actions' && (
                            <div className="project-actions" style={{ justifyContent: 'flex-start' }}>
                                {section.actions.map((action, i) => (
                                    <a key={i} href={action.link} className="action-btn" target="_blank" rel="noreferrer">
                                        <i className={action.icon}></i> {action.label}
                                    </a>
                                ))}
                            </div>
                        )}

                    </motion.section>
                ))}

                {/* CTA */}
                {project.cta && (
                    <motion.div
                        className="project-cta-block"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <h3>{project.cta.title}</h3>
                        <p>{project.cta.text}</p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link to="/#contact" className="btn btn-primary">Contact Me</Link>
                        </div>
                    </motion.div>
                )}

            </div>

            <Footer />
        </>
    );
};

export default ProjectDetail;
