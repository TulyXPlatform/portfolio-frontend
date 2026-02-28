import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import {
    FaGithub, FaLinkedin, FaFacebook, FaWhatsapp,
    FaEnvelope, FaExternalLinkAlt, FaDownload,
    FaTerminal, FaArrowDown, FaChevronDown, FaChevronUp,
    FaGlobeAsia, FaCalendarAlt, FaArrowRight
} from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

// ─── Types ────────────────────────────────────────────────
interface SocialLink { id: number; platform: string; url: string; }
interface Skill { id: number; name: string; logo: string; category: string; }
interface Project { id: number; title: string; shortDescription: string; image: string; liveLink: string; githubLink: string; tags: string; }
interface BlogPost { id: number; title: string; summary: string; coverImage: string; createdAt: string; }
interface Experience { id: number; title: string; organization: string; startDate: string; endDate: string; description: string; }

interface PortfolioData {
    socialLinks: SocialLink[];
    skills: Skill[];
    projects: Project[];
    posts: BlogPost[];
    experiences: Experience[];
    cvLink: string;
}

interface HomeProps { onSocialLinks: (links: SocialLink[]) => void; }

const API_BASE = import.meta.env.VITE_API_URL + '/api';
const MOCK_DATA: PortfolioData = {
    socialLinks: [
        { id: 1, platform: 'github', url: 'https://github.com/' },
        { id: 2, platform: 'linkedin', url: 'https://linkedin.com/in/' },
        { id: 3, platform: 'bdjobs', url: 'https://bdjobs.com/' },
        { id: 4, platform: 'facebook', url: 'https://facebook.com/' },
        { id: 5, platform: 'gmail', url: 'mailto:tamima@gmail.com' },
        { id: 6, platform: 'whatsapp', url: 'https://wa.me/880' },
    ],
    skills: [
        { id: 1, name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'frontend' },
        { id: 2, name: 'ASP.NET Core', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg', category: 'backend' },
        { id: 3, name: 'C#', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', category: 'programming' },
        { id: 4, name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', category: 'frontend' },
        { id: 5, name: 'MS SQL Server', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', category: 'tech_tools' },
        { id: 6, name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'programming' },
        { id: 7, name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'frontend' },
        { id: 8, name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', category: 'frontend' },
        { id: 9, name: 'Blazor', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blazor/blazor-original.svg', category: 'frontend' },
        { id: 10, name: 'MAUI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg', category: 'frontend' },
        { id: 11, name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', category: 'tech_tools' },
        { id: 12, name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'programming' },
    ],
    projects: [
        { id: 1, title: 'Portfolio Website', shortDescription: 'My personal portfolio with seasonal themes', image: '', liveLink: '#', githubLink: 'https://github.com/', tags: 'React,TypeScript,Node.js' },
    ],
    posts: [
        { id: 1, title: 'Getting Started with ASP.NET Core', summary: 'A beginner guide to building Web APIs', coverImage: '', createdAt: new Date().toISOString() },
        { id: 2, title: 'React Hooks Explained', summary: 'Mastering useState, useEffect, and custom hooks', coverImage: '', createdAt: new Date().toISOString() },
    ],
    experiences: [{
        id: 1, title: 'Trainee — Cross Platform Apps',
        organization: 'IsDB-BISEW IT Scholarship Programme',
        startDate: 'Jan 2025', endDate: 'Present',
        description: `1. Design and implement databases with MS SQL Server 2019 and 2022 EE
2. Programming with C# 7 and .Net 5
3. Programming in HTML5 with JavaScript & CSS3
4. Introduction to XML, ADO.NET & Reporting
5. Developing ASP.NET MVC 5 Web Applications
6. Entity Framework 6 Code First using ASP.NET MVC 5
7. Developing ASP.NET Core Web Applications
8. Entity Framework Core Code First using ASP.NET Core
9. Developing Web APIs, Windows Azure and Web Services using ASP.NET MVC 5
10. Developing Web APIs using ASP.NET Core
11. Advanced Web Application Development with Angular
12. Advanced Web Application Development with Blazor Server & Web Assembly
13. Developing Cross Platform Mobile Applications using MAUI`
    }],
    cvLink: '/cv.pdf',
};

// ─── Social Icon Map ─────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
    github: <FaGithub />,
    linkedin: <FaLinkedin />,
    facebook: <FaFacebook />,
    whatsapp: <FaWhatsapp />,
    gmail: <FaEnvelope />,
    bdjobs: <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>BDJ</span>,
};

const platformLabel: Record<string, string> = {
    github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook',
    whatsapp: 'WhatsApp', gmail: 'Email', bdjobs: 'BDjobs',
};

// ─── CLI Engine ────────────────────────────────────────────
interface CliLine { text: string; type: 'cmd' | 'out' | 'err' | 'inf' | 'dim'; }

const buildCliResponse = (cmd: string, data: PortfolioData): CliLine[] => {
    const c = cmd.trim().toLowerCase();

    if (c === 'help' || c === 'npm help') {
        return [
            { text: 'Available commands:', type: 'inf' },
            { text: '  npm list work-experience  — Show work experience', type: 'out' },
            { text: '  npm list skills           — Show all skills', type: 'out' },
            { text: '  npm list projects         — Show all projects', type: 'out' },
            { text: '  npm list blog             — Show blog posts', type: 'out' },
            { text: '  npm about                 — About Tamima', type: 'out' },
            { text: '  npm contact               — Contact info', type: 'out' },
            { text: '  clear                     — Clear terminal', type: 'out' },
            { text: '', type: 'dim' },
            { text: 'Sections: experience | projects | skills | blog', type: 'dim' },
        ];
    }

    if (c === 'npm list work-experience') {
        const lines: CliLine[] = [
            { text: '> work-experience@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
        ];
        data.experiences.forEach(exp => {
            lines.push({ text: `  📌 ${exp.title}`, type: 'out' });
            lines.push({ text: `     🏢 ${exp.organization}`, type: 'dim' });
            lines.push({ text: `     📅 ${exp.startDate} → ${exp.endDate}`, type: 'dim' });
            lines.push({ text: '', type: 'dim' });
        });
        lines.push({ text: `  Type "experience" to navigate to full section`, type: 'inf' });
        return lines;
    }

    if (c === 'npm list skills') {
        const cats = ['programming', 'frontend', 'backend', 'tech_tools'];
        const labels: Record<string, string> = { programming: 'Programming', frontend: 'Frontend', backend: 'Backend', tech_tools: 'Tech & Tools' };
        const out: CliLine[] = [
            { text: '> skills@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
        ];
        cats.forEach(c => {
            const list = data.skills.filter(s => s.category === c);
            if (list.length > 0) {
                out.push({ text: `  � ${labels[c]}:`, type: 'out' });
                out.push({ text: `     ${list.map(s => s.name).join(' · ')}`, type: 'dim' });
                out.push({ text: '', type: 'dim' });
            }
        });
        out.push({ text: `  ${data.skills.length} skills listed`, type: 'inf' });
        return out;
    }

    if (c === 'npm list projects') {
        const lines: CliLine[] = [
            { text: '> projects@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
        ];
        data.projects.forEach((p, i) => {
            lines.push({ text: `  ${i + 1}. ${p.title}`, type: 'out' });
            if (p.shortDescription) lines.push({ text: `     ${p.shortDescription}`, type: 'dim' });
            if (p.tags) lines.push({ text: `     [${p.tags}]`, type: 'inf' });
            lines.push({ text: '', type: 'dim' });
        });
        lines.push({ text: '  Scroll to Projects section to see full cards', type: 'inf' });
        return lines;
    }

    if (c === 'npm list blog') {
        const lines: CliLine[] = [
            { text: '> blog@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
        ];
        data.posts.forEach((p, i) => {
            lines.push({ text: `  ${i + 1}. ${p.title}`, type: 'out' });
            if (p.summary) lines.push({ text: `     ${p.summary}`, type: 'dim' });
            lines.push({ text: '', type: 'dim' });
        });
        return lines;
    }

    if (c === 'npm about' || c === 'about') {
        return [
            { text: '> about@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
            { text: '  👩‍💻 Tamima Mollick Tuly', type: 'out' },
            { text: '  🎓 Trainee at IsDB-BISEW IT Scholarship Programme', type: 'out' },
            { text: '  🌐 Specializing in Full-Stack Web Development', type: 'out' },
            { text: '  🛠  ASP.NET | React | Angular | MS SQL | Blazor | MAUI', type: 'out' },
            { text: '  📍 Bangladesh', type: 'dim' },
        ];
    }

    if (c === 'npm contact' || c === 'contact') {
        const lines: CliLine[] = [
            { text: '> contact@1.0.0', type: 'inf' },
            { text: '', type: 'dim' },
        ];
        data.socialLinks.forEach(s => {
            lines.push({ text: `  ${platformLabel[s.platform.toLowerCase()] || s.platform}: ${s.url}`, type: 'out' });
        });
        return lines;
    }

    if (c === 'clear') return [];

    if (['experience', 'projects', 'skills', 'blog'].includes(c)) {
        setTimeout(() => {
            document.getElementById(`${c}-section`)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return [{ text: `  ↗ Scrolling to ${c} section...`, type: 'inf' }];
    }

    return [
        { text: `  ❌ Command not found: "${cmd}"`, type: 'err' },
        { text: `  Type "help" to see available commands.`, type: 'dim' },
    ];
};

// ─── HOME COMPONENT ───────────────────────────────────────
const Home: React.FC<HomeProps> = ({ onSocialLinks }) => {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [cliLines, setCliLines] = useState<CliLine[]>([
        { text: '  Welcome to Tamima\'s Portfolio CLI', type: 'inf' },
        { text: '  Type "help" to see available commands.', type: 'dim' },
    ]);
    const [cliInput, setCLIInput] = useState('');
    const [expandedExp, setExpandedExp] = useState<Record<number, boolean>>({});
    const cliBodyRef = useRef<HTMLDivElement>(null);
    const cliInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE}/portfolio`)
            .then(res => {
                setData(res.data);
                onSocialLinks(res.data.socialLinks || []);
            })
            .catch(err => {
                console.error('[portfolio] failed to load /api/portfolio', err);
                setFetchError(err.response?.data?.error || err.message);
                setData(MOCK_DATA);
                onSocialLinks(MOCK_DATA.socialLinks);
            });
    }, []);

    // Auto-scroll CLI
    useEffect(() => {
        if (cliBodyRef.current) {
            cliBodyRef.current.scrollTop = cliBodyRef.current.scrollHeight;
        }
    }, [cliLines]);

    const handleCliSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!cliInput.trim() || !data) return;

        const inputLine: CliLine = { text: `$ ${cliInput}`, type: 'cmd' };

        if (cliInput.trim().toLowerCase() === 'clear') {
            setCliLines([{ text: '  Terminal cleared.', type: 'dim' }]);
        } else {
            const response = buildCliResponse(cliInput, data);
            setCliLines(prev => [...prev, inputLine, ...response]);
        }
        setCLIInput('');
    }, [cliInput, data]);

    if (!data) {
        return <LoadingScreen />;
    }

    // show banner if data is mocked (fetch error or fallback)
    const showMockBanner = fetchError !== null;


    return (
        <>
            {/* show warning if API failed and we are using mock data */}
            {showMockBanner && (
              <div style={{ background: '#ffdddd', color: '#900', padding: '0.75rem', textAlign: 'center' }}>
                <strong>Warning:</strong> could not fetch portfolio data from API ({fetchError}).
                This site is displaying fallback content. Check the VITE_API_URL and CORS settings.
              </div>
            )}

            {/* ══════════════════════════════════
                HERO SECTION
                ══════════════════════════════════ */}
            <section id="hero-section" style={{ paddingTop: '0', paddingBottom: '0' }}>
                <div className="hero">
                    {/* Left: Identity + Social */}
                    <div className="hero-left">
                        <div>
                            <div className="hero-badge">
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-border 2s ease infinite' }} />
                                Available for opportunities
                            </div>
                        </div>

                        <div>
                            <h1 className="hero-title">
                                Hi, I'm <span className="gradient-text">Tamima Mollick Tuly</span>
                            </h1>
                            <p className="hero-subtitle">
                                Full-Stack Developer · Trainee at IsDB-BISEW<br />
                                Building cross-platform apps with React, ASP.NET, Angular & MAUI
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="social-grid">
                            {data.socialLinks.map(link => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-pill"
                                >
                                    {iconMap[link.platform.toLowerCase()] || <FaExternalLinkAlt />}
                                    {platformLabel[link.platform.toLowerCase()] || link.platform}
                                </a>
                            ))}

                            <a
                                href={data.cvLink || '/cv.pdf'}
                                className="cv-btn"
                                download
                                target="_blank"
                                rel="noreferrer"
                                style={{ marginTop: 0 }}
                            >
                                <FaDownload /> Download CV
                            </a>
                        </div>

                        {/* Scroll hint */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                            <FaArrowDown style={{ animation: 'fadeSlideUp 1.5s ease infinite alternate' }} />
                            Scroll to explore
                        </div>
                    </div>

                    {/* Right: CLI Playground */}
                    <div className="hero-right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                            <FaTerminal style={{ color: 'var(--primary)', fontSize: '0.9rem' }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Interactive CLI Playground — Try: <span style={{ color: 'var(--primary)' }}>npm list skills</span>
                            </span>
                        </div>

                        <div className="cli-container" onClick={() => cliInputRef.current?.focus()}>
                            {/* Title bar */}
                            <div className="cli-titlebar">
                                <div className="cli-dot red" />
                                <div className="cli-dot yellow" />
                                <div className="cli-dot green" />
                                <span className="cli-title">tamima@portfolio: ~/cli</span>
                            </div>

                            {/* Output area */}
                            <div className="cli-body" ref={cliBodyRef}>
                                {cliLines.map((line, i) => (
                                    <div
                                        key={i}
                                        className={`cli-history-line cli-${line.type}-line`}
                                    >
                                        {line.text}
                                    </div>
                                ))}
                            </div>

                            {/* Input row */}
                            <form className="cli-input-row" onSubmit={handleCliSubmit}>
                                <span className="cli-prompt">tamima@portfolio $</span>
                                <input
                                    ref={cliInputRef}
                                    className="cli-input"
                                    value={cliInput}
                                    onChange={e => setCLIInput(e.target.value)}
                                    placeholder="Type a command..."
                                    autoComplete="off"
                                    spellCheck={false}
                                    aria-label="CLI command input"
                                />
                            </form>
                        </div>

                        {/* Quick commands */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {['npm list skills', 'npm list projects', 'npm list work-experience', 'help', 'npm about'].map(cmd => (
                                <button
                                    key={cmd}
                                    onClick={() => {
                                        setCLIInput(cmd);
                                        setTimeout(() => {
                                            const resp = buildCliResponse(cmd, data);
                                            setCliLines(prev => [...prev, { text: `$ ${cmd}`, type: 'cmd' }, ...resp]);
                                            setCLIInput('');
                                        }, 50);
                                    }}
                                    style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid var(--card-border)',
                                        color: 'var(--primary)',
                                        padding: '4px 12px',
                                        borderRadius: '50px',
                                        fontSize: '0.72rem',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-mono)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--card-border)')}
                                >
                                    {cmd}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                EXPERIENCE SECTION
                ══════════════════════════════════ */}
            <section id="experience-section" className="section">
                <div className="section-header">
                    <span className="section-tag">My Journey</span>
                    <h2 className="section-title">Experience & Training</h2>
                    <div className="section-line" />
                </div>

                <div className="timeline">
                    {data.experiences.map(exp => (
                        <div key={exp.id} className="timeline-item glass">
                            <div className="timeline-dot" />
                            <div className="timeline-dates">
                                <FaCalendarAlt /> {exp.startDate} → {exp.endDate}
                            </div>
                            <h3 className="timeline-title">{exp.title}</h3>
                            <p className="timeline-org">
                                <FaGlobeAsia style={{ marginRight: '0.4rem', fontSize: '0.8rem' }} />
                                {exp.organization}
                            </p>
                            {expandedExp[exp.id] && (
                                <p className="timeline-desc">{exp.description}</p>
                            )}
                            <button
                                className="timeline-expand-btn"
                                onClick={() => setExpandedExp(prev => ({ ...prev, [exp.id]: !prev[exp.id] }))}
                            >
                                {expandedExp[exp.id]
                                    ? <><FaChevronUp style={{ marginRight: '0.3rem' }} />Hide Details</>
                                    : <><FaChevronDown style={{ marginRight: '0.3rem' }} />View Modules</>
                                }
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════
                PROJECTS SECTION
                ══════════════════════════════════ */}
            <section id="projects-section" className="section">
                <div className="section-header">
                    <span className="section-tag">What I've Built</span>
                    <h2 className="section-title">My Projects</h2>
                    <div className="section-line" />
                </div>

                <div className="projects-grid">
                    {data.projects.map(proj => (
                        <div
                            key={proj.id}
                            className="project-card"
                            onClick={() => navigate(`/project/${proj.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && navigate(`/project/${proj.id}`)}
                        >
                            <div className="project-img-wrap">
                                {proj.image
                                    ? <img src={proj.image} alt={proj.title} className="project-img" loading="lazy" />
                                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--bg2), var(--bg))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '3rem', opacity: 0.3 }}>⬡</div>
                                }
                                <div className="project-overlay">
                                    <span className="project-overlay-text">
                                        <FaArrowRight /> View Details
                                    </span>
                                </div>
                            </div>
                            <div className="project-body">
                                {proj.tags && (
                                    <div className="project-tags">
                                        {proj.tags.split(',').map((t) => (
                                            <span key={t.trim()} className="project-tag">{t.trim()}</span>
                                        ))}
                                    </div>
                                )}
                                <h3 className="project-title">{proj.title}</h3>
                                {proj.shortDescription && (
                                    <p className="project-desc">{proj.shortDescription}</p>
                                )}
                                <div className="project-links" onClick={e => e.stopPropagation()}>
                                    {proj.liveLink && proj.liveLink !== '#' && (
                                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="project-link">
                                            <FaExternalLinkAlt /> Live
                                        </a>
                                    )}
                                    {proj.githubLink && (
                                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="project-link">
                                            <FaGithub /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════
                SKILLS SECTION
                ══════════════════════════════════ */}
            <section id="skills-section" className="section">
                <div className="section-header">
                    <span className="section-tag">Toolkit</span>
                    <h2 className="section-title">My Skills</h2>
                    <div className="section-line" />
                </div>

                <div className="skills-category-grid">
                    {[
                        { id: 'programming', label: 'Programming Languages' },
                        { id: 'frontend', label: 'Frontend Development' },
                        { id: 'backend', label: 'Backend Development' },
                        { id: 'tech_tools', label: 'Tech & Tools' }
                    ].map(cat => {
                        const catSkills = data.skills.filter(s => s.category === cat.id);
                        if (catSkills.length === 0) return null;
                        return (
                            <div key={cat.id} className="skills-category-group">
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
                                    {cat.label}
                                </h3>
                                <div className="skills-grid">
                                    {catSkills.map((skill, i) => (
                                        <div
                                            key={skill.id}
                                            className="skill-chip"
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                        >
                                            {skill.logo && (
                                                <img
                                                    src={skill.logo}
                                                    alt={skill.name}
                                                    className="skill-logo"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            )}
                                            {skill.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ══════════════════════════════════
                BLOG SECTION
                ══════════════════════════════════ */}
            <section id="blog-section" className="section">
                <div className="section-header">
                    <span className="section-tag">Thoughts & Articles</span>
                    <h2 className="section-title">Recent Blog Posts</h2>
                    <div className="section-line" />
                </div>

                <div className="blog-grid">
                    {data.posts.slice(0, 3).map(post => (
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
                                <h3 className="blog-title">{post.title}</h3>
                                {post.summary && <p className="blog-summary">{post.summary}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="center">
                    <button className="view-all-btn" onClick={() => navigate('/blog')}>
                        View All Posts <FaArrowRight />
                    </button>
                </div>
            </section>

            <ContactSection />
        </>
    );
};

export default Home;
