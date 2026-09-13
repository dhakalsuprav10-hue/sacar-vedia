import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = ['Home', 'Work', 'Services', 'About', 'Contact'];

export default function Navbar({ onStartProject }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Update scrolled state for navbar background blur (only when value changes)
      setScrolled((prev) => {
        const next = window.scrollY > 20;
        return prev !== next ? next : prev;
      });

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 2. Edge case: Detect if user reached bottom of page (highlight Contact)
      if (windowHeight + Math.round(scrollPosition) >= documentHeight - 60) {
        setActiveLink((prev) => (prev !== 'Contact' ? 'Contact' : prev));
        return;
      }

      // 3. Scroll Spy: Detect active section based on viewport offset
      const sectionIds = ['home', 'work', 'services', 'about', 'contact'];
      const triggerOffset = 180; // Offset accounting for fixed navbar height
      let current = 'Home';

      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerOffset) {
            current = sectionIds[i].charAt(0).toUpperCase() + sectionIds[i].slice(1);
          }
        }
      }

      setActiveLink((prev) => (prev !== current ? current : prev));
    };

    // Run on initial load
    handleScroll();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const handleNavClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Brand / Logo */}
        <a href="#home" className="navbar-brand" onClick={() => handleNavClick('Home')}>
          <div className="brand-badge">SVC</div>
          <div className="brand-text-group">
            <span className="brand-title">SACAR VEDIA COMPANY</span>
            <span className="brand-subtitle">COMMERCIAL &amp; VIDEO PRODUCTION</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`nav-link ${activeLink === link ? 'active' : ''}`}
                onClick={() => handleNavClick(link)}
              >
                {link}
                {activeLink === link && <span className="active-dot" />}
              </a>
            </li>
          ))}
        </ul>

        {/* Highlighted CTA Button */}
        <div className="navbar-action">
          <button 
            type="button" 
            className="nav-cta-btn"
            onClick={onStartProject}
            id="nav-start-project-btn"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="cta-icon" size={16} />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">NAVIGATION</span>
            <span className="mobile-badge"><Sparkles size={12} /> AVAILABLE NOW</span>
          </div>
          <ul className="mobile-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className={`mobile-nav-link ${activeLink === link ? 'active' : ''}`}
                  onClick={() => handleNavClick(link)}
                >
                  <span className="mobile-link-name">{link}</span>
                  <ArrowUpRight size={18} className="mobile-link-arrow" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-footer">
            <button 
              type="button" 
              className="btn-primary mobile-cta-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onStartProject) onStartProject();
              }}
            >
              <span>START A PROJECT</span>
              <ArrowUpRight size={16} />
            </button>
            <p className="mobile-footer-tagline">AI Commercials • Brand Campaigns • Vertical Reels</p>
          </div>
        </div>
      </div>
    </header>
  );
}
