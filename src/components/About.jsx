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
          <div className="about-eyebrow">
            <span className="eyebrow-ping">
              <span className="ping-ring" />
              <span className="ping-dot" />
            </span>
            <Cpu size={13} className="eyebrow-icon" />
            <span>ABOUT SACAR VEDIA COMPANY • <span className="eyebrow-nepali" lang="ne">काठमाडौँ, नेपाल</span></span>
          </div>

          {/* Main Futuristic Bilingual Headline */}
          <h2 className="about-main-headline">
            Where AI Meets <span className="headline-champagne">Cinematic Art</span>
            <span className="headline-separator"> | </span>
            <span className="headline-nepali" lang="ne">भिडियो निर्माणको नयाँ युग</span>
          </h2>

          {/* Elegant Introduction Paragraph */}
          <p className="about-intro-text">
            Based in Kathmandu, <strong>Sacar Vedia Company</strong> is redefining digital storytelling. We blend cutting-edge AI technology with deep creative roots to deliver truly <span className="highlight-nepali">babal (exceptional)</span> visual experiences. From AI commercials to viral reels, we turn your <span className="highlight-nepali">Kalpana (imagination)</span> into stunning on-screen reality, bringing global production standards to your fingertips.
          </p>
        </div>

        {/* Frosted Glassmorphism Stats Bar */}
        <div className="about-stats-glass">
          <div className="stats-glass-reflection" aria-hidden="true" />
          <div className="stats-grid">
            {STATS_DATA.map((stat, idx) => (
              <div key={idx} className="stat-card">
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
            <div className="features-pill">
              <Layers size={12} />
              <span>THE PRODUCTION ADVANTAGE</span>
            </div>
            <h3 className="features-title">
              WHY CHOOSE <span className="title-champagne">SACAR VEDIA COMPANY</span>
            </h3>
            <p className="features-subtitle">
              Engineered for ambitious businesses, marketing agencies, and visionary creators across Nepal and worldwide.
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

                  <div className="card-body">
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
              <span className="cta-bar-text">
                Have a campaign in mind? Launch your commercial with Nepal's premier AI studio.
              </span>
              <button 
                type="button" 
                className="btn-primary about-action-btn"
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
