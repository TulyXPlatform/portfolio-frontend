import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCalendarAlt } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

const API_BASE = import.meta.env.VITE_API_URL + '/api';
interface Project {
    id: number;
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

    useEffect(() => {
        axios.get(`${API_BASE}/projects/${id}`)
            .then(res => setProject(res.data))
            .catch(() => setProject({
                id: Number(id), title: 'Project Not Found', shortDescription: '', description: '',
                image: '', images: '', liveLink: '', githubLink: '', tags: '', createdAt: new Date().toISOString(),
            }))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingScreen />;

    if (!project) return null;

    const extraImages = project.images ? project.images.split(',').map(s => s.trim()).filter(Boolean) : [];
    const allImages = [project.image, ...extraImages].filter(Boolean);

    return (
        <div style={{ paddingTop: '2rem' }}>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="btn-ghost"
                style={{ marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Portfolio
            </button>

            {/* Hero image */}
            {project.image && (
                <div style={{
                    width: '100%', height: '400px', borderRadius: 'var(--radius)',
                    overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--card-border)'
                }}>
                    <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}

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

            {/* Image Gallery */}
            {allImages.length > 1 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Gallery</h2>
                    <div className="image-gallery">
                        {allImages.map((img, i) => (
                            <img key={i} src={img} alt={`Screenshot ${i + 1}`} className="gallery-img" loading="lazy" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
