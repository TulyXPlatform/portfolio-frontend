import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGithub, FaLinkedin, FaFacebook, FaWhatsapp,
  FaEnvelope, FaExternalLinkAlt
} from 'react-icons/fa';

interface SocialLink { id: number; platform: string; url: string; }

interface Props {
  socialLinks: SocialLink[];
  name?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  facebook: <FaFacebook />,
  whatsapp: <FaWhatsapp />,
  gmail: <FaEnvelope />,
  bdjobs: <FaExternalLinkAlt />,
};

/**
 * FloatingNavbar — invisible until scroll > 400px, then animates in
 * as a compact pill with TM logo, name, and social icons.
 */
const FloatingNavbar: React.FC<Props> = ({ socialLinks }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${visible ? ' visible' : ''}`} aria-label="Site navigation">
      <div className="navbar-pill">
        <Link to="/" className="navbar-logo" title="Home">
          <div className="logo-mono" style={{ width: 'auto', padding: '0 12px', borderRadius: '20px' }}>Tamima</div>
        </Link>

        {socialLinks.length > 0 && (
          <>
            <div className="navbar-divider" />
            <div className="navbar-links">
              {socialLinks.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="navbar-social"
                  title={s.platform}
                >
                  {iconMap[s.platform.toLowerCase()] || <FaExternalLinkAlt />}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default FloatingNavbar;
