import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Wifi, 
  Signal, 
  MoreVertical,
  Play
} from 'lucide-react';
import './InstagramReelsShowcase.css';

/**
 * 4 Distinct Commercial Videos Matched from low storage same vids:
 * 1. 0911 (1)(2) -> Euporae Collagen 9:16 Vertical Reel (/videos/commercial-03.mp4)
 * 2. 0911 (1)    -> Live Music Pub Kathmandu 16:9 Music Video (/videos/music-video-01.mp4)
 * 3. 0911 (1)(1) -> Hello Smart Trade Lighting (/videos/commercial-01.mp4)
 * 4. 0911 (1)(3) -> Sahayatri Auto Care AI Spokesperson (/videos/commercial-02.mp4)
 */
const REELS_DATA = [
  {
    id: 'reel-vertical-01',
    videoSrc: '/videos/commercial-03.mp4',
    poster: '/videos/posters/commercial-03.jpg',
    category: 'VERTICAL REEL SPOT',
    title: 'Euporae Multi Collagen',
    caption: 'High-converting 9:16 vertical cinema spot ✨ Neural skin hydration & product macro VFX. Optimized for viral feeds.',
    audio: 'sacar vedia • Original Audio',
    username: 'sacar vedia',
    likesCount: '1.2M',
    commentsCount: '45K',
    sharesCount: '110K',
    savesCount: '86K',
    reelType: 'vertical'
  },
  {
    id: 'reel-music-02',
    videoSrc: '/videos/music-video-01.mp4',
    poster: '/videos/posters/music-video-01.jpg',
    category: 'OFFICIAL MUSIC VIDEO',
    title: 'Live Music Pub — Kathmandu',
    caption: 'Rainy night streets of Kathmandu 🌧️🎸 24fps anamorphic lighting, wet asphalt reflections & acoustic soul.',
    audio: 'Live Music Pub • Official Track',
    username: 'sacar vedia',
    likesCount: '2.1M',
    commentsCount: '89K',
    sharesCount: '230K',
    savesCount: '145K',
    reelType: 'music'
  },
  {
    id: 'reel-commercial-03',
    videoSrc: '/videos/commercial-01.mp4',
    poster: '/videos/posters/commercial-01.jpg',
    category: 'AI BRAND COMMERCIAL',
    title: 'Hello Smart Lighting Solutions',
    caption: 'Architectural crystal lighting & dynamic ambient illumination across Nepal 💡 100% Neural CGI render.',
    audio: 'sacar vedia • Commercial Score',
    username: 'sacar vedia',
    likesCount: '980K',
    commentsCount: '32K',
    sharesCount: '88K',
    savesCount: '54K',
    reelType: 'film'
  },
  {
    id: 'reel-commercial-04',
    videoSrc: '/videos/commercial-02.mp4',
    poster: '/videos/posters/commercial-02.jpg',
    category: 'AI SPOKESPERSON COMMERCIAL',
    title: 'Sahayatri Auto Care Campaign',
    caption: 'Hyper-realistic AI brand spokesperson delivering fluent Nepali speech & workshop service promotion 🏍️',
    audio: 'Sahayatri Auto Care • Brand Audio',
    username: 'sacar vedia',
    likesCount: '1.4M',
    commentsCount: '48K',
    sharesCount: '125K',
    savesCount: '69K',
    reelType: 'commercial'
  }
];

const InstagramReelsShowcase = React.forwardRef(function InstagramReelsShowcase({ onOpenReel, isPaused = false }, ref) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [isInView, setIsInView] = useState(true);
  
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const timerRef = useRef(null);
  const chassisRef = useRef(null);
  const ambientGlowRef = useRef(null);

  // Expose GPU-accelerated parallax update to Hero rAF loop without triggering React re-renders
  React.useImperativeHandle(ref, () => ({
    updateParallax: (mx, my) => {
      const cardMoveX = mx * 8;
      const cardMoveY = my * 7;
      const cardRotY = mx * 1.8;
      const cardRotX = -my * 1.5;

      if (chassisRef.current) {
        chassisRef.current.style.transform = `perspective(1200px) translate3d(${cardMoveX}px, ${cardMoveY}px, 0) rotateY(${cardRotY}deg) rotateX(${cardRotX}deg)`;
      }
      if (ambientGlowRef.current) {
        ambientGlowRef.current.style.transform = `translate3d(${cardMoveX * 0.4}px, ${cardMoveY * 0.4}px, 0)`;
      }
    }
  }));

  // Synchronous, immediate pause and transition handler
  const handleOpenFullReel = useCallback((reelType) => {
    // 1. Immediately pause the hero preview video and reset state synchronously
    videoRefs.current.forEach((videoEl) => {
      if (videoEl) {
        try {
          videoEl.pause();
        } catch (err) {}
      }
    });

    // 2. Immediately clear auto-scroll timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 3. Trigger full reel view
    if (onOpenReel) {
      onOpenReel(reelType);
    }
  }, [onOpenReel]);

  // Viewport IntersectionObserver to halt playback when hero is scrolled out of view
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 5-Second Auto-Scroll Interval Timer (only when in view and NOT paused)
  useEffect(() => {
    if (isPaused || !isInView) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, isPaused, isInView]);

  // Video playback management: play active video, pause others safely
  useEffect(() => {
    if (isPaused || !isInView) {
      videoRefs.current.forEach((videoEl) => {
        if (videoEl) {
          try {
            videoEl.pause();
          } catch (err) {}
        }
      });
      return;
    }

    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === currentIndex) {
        videoEl.muted = isMuted;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.pause();
      }
    });
  }, [currentIndex, isMuted, isPaused, isInView]);

  // Manual navigation handlers that reset the 5s timer
  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);
  };

  const handleSelectReel = (idx, e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(idx);
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const toggleLike = (id, e) => {
    if (e) e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentReel = REELS_DATA[currentIndex];

  return (
    <div className="reels-showcase-wrapper" ref={containerRef}>
      {/* Ambient background glow */}
      <div 
        ref={ambientGlowRef}
        className="reels-ambient-glow" 
        style={{
          transform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />

      {/* Modern Smartphone Chassis with Hardware-Accelerated Parallax */}
      <div 
        ref={chassisRef}
        className="phone-chassis"
        style={{
          transform: 'perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)',
        }}
      >
        {/* Hardware details: Side buttons */}
        <div className="phone-btn-volume-up" />
        <div className="phone-btn-volume-down" />
        <div className="phone-btn-power" />

        {/* Screen Frame */}
        <div className="phone-screen">
          {/* Top Status Bar & Dynamic Island */}
          <div className="phone-top-bar">
            <span className="phone-clock">9:41</span>

            {/* Dynamic Island Notch */}
            <div className="dynamic-island">
              <span className="island-camera" />
              <span className="island-mic" />
            </div>

            <div className="phone-status-icons">
              <Signal size={12} className="status-svg" />
              <Wifi size={12} className="status-svg" />
              <div className="phone-battery">
                <div className="battery-level" />
              </div>
            </div>
          </div>

          {/* 5-Second Segmented Progress Bars (Instagram Stories/Reels style) */}
          <div className="reels-progress-segments">
            {REELS_DATA.map((_, idx) => (
              <div 
                key={idx} 
                className="progress-segment-track"
                onClick={(e) => handleSelectReel(idx, e)}
                title={`Jump to reel ${idx + 1}`}
              >
                <div 
                  key={`${idx}-${currentIndex === idx ? currentIndex : 'static'}`}
                  className={`progress-segment-fill ${
                    idx < currentIndex 
                      ? 'completed' 
                      : idx === currentIndex 
                      ? 'running' 
                      : ''
                  }`} 
                />
              </div>
            ))}
          </div>

          {/* Top Header Overlay */}
          <div className="reels-top-header">
            <div className="reels-header-brand">
              <span className="reels-logo-text">Reels</span>
              <span className="reels-badge-live">
                <Sparkles size={10} /> 4K AI
              </span>
            </div>

            <div className="reels-header-actions">
              <button 
                type="button" 
                className="reel-sound-toggle-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                title={isMuted ? 'Tap to unmute' : 'Muted'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="sound-label">{isMuted ? 'MUTED' : 'LIVE'}</span>
              </button>
              
              <button 
                type="button" 
                className="reels-menu-btn"
                onClick={() => handleOpenFullReel(currentReel.reelType)}
                title="Watch Full Reel in Theater"
                aria-label="Watch Full Reel"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Vertical Reels Slider Track (Smooth 5s auto-sliding) */}
          <div className="reels-viewport">
            <div 
              className="reels-vertical-track"
              style={{
                transform: `translate3d(0, -${currentIndex * 100}%, 0)`,
              }}
            >
              {REELS_DATA.map((reel, idx) => {
                const isReelActive = idx === currentIndex;
                const isAdjacent = Math.abs(idx - currentIndex) <= 1 ||
                  (currentIndex === 0 && idx === REELS_DATA.length - 1) ||
                  (currentIndex === REELS_DATA.length - 1 && idx === 0);
                const isLiked = Boolean(likedMap[reel.id]);
                const isSaved = Boolean(savedMap[reel.id]);

                return (
                  <div key={reel.id} className="single-reel-slide">
                    {/* Video Player with Lazy Loading */}
                    {isAdjacent ? (
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={reel.videoSrc}
                        poster={reel.poster}
                        autoPlay={idx === 0}
                        muted={isMuted}
                        playsInline
                        loop
                        preload={isReelActive ? 'auto' : 'none'}
                        className="reel-video-element"
                        onClick={toggleMute}
                      />
                    ) : (
                      <img
                        src={reel.poster}
                        alt={reel.title}
                        className="reel-video-element"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                    )}

                    {/* Gradient Vignette for clear text contrast */}
                    <div className="reel-vignette-overlay" />

                    {/* =======================================================
                        INSTAGRAM REEL OVERLAY: VIRAL STATS (RIGHT STACK)
                        ======================================================= */}
                    <div className="reel-actions-stack">
                      {/* Like Action */}
                      <button 
                        type="button" 
                        className={`reel-stat-btn ${isLiked ? 'active-like' : ''}`}
                        onClick={(e) => toggleLike(reel.id, e)}
                        aria-label="Like reel"
                      >
                        <div className="stat-icon-wrapper">
                          <Heart 
                            size={24} 
                            fill={isLiked ? '#ff3040' : 'none'} 
                            stroke={isLiked ? '#ff3040' : '#ffffff'} 
                            className={`heart-svg ${isLiked ? 'pop-anim' : ''}`}
                          />
                        </div>
                        <span className="stat-count">
                          {isLiked ? '1.3M' : reel.likesCount}
                        </span>
                      </button>

                      {/* Comment Action */}
                      <button 
                        type="button" 
                        className="reel-stat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFullReel(reel.reelType);
                        }}
                        aria-label="Comment on reel"
                      >
                        <div className="stat-icon-wrapper">
                          <MessageCircle size={23} stroke="#ffffff" fill="none" />
                        </div>
                        <span className="stat-count">{reel.commentsCount}</span>
                      </button>

                      {/* Share Action */}
                      <button 
                        type="button" 
                        className="reel-stat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({ title: reel.title, url: window.location.href }).catch(() => {});
                          }
                        }}
                        aria-label="Share reel"
                      >
                        <div className="stat-icon-wrapper">
                          <Send size={22} stroke="#ffffff" fill="none" className="share-svg" />
                        </div>
                        <span className="stat-count">{reel.sharesCount}</span>
                      </button>

                      {/* Bookmark / Save Action */}
                      <button 
                        type="button" 
                        className={`reel-stat-btn ${isSaved ? 'active-save' : ''}`}
                        onClick={(e) => toggleSave(reel.id, e)}
                        aria-label="Save reel"
                      >
                        <div className="stat-icon-wrapper">
                          <Bookmark 
                            size={22} 
                            stroke="#ffffff" 
                            fill={isSaved ? '#c5a059' : 'none'} 
                          />
                        </div>
                        <span className="stat-count">{reel.savesCount}</span>
                      </button>

                      {/* Rotating Vinyl Audio Disc */}
                      <div 
                        className="reel-audio-disc"
                        onClick={toggleMute}
                        title={isMuted ? 'Tap to listen' : 'Audio playing'}
                      >
                        <div className={`disc-vinyl ${isReelActive && !isMuted ? 'spinning' : ''}`}>
                          <div className="disc-groove" />
                          <div className="disc-center">
                            <Music size={11} className="disc-music-icon" />
                          </div>
                        </div>
                        <span className="disc-note-particle">♪</span>
                      </div>
                    </div>

                    {/* =======================================================
                        INSTAGRAM REEL OVERLAY: UPLOADER INFO (BOTTOM LEFT)
                        ======================================================= */}
                    <div className="reel-uploader-info">
                      {/* Creator Row */}
                      <div className="uploader-header-row">
                        <div className="uploader-avatar-ring">
                          <div className="uploader-avatar-inner">
                            <span>SVC</span>
                          </div>
                        </div>

                        <div className="uploader-names">
                          <div className="username-verified-line">
                            <span className="uploader-handle">@{reel.username}</span>
                            {/* Official Instagram Style Verified Blue Tick Badge */}
                            <svg 
                              className="verified-badge-svg" 
                              viewBox="0 0 24 24" 
                              width="14" 
                              height="14" 
                              fill="#0095f6" 
                              aria-label="Verified creator"
                            >
                              <path d="M10.067.87a2.89 2.89 0 0 1 3.866 0l1.64 1.44a2.89 2.89 0 0 0 2.454.656l2.16-.39a2.89 2.89 0 0 1 3.298 2.396l.39 2.16a2.89 2.89 0 0 0 .656 2.454l1.44 1.64a2.89 2.89 0 0 1 0 3.866l-1.44 1.64a2.89 2.89 0 0 0-.656 2.454l-.39 2.16a2.89 2.89 0 0 1-2.396 3.298l-2.16.39a2.89 2.89 0 0 0-2.454.656l-1.64 1.44a2.89 2.89 0 0 1-3.866 0l-1.64-1.44a2.89 2.89 0 0 0-2.454-.656l-2.16.39a2.89 2.89 0 0 1-3.298-2.396l-.39-2.16a2.89 2.89 0 0 0-.656-2.454l-1.44-1.64a2.89 2.89 0 0 1 0-3.866l1.44-1.64a2.89 2.89 0 0 0 .656-2.454l.39-2.16A2.89 2.89 0 0 1 4.54 1.93l2.16-.39a2.89 2.89 0 0 0 2.454-.656l1.64-1.44zM9.5 15.5l7-7-1.41-1.41-5.59 5.59-2.59-2.59-1.41 1.41 4 4z"/>
                            </svg>
                          </div>
                          <span className="uploader-subline">{reel.category}</span>
                        </div>

                        <button 
                          type="button" 
                          className={`reel-follow-btn ${isFollowing ? 'following' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFollowing(!isFollowing);
                          }}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>

                      {/* Caption & Hashtags */}
                      <p className="reel-caption-text">
                        {reel.caption}
                      </p>

                      {/* Audio Ticker Row */}
                      <div className="reel-audio-ticker" onClick={toggleMute}>
                        <Music size={12} className="ticker-music-icon" />
                        <div className="ticker-marquee-wrapper">
                          <span className="ticker-text">{reel.audio} • Original Production</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Phone Home Indicator Bar */}
          <div className="phone-bottom-bar">
            <div className="home-indicator" />
          </div>
        </div>

        {/* External Vertical Carousel Controls & Dots */}
        <div className="reels-external-controls">
          <button 
            type="button" 
            className="carousel-arrow-btn up"
            onClick={handlePrev}
            aria-label="Previous reel"
            title="Previous reel"
          >
            <ChevronUp size={16} />
          </button>

          <div className="carousel-dots-col">
            {REELS_DATA.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot-pip ${currentIndex === i ? 'active' : ''}`}
                onClick={(e) => handleSelectReel(i, e)}
                aria-label={`Jump to reel 0${i + 1}`}
                title={`Reel 0${i + 1}`}
              >
                <span className="pip-num">0{i + 1}</span>
              </button>
            ))}
          </div>

          <button 
            type="button" 
            className="carousel-arrow-btn down"
            onClick={handleNext}
            aria-label="Next reel"
            title="Next reel"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Floating Meta Chip below the phone */}
      <div className="phone-meta-chip">
        <span className="chip-pulsing-dot" />
        <span className="chip-text">
          AUTO-PLAYING 5S REELS • <strong className="chip-highlight">4 VIRAL CAMPAIGNS</strong>
        </span>
        <button 
          type="button" 
          className="chip-fullscreen-btn"
          onClick={() => handleOpenFullReel(currentReel.reelType)}
        >
          <Play size={10} fill="currentColor" />
          <span>FULL REEL</span>
        </button>
      </div>
    </div>
  );
});

export default React.memo(InstagramReelsShowcase);
