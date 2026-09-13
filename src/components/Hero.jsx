import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowRight, Sparkles, Film, Flame, Music, CheckCircle2 } from 'lucide-react';
import InstagramReelsShowcase from './InstagramReelsShowcase';
import PanVerificationModal from './PanVerificationModal';
import './Hero.css';

export default function Hero({ onOpenReel, onContactClick, isModalOpen = false }) {
  const heroRef = useRef(null);
  const meshBgRef = useRef(null);
  const radialGlowRef = useRef(null);
  const ambientLinesRef = useRef(null);
  const particlesLayerRef = useRef(null);
  const reelsShowcaseRef = useRef(null);

  const [panModalOpen, setPanModalOpen] = useState(false);

  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isModalOpen || panModalOpen) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    let animId;
    let isIntersecting = true;

    const handleMouseMove = (e) => {
      if (!isIntersecting) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouse.current = { x: nx, y: ny };
    };

    const handleMouseLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateParallax = () => {
      if (!isIntersecting) return;

      currentMouse.current.x = lerp(currentMouse.current.x, targetMouse.current.x, 0.07);
      currentMouse.current.y = lerp(currentMouse.current.y, targetMouse.current.y, 0.07);

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      const bgGlowTransform = `translate3d(${mx * -14}px, ${my * -12}px, 0)`;
      const bgLinesTransform = `translate3d(${mx * 10}px, ${my * 8}px, 0)`;
      const bgParticlesTransform = `translate3d(${mx * 24}px, ${my * 20}px, 0)`;

      if (meshBgRef.current) meshBgRef.current.style.transform = bgGlowTransform;
      if (radialGlowRef.current) radialGlowRef.current.style.transform = bgGlowTransform;
      if (ambientLinesRef.current) ambientLinesRef.current.style.transform = bgLinesTransform;
      if (particlesLayerRef.current) particlesLayerRef.current.style.transform = bgParticlesTransform;

      if (reelsShowcaseRef.current && reelsShowcaseRef.current.updateParallax) {
        reelsShowcaseRef.current.updateParallax(mx, my);
      }

      animId = requestAnimationFrame(updateParallax);
    };

    // IntersectionObserver to pause loop when user scrolls past hero
    let observer;
    if (typeof IntersectionObserver !== 'undefined' && heroRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(updateParallax);
          } else {
            cancelAnimationFrame(animId);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(heroRef.current);
    } else {
      animId = requestAnimationFrame(updateParallax);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (observer) observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isModalOpen, panModalOpen]);

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      {/* Dynamic multi-plane atmospheric parallax layers — GPU accelerated without React re-renders */}
      <div 
        ref={meshBgRef}
        className="hero-mesh-background" 
        style={{ transform: 'translate3d(0, 0, 0)' }} 
      />
      <div 
        ref={radialGlowRef}
        className="hero-radial-glow" 
        style={{ transform: 'translate3d(0, 0, 0)' }} 
      />

      {/* Subtle floating abstract cinematic lines */}
      <div 
        ref={ambientLinesRef}
        className="hero-ambient-lines" 
        style={{ transform: 'translate3d(0, 0, 0)' }} 
        aria-hidden="true"
      >
        <div className="ambient-line line-1" />
        <div className="ambient-line line-2" />
        <div className="ambient-line line-3" />
      </div>

      {/* Floating light particles with varied depth */}
      <div 
        ref={particlesLayerRef}
        className="hero-particles-layer" 
        style={{ transform: 'translate3d(0, 0, 0)' }} 
        aria-hidden="true"
      >
        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
        <span className="particle particle-4" />
        <span className="particle particle-5" />
      </div>

      <div className="hero-container">
        {/* Left Column: Hero Text Content */}
        <div className="hero-content">
          {/* Top Status Pill with Generous Vertical Breathing Room */}
          <div className="hero-status-pill">
            <span className="status-indicator">
              <span className="status-ping" />
              <span className="status-core" />
            </span>
            <span className="status-text">AVAILABLE FOR SELECT COMMISSIONS • Q3/Q4</span>
          </div>

          {/* Prominent Name */}
          <div className="hero-author-wrapper">
            <span className="author-prefix">PRODUCTION PORTFOLIO OF</span>
            <h2 className="hero-author-name">SACAR VEDIA COMPANY</h2>
          </div>

          {/* Monumental Ultra-Bold Display Headline */}
          <h1 className="hero-headline">
            I CREATE <span className="headline-champagne">WHAT’S NEXT.</span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-subheadline">
            Sacar Vedia Company Commercial &amp; Video Production
          </p>

          {/* Official Government PAN & Business Registration Verification Toggle */}
          <div className="hero-pan-verification-container">
            <button 
              type="button" 
              className="pan-verification-trigger-btn"
              onClick={() => setPanModalOpen(true)}
              id="view-pan-certificate-btn"
              title="View Official PAN & Business Registration Certificate"
            >
              <span className="pan-btn-icon" aria-hidden="true">📄</span>
              <span className="pan-btn-text">View Official PAN &amp; Business Registration Certificate</span>
              <span className="pan-btn-badge">
                <CheckCircle2 size={12} className="pan-badge-check" />
                <span>GOVT. VERIFIED</span>
              </span>
            </button>
          </div>

          {/* Outcome-Focused Sub-headline */}
          <p className="hero-description">
            Crafting high-impact AI cinema, commercial spots, and audio-reactive visuals for global brands.
          </p>

          {/* Interactive Feature Tags / Discipline Pills */}
          <div className="hero-disciplines">
            <button 
              type="button" 
              className="discipline-tag discipline-pill-btn"
              onClick={() => onOpenReel('film')}
              title="View AI Film Direction Reel"
            >
              <Film size={13} className="discipline-icon" />
              <span>AI Film Direction</span>
            </button>
            <button 
              type="button" 
              className="discipline-tag discipline-pill-btn"
              onClick={() => onOpenReel('commercial')}
              title="View AI Commercials Reel"
            >
              <Flame size={13} className="discipline-icon" />
              <span>AI Advertisements</span>
            </button>
            <button 
              type="button" 
              className="discipline-tag discipline-pill-btn"
              onClick={() => onOpenReel('vertical')}
              title="View Vertical Commercial Reel"
            >
              <Sparkles size={13} className="discipline-icon" />
              <span>Vertical Commercials</span>
            </button>
            <button 
              type="button" 
              className="discipline-tag discipline-pill-btn"
              onClick={() => onOpenReel('music')}
              title="View Music Video Reel"
            >
              <Music size={13} className="discipline-icon" />
              <span>Music Videos</span>
            </button>
          </div>

          {/* Unified Primary & Secondary CTA Group */}
          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn-primary hero-btn-work"
              onClick={() => onOpenReel('film')}
              id="hero-play-showreel-btn"
            >
              <Play size={15} fill="currentColor" className="btn-play-icon" />
              <span>PLAY SHOWREEL</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary hero-btn-contact"
              onClick={onContactClick}
              id="hero-start-project-btn"
            >
              <span>START A PROJECT</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>
          </div>

          {/* Social Proof Stats Bar Relocated Directly Underneath CTAs */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-num">35M+</span>
              <span className="metric-label">Digital Views</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-num">40+</span>
              <span className="metric-label">Global Campaigns</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-num">4K</span>
              <span className="metric-label">Neural Cinema</span>
            </div>
          </div>
        </div>

        {/* Right Column: Auto-Scrolling Instagram Reels Showcase in Smartphone Frame */}
        <div className="hero-visual">
          <InstagramReelsShowcase 
            ref={reelsShowcaseRef}
            onOpenReel={onOpenReel} 
            isPaused={isModalOpen || panModalOpen}
          />
        </div>
      </div>

      {/* Official PAN & Business Registration Verification Modal */}
      <PanVerificationModal 
        isOpen={panModalOpen}
        onClose={() => setPanModalOpen(false)}
      />
    </section>
  );
}
