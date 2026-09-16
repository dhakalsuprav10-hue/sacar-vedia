import React from 'react';
import { Sparkles, Zap, Flame, ArrowUpRight, Cpu, Layers } from 'lucide-react';
import './About.css';

const STATS_DATA = [
  {
    value: '35M+',
    label: 'Digital Views',
    detail: 'Organic audience reach across social & video platforms',
  },
  {
    value: '40+',
    label: 'Global Campaigns',
    detail: 'Executed commercial spots, reels & visualizer campaigns',
  },
  {
    value: '4K',
    label: 'Neural Cinema',
    detail: 'Ultra-high-fidelity generation & cinematic aspect ratios',
  },
];

const WHY_CHOOSE_CARDS = [
  {
    id: 'dammi-quality',
    title: 'Dammi Quality (Premium Finish)',
    nepaliTitle: 'दम्मी क्वालिटी',
    description: 'State-of-the-art AI video generation and neural direction.',
    icon: Sparkles,
    tag: 'NEURAL EXCELLENCE',
    accentClass: 'accent-gold',
  },
  {
    id: 'chhito-sajilo',
    title: 'Chhito ra Sajilo (Fast & Seamless)',
    nepaliTitle: 'छिटो र सजिलो',
    description: 'Rapid turnaround times for urgent campaigns.',
    icon: Zap,
    tag: 'LIGHTNING TURNAROUND',
    accentClass: 'accent-cyan',
  },
  {
    id: 'budget-friendly',
    title: 'Budget-Friendly',
    nepaliTitle: 'किफायती मूल्य',
    description: 'High-end commercial visuals starting at just Rs. 800 per video.',
    icon: Flame,
    tag: 'FROM RS. 800 / VIDEO',
    accentClass: 'accent-emerald',
  },
];

export default function About({ onStartProject }) {
  return (
    <section className="about-section" id="about">
      {/* Ambient Multi-Plane Glow & Visual Beams */}
      <div className="about-ambient-glow" aria-hidden="true" />
      <div className="about-radial-halo" aria-hidden="true" />

      <div className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <div className="about-eyebrow reveal-text">
            <span className="eyebrow-ping">
              <span className="ping-ring" />
              <span className="ping-dot" />
            </span>
            <Cpu size={13} className="eyebrow-icon" />
            <span>ABOUT SAKAR VEDIA • <span className="eyebrow-nepali" lang="ne">काठमाडौँ, नेपाल</span></span>
          </div>

          {/* Main Headline */}
          <h2 className="about-main-headline reveal-text reveal-delay-1">
            Where AI Meets <span className="headline-champagne">Cinematic Art</span>
          </h2>

          {/* Minimal Introduction */}
          <p className="about-intro-text reveal-text reveal-delay-2">
            Kathmandu-based studio blending advanced AI cinema with commercial video direction. We deliver broadcast-grade advertisements, viral vertical reels, and creative visuals for brands worldwide.
          </p>
        </div>

        {/* Frosted Glassmorphism Stats Bar */}
        <div className="about-stats-glass">
          <div className="stats-glass-reflection" aria-hidden="true" />
          <div className="stats-grid">
            {STATS_DATA.map((stat, idx) => (
              <div key={idx} className="stat-card reveal-text reveal-delay-2">
                <div className="stat-number-wrap">
                  <span className="stat-number">{stat.value}</span>
                </div>
                <div className="stat-meta">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-detail">{stat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 'Why Choose Us' Feature Cards Grid */}
        <div className="about-features-section">
          <div className="features-header">
            <div className="features-pill reveal-text">
              <Layers size={12} />
              <span>THE PRODUCTION ADVANTAGE</span>
            </div>
            <h3 className="features-title reveal-text reveal-delay-1">
              WHY CHOOSE <span className="title-champagne">SAKAR VEDIA</span>
            </h3>
            <p className="features-subtitle reveal-text reveal-delay-2">
              Engineered for businesses, agencies, and creators seeking fast, high-impact video campaigns.
            </p>
          </div>

          <div className="features-cards-grid">
            {WHY_CHOOSE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div 
                  key={card.id} 
                  className={`feature-card ${card.accentClass}`}
                  tabIndex={0}
                >
                  <div className="card-top-row">
                    <div className="card-icon-wrapper">
                      <Icon size={22} className="feature-icon" />
                    </div>
                    <span className="card-tag">{card.tag}</span>
                  </div>

                  <div className="card-body reveal-text reveal-delay-2">
                    <h4 className="card-title">
                      {card.title}
                    </h4>
                    <p className="card-description">
                      {card.description}
                    </p>
                  </div>

                  <div className="card-bottom-accent">
                    <span className="accent-bar" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct CTA Bridge */}
          {onStartProject && (
            <div className="about-cta-bar">
              <span className="cta-bar-text reveal-text">
                Ready to elevate your brand? Launch your next video production today.
              </span>
              <button 
                type="button" 
                className="btn-primary about-action-btn reveal-text reveal-delay-1"
                onClick={onStartProject}
                id="about-start-project-btn"
              >
                <span>COMMISSION A PROJECT</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
