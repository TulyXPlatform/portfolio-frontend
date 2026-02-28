import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

const API_BASE = import.meta.env.VITE_API_URL + '/api';
interface Post { id: number; title: string; summary: string; content: string; coverImage: string; createdAt: string; }

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/posts/${id}`)
            .then(res => setPost(res.data))
            .catch(() => setPost({
                id: Number(id), title: 'Post not found', summary: '', content: 'The post could not be loaded.',
                coverImage: '', createdAt: new Date().toISOString(),
            }))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingScreen />;

    if (!post) return null;

    return (
        <div style={{ paddingTop: '2rem' }}>
            <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '2rem' }}>
                <FaArrowLeft /> Back to Blog
            </button>

            {/* Cover image */}
            {post.coverImage && (
                <div style={{
                    width: '100%', height: '400px', borderRadius: 'var(--radius)',
                    overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid var(--card-border)'
                }}>
                    <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <div className="glass blog-post-content">
                <p className="blog-date" style={{ marginBottom: '1rem' }}>
                    <FaCalendarAlt style={{ marginRight: '0.4rem' }} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                    {post.title}
                </h1>
                {post.summary && (
                    <p style={{ color: 'var(--primary)', fontSize: '1.05rem', marginBottom: '2rem', fontWeight: 500, lineHeight: 1.6 }}>
                        {post.summary}
                    </p>
                )}
                <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', marginBottom: '2rem' }} />
                <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: '1.9' }}>
                    {post.content}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
