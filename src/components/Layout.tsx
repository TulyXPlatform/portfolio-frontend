import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import HangingBulb from './HangingBulb';
import CustomCursor from './CustomCursor';
import FloatingRoad from './FloatingRoad';
import FloatingNavbar from './FloatingNavbar';
import SeasonBackground from './SeasonBackground';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import ScrollTopArrow from './ScrollTopArrow';
import Footer from "./Footer";

interface SocialLink { id: number; platform: string; url: string; }
interface Props { children: React.ReactNode; socialLinks?: SocialLink[]; }

const getParticleOptions = (theme: string): ISourceOptions => {
    const base: ISourceOptions = {
        fullScreen: { enable: false },
        detectRetina: true,
    };

    if (theme === 'dark') return {
        ...base,
        background: { color: { value: 'transparent' } },
        particles: {
            number: { value: 40, density: { enable: true } },
            color: { value: '#00ff88' },
            links: { enable: true, color: '#00ff88', opacity: 0.1, distance: 150 },
            move: { enable: true, speed: 0.5 },
            size: { value: { min: 1, max: 2 } },
            opacity: { value: { min: 0.1, max: 0.3 } },
            shape: { type: 'circle' },
        },
    };

    if (theme === 'light') return {
        ...base,
        background: { color: { value: 'transparent' } },
        particles: {
            number: { value: 30, density: { enable: true } },
            color: { value: '#059669' },
            links: { enable: true, color: '#059669', opacity: 0.1, distance: 150 },
            move: { enable: true, speed: 0.5 },
            size: { value: { min: 1, max: 2 } },
            opacity: { value: { min: 0.1, max: 0.3 } },
            shape: { type: 'circle' },
        },
    };

    return base;
};

const Layout: React.FC<Props> = ({ children, socialLinks = [] }) => {
    const { theme } = useTheme();
    const [particlesReady, setParticlesReady] = useState(false);
    const [particlesKey, setParticlesKey] = useState(theme);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => setParticlesReady(true));
    }, []);

    useEffect(() => {
        setParticlesKey(theme);
    }, [theme]);

    return (
        <div className="layout">
            <CustomCursor />
            <SeasonBackground />

            {particlesReady && (
                <Particles
                    key={particlesKey}
                    id="tsparticles"
                    options={getParticleOptions(theme)}
                />
            )}

            <HangingBulb />
            <FloatingNavbar socialLinks={socialLinks} />

            <main className="content">
                {children}
            </main>

            <FloatingRoad />
            <ScrollTopArrow />
            <Footer />
        </div>
    );
};

export default Layout;
