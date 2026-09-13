import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import './CinematicShowcase.css';

const SHOWCASE_ITEMS = [
  {
    id: 'film',
    title: 'THE DISSOLUTION',
    category: 'AI CINEMA',
    tagline: '8K Anamorphic • Sora & Gen-3 Pipeline',
    image: '/images/hero_showreel.jpg',
    timecode: '00:03:42:18',
    stats: 'WINNER — AI FILM FEST 2026',
    format: '4K • 2.39:1',
  },
  {
    id: 'commercial',
    title: 'NEXUS COUTURE',
    category: 'COMMERCIAL SPOT',
    tagline: 'Global Luxury Campaign • Ultra-Realistic Lighting',
    image: '/images/commercial.jpg',
    timecode: '00:00:45:00',
    stats: '35M+ ORGANIC IMPRESSIONS',
    format: '4K RED • 16:9',
  },
  {
    id: 'music',
    title: 'LIVE MUSIC PUB',
    category: 'MUSIC VIDEO',
    tagline: 'Atmospheric Kathmandu Night • Official Music Video',
    image: '/videos/posters/music-video-01.jpg',
    timecode: '00:03:45:00',
    stats: 'OFFICIAL MUSIC VIDEO',
    format: '4K • 16:9',
  },
];

export default function CinematicShowcase({ onOpenReel, mouseOffset = { x: 0, y: 0 } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentItem = SHOWCASE_ITEMS[activeIndex];

  // Subtle 3D perspective and translation within exact 8-15px and 1-3 deg constraints
  const cardMoveX = (mouseOffset.x || 0) * 11;
  const cardMoveY = (mouseOffset.y || 0) * 9;
  const cardRotY = (mouseOffset.x || 0) * 2.2;
  const cardRotX = -(mouseOffset.y || 0) * 1.8;

  return (
    <div 
      className="cinematic-showcase-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle ambient warm champagne glow behind composition */}
      <div 
        className="showcase-ambient-glow" 
        style={{
          transform: `translate3d(${cardMoveX * 0.5}px, ${cardMoveY * 0.5}px, 0)`,
        }}
      />

      {/* Main 3D Perspective Card responding to cursor */}
      <div 
        className={`showcase-card ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `perspective(1200px) translate3d(${cardMoveX}px, ${cardMoveY}px, 0) rotateY(${cardRotY}deg) rotateX(${cardRotX}deg)`,
        }}
      >
        {/* Uncluttered High-Impact Media Frame */}
        <div className="showcase-media-frame">
          <img 
            src={currentItem.image} 
            alt={currentItem.title}
            className="showcase-image"
            loading="eager"
            decoding="async"
            width="600"
            height="360"
          />
          <div className="showcase-media-overlay" />
          <div className="showcase-lens-streak" />

          {/* Minimal Top Overlay Bar — faded back so the thumbnail visual pops */}
          <div className="showcase-minimal-topbar">
            <div className="topbar-meta">
              <span className="topbar-dot" />
              <span className="topbar-title">{currentItem.title}</span>
              <span className="topbar-sep">•</span>
              <span className="topbar-category">{currentItem.category}</span>
            </div>
            <div className="topbar-spec">
              <span>{currentItem.format}</span>
            </div>
          </div>

          {/* Central Play Button as the Primary Visual Focus */}
          <button 
            type="button" 
            className="showcase-play-trigger"
            onClick={() => onOpenReel(currentItem.id)}
            aria-label="Play Showreel"
            id="showcase-play-trigger-btn"
          >
            <div className="play-pulse-ring ring-1" />
            <div className="play-pulse-ring ring-2" />
            <div className="play-button-core">
              <Play size={24} className="play-icon" />
            </div>
            <span className="play-label">WATCH REEL</span>
          </button>
        </div>

        {/* Understated Showcase Footer Switcher */}
        <div className="showcase-footer">
          <div className="showcase-selectors">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`showcase-tab ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="tab-num">0{idx + 1}</span>
                <span className="tab-name">
                  {idx === 0 ? 'CINEMA' : idx === 1 ? 'COMMERCIAL' : 'MUSIC VIDEO'}
                </span>
                {activeIndex === idx && <span className="tab-indicator-bar" />}
              </button>
            ))}
          </div>

          <div className="showcase-stats">
            <Sparkles size={13} className="stats-sparkle" />
            <span>{currentItem.stats}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
