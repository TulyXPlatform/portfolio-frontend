import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCalendarAlt } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

const API_BASE = import.meta.env.VITE_API_URL + '/api';
interface Project {
    id: string | number;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    images: string;
    liveLink: string;
    githubLink: string;
    tags: string;
    createdAt: string;
}

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    useEffect(() => {
        axios.get(`${API_BASE}/projects/${id}`)
            .then(res => setProject(res.data))
            .catch(() => setProject({
                id: id || '', title: 'Project Not Found', shortDescription: '', description: '',
                image: '', images: '', liveLink: '', githubLink: '', tags: '', createdAt: new Date().toISOString(),
            }))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingScreen />;

    if (!project) return null;

    const extraImages = project.images 
        ? (typeof project.images === 'string' ? project.images.split(',').map(s => s.trim()).filter(Boolean) : project.images)
        : [];
    const allImages = [project.image, ...extraImages].filter(Boolean);

    const handleBackToProjects = () => {
        navigate('/#projects-section');
    };

    return (
        <div style={{ paddingTop: '2rem' }}>
            {/* Back button */}
            <button
                onClick={handleBackToProjects}
                className="btn-ghost"
                style={{ marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Portfolio
            </button>

            {/* Live Interactive Window or Hero Carousel */}
            {project.liveLink && project.liveLink !== '#' ? (
                <div style={{
                    width: '100%', height: '600px', borderRadius: 'var(--radius)',
                    overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--card-border)',
                    background: '#000', position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                        background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.7rem', color: 'var(--primary)', border: '1px solid var(--primary)',
                        pointerEvents: 'none', fontFamily: 'var(--font-mono)'
                    }}>
                        Interactive Live Preview
                    </div>
                    <object data={project.liveLink} style={{ width: '100%', height: '100%' }} aria-label={project.title} />
                </div>
            ) : allImages.length > 0 ? (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '100%', height: '500px', borderRadius: 'var(--radius)',
                        overflow: 'hidden', border: '1px solid var(--card-border)',
                        background: 'var(--bg2)', position: 'relative'
                    }}>
                        <img
                            src={allImages[activeImgIndex]}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        {allImages.length > 1 && (
                            <div style={{
                                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '8px',
                                borderRadius: '20px', backdropFilter: 'blur(5px)'
                            }}>
                                {allImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImgIndex(i)}
                                        style={{
                                            width: '10px', height: '10px', borderRadius: '50%', border: 'none',
                                            background: i === activeImgIndex ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                                            cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Content */}
            <div className="glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                {/* Tags */}
                {project.tags && (
                    <div className="project-tags" style={{ marginBottom: '1rem' }}>
                        {project.tags.split(',').map((t, i) => (
                            <span key={i} className="project-tag">{t.trim()}</span>
                        ))}
                    </div>
                )}

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
                    {project.title}
                </h1>

                {project.shortDescription && (
                    <p style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                        {project.shortDescription}
                    </p>
                )}

                {project.createdAt && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '2rem' }}>
                        <FaCalendarAlt style={{ marginRight: '0.4rem' }} />
                        {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    {project.liveLink && project.liveLink !== '#' && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn-primary">
                            <FaExternalLinkAlt /> Live Demo
                        </a>
                    )}
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-ghost">
                            <FaGithub /> View Code
                        </a>
                    )}
                </div>

                {/* Full description */}
                {project.description && (
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                            About This Project
                        </h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                            {project.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Image Gallery (Thumbs) */}
            {allImages.length > 1 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Gallery</h2>
                    <div className="image-gallery">
                        {allImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Screenshot ${i + 1}`}
                                className={`gallery-img ${i === activeImgIndex ? 'active-thumb' : ''}`}
                                onClick={() => setActiveImgIndex(i)}
                                style={{
                                    cursor: 'pointer',
                                    border: i === activeImgIndex ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                    opacity: i === activeImgIndex ? 1 : 0.6
                                }}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
