import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL + '/api';
interface Post { id: number; title: string; summary: string; coverImage: string; createdAt: string; }

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE}/portfolio`)
            .then(res => setPosts(res.data.posts || []))
            .catch(() => setPosts([
                { id: 1, title: 'Getting Started with ASP.NET Core', summary: 'A guide to building Web APIs', coverImage: '', createdAt: new Date().toISOString() },
                { id: 2, title: 'React Hooks Explained', summary: 'Mastering useState, useEffect, and custom hooks', coverImage: '', createdAt: new Date().toISOString() },
            ]));
    }, []);

    return (
        <div style={{ paddingTop: '4rem' }}>
            <div className="section-header">
                <span className="section-tag">Writing</span>
                <h1 className="section-title">Blog Posts</h1>
                <div className="section-line" />
            </div>

            {posts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>No posts yet. Check back soon!</p>
            ) : (
                <div className="blog-grid">
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className="blog-card"
                            onClick={() => navigate(`/blog/${post.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && navigate(`/blog/${post.id}`)}
                        >
                            {post.coverImage
                                ? <img src={post.coverImage} alt={post.title} className="blog-cover" loading="lazy" />
                                : <div className="blog-cover-placeholder">✍</div>
                            }
                            <div className="blog-body">
                                <p className="blog-date">
                                    <FaCalendarAlt style={{ marginRight: '0.3rem' }} />
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <h2 className="blog-title">{post.title}</h2>
                                {post.summary && <p className="blog-summary">{post.summary}</p>}
                                <div style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    Read more <FaArrowRight />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;
