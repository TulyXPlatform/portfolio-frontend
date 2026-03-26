import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCalendarAlt, FaTimes, 
    FaImage, FaLaptopCode, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showCarouselView, setShowCarouselView] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Get all images
    const extraImages = project?.images 
        ? (typeof project.images === 'string' ? project.images.split(',').map(s => s.trim()).filter(Boolean) : project.images)
        : [];
    const allImages = project ? [project.image, ...extraImages].filter(Boolean) : [];

    const nextImage = () => {
        if (allImages.length === 0) return;
        setActiveImgIndex(prev => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        if (allImages.length === 0) return;
        setActiveImgIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    };

    // Auto-slide carousel
    useEffect(() => {
        if (!project || (!showCarouselView && project.liveLink && project.liveLink !== '#')) return;
        if (allImages.length <= 1) return;

        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [project, showCarouselView, allImages.length]);

    // Handle initial view
    useEffect(() => {
        if (project && (!project.liveLink || project.liveLink === '#')) {
            setShowCarouselView(true);
        }
    }, [project]);

    // Reset zoom when modal image changes
    useEffect(() => {
        setIsZoomed(false);
    }, [selectedImage]);

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

            {/* Interaction Mode Toggle */}
            {project.liveLink && project.liveLink !== '#' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button 
                        onClick={() => setShowCarouselView(false)}
                        className={`btn-ghost ${!showCarouselView ? 'active-tab-btn' : ''}`}
                        style={{ 
                            fontSize: '0.75rem', padding: '6px 16px',
                            background: !showCarouselView ? 'var(--primary)' : 'rgba(0,0,0,0.2)',
                            color: !showCarouselView ? '#000' : 'var(--text-muted)'
                        }}
                    >
                        <FaLaptopCode /> Live Preview
                    </button>
                    <button 
                        onClick={() => setShowCarouselView(true)}
                        className={`btn-ghost ${showCarouselView ? 'active-tab-btn' : ''}`}
                        style={{ 
                            fontSize: '0.75rem', padding: '6px 16px',
                            background: showCarouselView ? 'var(--primary)' : 'rgba(0,0,0,0.2)',
                            color: showCarouselView ? '#000' : 'var(--text-muted)'
                        }}
                    >
                        <FaImage /> Screen Shots
                    </button>
                    {!showCarouselView && (
                        <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                            Interactive window not loading? &nbsp;
                            <span 
                                onClick={() => setShowCarouselView(true)} 
                                style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Show images instead
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Live Interactive Window or Hero Carousel */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    width: '100%', height: project.liveLink && !showCarouselView ? '600px' : '500px', 
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden', border: '1px solid var(--card-border)',
                    background: 'var(--bg2)', position: 'relative'
                }}>
                    {!showCarouselView && project.liveLink && project.liveLink !== '#' ? (
                        <>
                            <div style={{
                                position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                                background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px',
                                fontSize: '0.7rem', color: 'var(--primary)', border: '1px solid var(--primary)',
                                pointerEvents: 'none', fontFamily: 'var(--font-mono)'
                            }}>
                                Interactive Live Preview
                            </div>
                            <object 
                                data={project.liveLink} 
                                style={{ width: '100%', height: '100%' }} 
                                aria-label={project.title}
                            >
                                {/* Browser fallback if object fails to load at all */}
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>Live preview is blocked or unavailable for this URL.</p>
                                    <button onClick={() => setShowCarouselView(true)} className="btn-primary">View Screenshots Instead</button>
                                </div>
                            </object>
                        </>
                    ) : allImages.length > 0 ? (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImgIndex}
                                    src={allImages[activeImgIndex]}
                                    alt={project.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                                    onClick={() => setSelectedImage(allImages[activeImgIndex])}
                                />
                            </AnimatePresence>
                            {/* Manual Controls */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        style={{
                                            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
                                            padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                                            backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        style={{
                                            position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
                                            padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                                            backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                            <div style={{
                                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '8px',
                                borderRadius: '20px', backdropFilter: 'blur(5px)', zIndex: 5
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
                        </>
                    ) : null}
                </div>
            </div>

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
                                onClick={() => {
                                    setActiveImgIndex(i);
                                    setSelectedImage(img);
                                }}
                                style={{
                                    cursor: 'pointer',
                                    border: i === activeImgIndex ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                    opacity: i === activeImgIndex ? 1 : 0.6,
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    objectFit: 'cover'
                                }}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            )}
            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '2rem'
                        }}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'absolute',
                                top: '2rem',
                                right: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 1001,
                                fontSize: '1.1rem'
                            }}
                        >
                            <FaTimes />
                        </motion.button>
                        <div style={{ 
                            width: '100%', height: '100%', 
                            display: isZoomed ? 'block' : 'flex', 
                            alignItems: 'center', justifyContent: 'center',
                            overflow: 'auto', padding: isZoomed ? '0' : '2rem',
                            textAlign: 'center'
                        }}>
                            <motion.img
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ 
                                    opacity: 1,
                                    cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                                }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                src={selectedImage}
                                alt="Full view"
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                style={{
                                    width: isZoomed ? '100%' : 'auto',
                                    height: isZoomed ? 'auto' : 'auto',
                                    maxWidth: isZoomed ? '1200px' : '90%',
                                    maxHeight: isZoomed ? 'none' : '90vh',
                                    objectFit: 'contain',
                                    borderRadius: isZoomed ? '0' : '12px',
                                    boxShadow: isZoomed ? 'none' : '0 0 50px rgba(0,0,0,0.5)',
                                    margin: isZoomed ? '0 auto' : '0',
                                    display: isZoomed ? 'block' : 'initial'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectDetails;
