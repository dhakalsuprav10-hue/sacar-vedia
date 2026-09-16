import React, { useEffect, useRef, useState } from 'react';
import { Film, Smartphone, Music, Megaphone, Sparkles, ArrowRight, Check } from 'lucide-react';
import './Services.css';

const SERVICES_DATA = [
  {
    id: 'ai-commercials',
    number: '01',
    title: 'AI Commercials & Brand Campaigns',
    subtitle: '16:9 & 4K Cinema Production',
    icon: Film,
    description: 'High-end 16:9 & 4K neural cinema spots with AI spokespersons, realistic voice synthesis, and broadcast-quality visuals for TV and YouTube.',
    deliverables: ['AI Brand Spokespersons', '4K Anamorphic Resolution', 'Multilingual Nepali / English Audio', 'YouTube & TV Ready'],
    accentClass: 'accent-gold',
  },
  {
    id: 'vertical-social-reels',
    number: '02',
    title: 'Vertical Social Reels',
    subtitle: '9:16 High-Engagement Spots',
    icon: Smartphone,
    description: 'High-converting 9:16 vertical videos optimized for TikTok and Instagram Reels. Fast-paced, engaging, and designed to go viral.',
    deliverables: ['TikTok & IG Reels Formats', 'Hook-Driven Visual Openings', 'High-Converting Product Demos', 'Viral Trending Sound Sync'],
    accentClass: 'accent-coral',
  },
  {
    id: 'cinematic-music-videos',
    number: '03',
    title: 'Cinematic Music Videos',
    subtitle: 'Audio-Reactive Synesthesia',
    icon: Music,
    description: 'Immersive, audio-reactive visuals and creative storytelling that bring your music tracks to life using advanced AI generation.',
    deliverables: ['BPM Beat-Synchronized Motion', 'Surrealist Dreamscapes', 'Artist Persona Visualizers', 'DCI 2.39:1 Cinema Grading'],
    accentClass: 'accent-cyan',
  },
  {
    id: 'ai-political-custom',
    number: '04',
    title: 'AI Political & Custom Campaigns',
    subtitle: 'Targeted High-Impact Outreach',
    icon: Megaphone,
    description: 'Targeted messaging and dynamic visual campaigns tailored for political outreach, local promotions, and bespoke creative projects.',
    deliverables: ['Voter / Constituent Outreach', 'Hyper-Local Community Focus', 'Multi-Platform Ad Distribution', 'Rapid 24-48h Brief Turnaround'],
    accentClass: 'accent-emerald',
  },
];

export default function Services({ onStartProject }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className={`services-section ${isVisible ? 'is-in-view' : ''}`} 
      id="services" 
      ref={sectionRef}
    >
      {/* Dynamic Atmospheric Glow & Beams */}
      <div className="services-ambient-glow" aria-hidden="true" />
      <div className="services-radial-light" aria-hidden="true" />

      <div className="services-container">
        {/* Section Header */}
        <div className="services-header">
          <div className="services-eyebrow reveal-text">
            <span className="eyebrow-pulse">
              <span className="pulse-ring" />
              <span className="pulse-core" />
            </span>
            <Sparkles size={12} className="eyebrow-sparkle" />
            <span>FULL-SPECTRUM AI CINEMA • सेवाहरू</span>
          </div>

          {/* Section Main Heading with flawless Devanagari typography */}
          <h2 className="services-main-headline reveal-text reveal-delay-1">
            Our Core Expertise
            <span className="services-separator"> | </span>
            <span className="services-headline-nepali" lang="ne">
              हाम्रा प्रमुख सेवाहरू
            </span>
          </h2>

          <p className="services-subtitle reveal-text reveal-delay-2">
            Broadcast-ready AI cinema tailored for brand impact, high engagement, and viral reach.
          </p>
        </div>

        {/* 2x2 Glassmorphism Feature Cards Grid */}
        <div className="services-grid">
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;
            return (
              <article 
                key={service.id} 
                className={`service-glass-card ${service.accentClass}`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Ambient Card Top Glow on Hover */}
                <div className="card-ambient-aura" aria-hidden="true" />

                {/* Card Top Row */}
                <div className="service-card-top">
                  <div className="service-icon-box">
                    <Icon size={24} className="service-card-icon" />
                  </div>
                  <div className="service-card-meta reveal-text">
                    <span className="service-number">{service.number}</span>
                    <span className="service-pill-tag">{service.subtitle}</span>
                  </div>
                </div>

                {/* Card Main Info */}
                <div className="service-card-body">
                  <h3 className="service-card-title reveal-text reveal-delay-1">{service.title}</h3>
                  <p className="service-card-description reveal-text reveal-delay-2">{service.description}</p>

                  {/* Bullet Deliverables */}
                  <ul className="service-deliverables-list reveal-text reveal-delay-3">
                    {service.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="deliverable-item">
                        <Check size={13} className="deliverable-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Card Interactive Indicator */}
                <div className="service-card-footer">
                  <span className="card-action-hint">READY FOR PRODUCTION</span>
                  <span className="card-accent-beam" />
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Call To Action Button */}
        {onStartProject && (
          <div className="services-cta-wrapper">
            <div className="services-cta-card">
              <div className="cta-text-group">
                <span className="cta-eyebrow reveal-text">HAVE A SPECIFIC PRODUCTION BRIEF?</span>
                <h4 className="cta-headline reveal-text reveal-delay-1">Turn your vision into high-impact visual reality today.</h4>
                <span className="cta-rate-notice reveal-text reveal-delay-2">Standard pricing starting from only <strong>Rs. 800 per video</strong>.</span>
              </div>
              <button 
                type="button" 
                className="btn-primary services-start-btn reveal-text reveal-delay-3"
                onClick={onStartProject}
                id="services-start-project-btn"
              >
                <span>START A PROJECT</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
