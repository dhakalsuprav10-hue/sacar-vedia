import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Play, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './ShowreelModal.css';

const REEL_PROJECTS = [
  {
    id: 'vertical',
    title: 'Euporae Multi Collagen',
    type: 'VERTICAL REEL COMMERCIAL',
    duration: '00:15',
    image: '/videos/posters/commercial-03.jpg',
    videoSrc: '/videos/commercial-03.mp4',
    aspectRatio: '9/16',
    description: 'High-converting 9:16 vertical commercial for Euporae Multi Collagen. Tailored for TikTok & Instagram Reels with macro cellular hydration & photorealistic generative direction.',
    directorNotes: 'Vertical mobile-first cinematography focusing on skin hydration, photorealistic generative talent, and macro product visuals.',
    tools: ['Vertical Cinema 9:16', 'Photorealistic AI Talent', 'Macro VFX', 'Mobile Social Pipeline'],
    likes: '1.4M',
    comments: '48K',
    shares: '115K',
    audioTag: '@sacarvedia • Original Audio'
  },
  {
    id: 'music',
    title: 'Live Music Pub — Kathmandu',
    type: 'CINEMATIC MUSIC VIDEO',
    duration: '00:14',
    image: '/videos/posters/music-video-01.jpg',
    videoSrc: '/videos/music-video-01.mp4',
    aspectRatio: '16/9',
    description: 'Full-length cinematic music video set against the atmospheric, rainy night streets of Kathmandu outside a glowing live music pub.',
    directorNotes: 'Moody Kathmandu rainy night grading, beat-synced narrative pacing, anamorphic lens flares, and authentic acoustic performance.',
    tools: ['Cinematic AI Direction', '24fps Anamorphic Pipeline', 'DaVinci Resolve Studio', 'Neural Color Grading'],
    likes: '2.1M',
    comments: '89K',
    shares: '230K',
    audioTag: 'Live Music Pub • Official Track'
  },
  {
    id: 'film',
    title: 'Hello Smart Lighting Solutions',
    type: 'AI BRAND COMMERCIAL',
    duration: '00:15',
    image: '/videos/posters/commercial-01.jpg',
    videoSrc: '/videos/commercial-01.mp4',
    aspectRatio: '16/9',
    description: 'Commercial advertisement for Hello Smart Trade Pvt. Ltd. showcasing architectural smart lighting, crystal chandeliers, and commercial electrical solutions across Nepal.',
    directorNotes: 'Rendered with photorealistic architectural raytracing, dynamic ambient lighting transitions, and clear corporate brand storytelling.',
    tools: ['Generative Neural Video', 'ComfyUI Lighting', 'DaVinci Resolve', 'AI Voice Synthesis'],
    likes: '980K',
    comments: '32K',
    shares: '88K',
    audioTag: '@sacarvedia • Brand Score'
  },
  {
    id: 'commercial',
    title: 'Sahayatri Auto Care Campaign',
    type: 'AI SPOKESPERSON COMMERCIAL',
    duration: '00:16',
    image: '/videos/posters/commercial-02.jpg',
    videoSrc: '/videos/commercial-02.mp4',
    aspectRatio: '16/9',
    description: 'Promotional commercial for Sahayatri Auto Care in Naya Thimi, Bhaktapur. Highlights free bike & scooter servicing, washing, and trading with an AI video spokesperson.',
    directorNotes: 'Hyper-realistic digital brand ambassador integration with synchronized Nepali speech, expressive gesturing, and real location composite.',
    tools: ['AI Video Avatar', 'Neural Lip-Sync', 'Location Composite', 'Audio Mastering'],
    likes: '1.5M',
    comments: '56K',
    shares: '128K',
    audioTag: 'Sahayatri Auto Care • Promo Audio'
  }
];

export default function ShowreelModal({ isOpen, onClose, initialCategory = 'vertical', onStartProject }) {
  const getInitialIndex = useCallback(() => {
    const idx = REEL_PROJECTS.findIndex(p => p.id === initialCategory);
    return idx !== -1 ? idx : 0;
  }, [initialCategory]);

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [selectedId, setSelectedId] = useState(() => REEL_PROJECTS[getInitialIndex()].id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [showNotes, setShowNotes] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const feedContainerRef = useRef(null);
  const slideRefs = useRef([]);
  const feedVideoRefs = useRef([]);
  const timelineFillRef = useRef(null);

  // Synchronize category state when isOpen or initialCategory changes
  useEffect(() => {
    if (isOpen) {
      const initialIdx = Math.max(0, REEL_PROJECTS.findIndex(p => p.id === initialCategory));
      setActiveIndex(initialIdx);
      setSelectedId(REEL_PROJECTS[initialIdx].id);
      setIsPlaying(true);
      if (timelineFillRef.current) {
        timelineFillRef.current.style.width = '0%';
      }

      // Fast layout synchronization to active slide
      requestAnimationFrame(() => {
        if (slideRefs.current[initialIdx]) {
          slideRefs.current[initialIdx].scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      });
    }
  }, [isOpen, initialCategory]);

  const activeProject = REEL_PROJECTS[activeIndex] || REEL_PROJECTS[0];

  const togglePlay = useCallback(() => {
    const activeVid = feedVideoRefs.current[activeIndex];
    if (activeVid) {
      if (activeVid.paused) {
        activeVid.play().catch(() => {});
        setIsPlaying(true);
      } else {
        activeVid.pause();
        setIsPlaying(false);
      }
    }
  }, [activeIndex]);

  const handleSelectProject = (id) => {
    const targetIdx = REEL_PROJECTS.findIndex(p => p.id === id);
    if (targetIdx !== -1) {
      setActiveIndex(targetIdx);
      setSelectedId(id);
      if (slideRefs.current[targetIdx]) {
        slideRefs.current[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setShowNotes(false);
    setShowSwitcher(false);
  };

  // IntersectionObserver for vertical swipe / scroll feed
  useEffect(() => {
    if (!isOpen) return;

    const container = feedContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          const vid = feedVideoRefs.current[idx];

          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActiveIndex(idx);
            setSelectedId(REEL_PROJECTS[idx].id);
            if (vid) {
              vid.muted = isMuted;
              const playPromise = vid.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            }
            setIsPlaying(true);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.4) {
            if (vid && !vid.paused) {
              try {
                vid.pause();
              } catch (err) {}
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.1, 0.55, 0.85]
      }
    );

    slideRefs.current.forEach((slideEl) => {
      if (slideEl) observer.observe(slideEl);
    });

    return () => {
      observer.disconnect();
    };
  }, [isOpen, isMuted]);

  // Keyboard navigation (ESC to close, Space to toggle play, Arrow keys to navigate slides)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = Math.min(activeIndex + 1, REEL_PROJECTS.length - 1);
        handleSelectProject(REEL_PROJECTS[nextIdx].id);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = Math.max(activeIndex - 1, 0);
        handleSelectProject(REEL_PROJECTS[prevIdx].id);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, togglePlay, activeIndex]);

  if (!isOpen) return null;

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    feedVideoRefs.current.forEach((vid) => {
      if (vid) vid.muted = nextMute;
    });
  };

  const toggleLike = (e) => {
    if (e) e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [activeProject.id]: !prev[activeProject.id] }));
  };

  const toggleSave = (e) => {
    if (e) e.stopPropagation();
    setSavedMap(prev => ({ ...prev, [activeProject.id]: !prev[activeProject.id] }));
  };

  // Direct DOM timeline update to avoid React re-render churn during video playback
  const handleTimeUpdate = (e) => {
    const vid = e.currentTarget;
    if (vid && vid.duration && timelineFillRef.current) {
      const pct = (vid.currentTime / vid.duration) * 100;
      timelineFillRef.current.style.width = `${pct}%`;
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    if (timelineFillRef.current) {
      timelineFillRef.current.style.width = `${pos}%`;
    }
    const currentVid = feedVideoRefs.current[activeIndex];
    if (currentVid && currentVid.duration) {
      currentVid.currentTime = (pos / 100) * currentVid.duration;
    }
  };

  const isCurrentLiked = Boolean(likedMap[activeProject.id]);
  const isCurrentSaved = Boolean(savedMap[activeProject.id]);

  return (
    <div className="reel-modal-backdrop" onClick={onClose}>
      {/* Strict 9:16 Portrait Smartphone Container */}
      <div 
        className="reel-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vertical Feed Container with Native GPU-Accelerated Scroll Snap */}
        <div className="reel-feed-container" ref={feedContainerRef}>
          {REEL_PROJECTS.map((project, idx) => {
            const isAdjacent = Math.abs(idx - activeIndex) <= 1;
            const isActive = idx === activeIndex;

            return (
              <div 
                key={project.id} 
                className="reel-feed-slide"
                ref={(el) => (slideRefs.current[idx] = el)}
                data-index={idx}
              >
                <div className="reel-video-wrapper" onClick={togglePlay}>
                  {/* Conditional Rendering & Lazy Loading: Only active & adjacent mount video elements */}
                  {isAdjacent ? (
                    <video 
                      ref={(el) => (feedVideoRefs.current[idx] = el)}
                      src={project.videoSrc}
                      poster={project.image}
                      playsInline
                      loop
                      muted={isMuted}
                      preload={isActive ? 'auto' : 'metadata'}
                      className="reel-fullscreen-video"
                      onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                      onEnded={() => { if (isActive) setIsPlaying(false); }}
                    />
                  ) : (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="reel-fullscreen-video reel-fullscreen-poster" 
                      loading="lazy" 
                    />
                  )}

                  {/* Cinematic Vignette Overlays for Maximum Contrast */}
                  <div className="reel-top-vignette" />
                  <div className="reel-bottom-vignette" />

                  {/* Center Play/Pause Indicator Pulse */}
                  {isActive && !isPlaying && (
                    <div className="reel-paused-indicator">
                      <div className="paused-circle">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================================
            TOP OVERLAY BAR: SWITCHER, SOUND, CLOSE
            =================================================================== */}
        <div className="reel-top-bar">
          {/* Production Switcher Pills */}
          <div className="reel-top-pills">
            {REEL_PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                type="button"
                className={`top-pill-btn ${selectedId === proj.id ? 'active' : ''}`}
                onClick={() => handleSelectProject(proj.id)}
                title={proj.title}
              >
                <span>0{idx + 1}</span>
              </button>
            ))}
            
            <button 
              type="button" 
              className={`top-switcher-trigger ${showSwitcher ? 'active' : ''}`}
              onClick={() => setShowSwitcher(!showSwitcher)}
              title="All Productions"
            >
              <Layers size={13} />
              <span>REELS</span>
              <ChevronDown size={12} className={`chevron-icon ${showSwitcher ? 'open' : ''}`} />
            </button>
          </div>

          {/* Top Actions: Mute & Close */}
          <div className="reel-top-actions">
            <button 
              type="button" 
              className="reel-icon-btn sound-btn" 
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            <button 
              type="button" 
              className="reel-icon-btn close-btn" 
              onClick={onClose}
              title="Close Reel (ESC)"
              aria-label="Close Reel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ===================================================================
            POPUP PRODUCTION SWITCHER DRAWER (CLICK "REELS" TO OPEN)
            =================================================================== */}
        {showSwitcher && (
          <div className="reel-switcher-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">SELECT PRODUCTION</span>
              <button 
                type="button" 
                className="drawer-close" 
                onClick={() => setShowSwitcher(false)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="drawer-list">
              {REEL_PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  className={`drawer-card ${selectedId === proj.id ? 'active' : ''}`}
                  onClick={() => handleSelectProject(proj.id)}
                >
                  <img src={proj.image} alt={proj.title} className="drawer-thumb" />
                  <div className="drawer-card-meta">
                    <span className="drawer-cat">{proj.type}</span>
                    <span className="drawer-card-title">{proj.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            FLOATING RIGHT-SIDE ACTION BUTTONS (INSTAGRAM REELS STYLE)
            =================================================================== */}
        <div className="reel-floating-actions" onClick={(e) => e.stopPropagation()}>
          {/* Like Button */}
          <button 
            type="button" 
            className={`action-btn ${isCurrentLiked ? 'liked' : ''}`}
            onClick={toggleLike}
            aria-label="Like reel"
          >
            <div className="action-icon-circle">
              <Heart 
                size={23} 
                fill={isCurrentLiked ? '#ff3040' : 'none'} 
                stroke={isCurrentLiked ? '#ff3040' : '#ffffff'} 
                className={isCurrentLiked ? 'heart-pop' : ''}
              />
            </div>
            <span className="action-count">{isCurrentLiked ? '1.5M' : activeProject.likes}</span>
          </button>

          {/* Comment / Inquire */}
          <button 
            type="button" 
            className="action-btn"
            onClick={() => {
              onClose();
              if (onStartProject) onStartProject();
            }}
            aria-label="Start Inquiry"
            title="Comment / Commission"
          >
            <div className="action-icon-circle">
              <MessageCircle size={22} stroke="#ffffff" fill="none" />
            </div>
            <span className="action-count">{activeProject.comments}</span>
          </button>

          {/* Share */}
          <button 
            type="button" 
            className="action-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: activeProject.title, url: window.location.href }).catch(() => {});
              }
            }}
            aria-label="Share reel"
          >
            <div className="action-icon-circle">
              <Send size={21} stroke="#ffffff" fill="none" className="share-icon" />
            </div>
            <span className="action-count">{activeProject.shares}</span>
          </button>

          {/* Save */}
          <button 
            type="button" 
            className={`action-btn ${isCurrentSaved ? 'saved' : ''}`}
            onClick={toggleSave}
            aria-label="Save reel"
          >
            <div className="action-icon-circle">
              <Bookmark 
                size={22} 
                stroke="#ffffff" 
                fill={isCurrentSaved ? '#38bdf8' : 'none'} 
              />
            </div>
            <span className="action-count">Save</span>
          </button>

          {/* Director's Notes & Details Toggle Button */}
          <button 
            type="button" 
            className={`action-btn notes-toggle-btn ${showNotes ? 'active' : ''}`}
            onClick={() => setShowNotes(!showNotes)}
            aria-label="Toggle Director Notes"
            title="Director Notes & Tools"
          >
            <div className="action-icon-circle">
              <Sparkles size={20} stroke="#ffffff" fill={showNotes ? '#38bdf8' : 'none'} />
            </div>
            <span className="action-count">Notes</span>
          </button>

          {/* Spinning Audio Vinyl Disc */}
          <div 
            className="reel-vinyl-disc"
            onClick={toggleMute}
            title={isMuted ? 'Tap to unmute' : 'Audio active'}
          >
            <div className={`disc-record ${isPlaying && !isMuted ? 'spinning' : ''}`}>
              <div className="disc-inner-groove" />
              <div className="disc-center-dot">
                <Music size={11} className="disc-note-icon" />
              </div>
            </div>
            <span className="disc-sound-wave">♪</span>
          </div>
        </div>

        {/* ===================================================================
            BOTTOM-LEFT REELS OVERLAY: UPLOADER, CAPTION, AUDIO
            =================================================================== */}
        <div className="reel-bottom-info" onClick={(e) => e.stopPropagation()}>
          {/* Uploader Row */}
          <div className="reel-uploader-bar">
            <div className="uploader-avatar-ring">
              <div className="uploader-avatar-badge">SVC</div>
            </div>

            <div className="uploader-identity">
              <div className="handle-verified-row">
                <span className="uploader-handle">@sacarvedia</span>
                <svg 
                  className="verified-tick-svg" 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  fill="#0095f6" 
                  aria-label="Verified"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 1 3.866 0l1.64 1.44a2.89 2.89 0 0 0 2.454.656l2.16-.39a2.89 2.89 0 0 1 3.298 2.396l.39 2.16a2.89 2.89 0 0 0 .656 2.454l1.44 1.64a2.89 2.89 0 0 1 0 3.866l-1.44 1.64a2.89 2.89 0 0 0-.656 2.454l-.39 2.16a2.89 2.89 0 0 1-2.396 3.298l-2.16.39a2.89 2.89 0 0 0-2.454.656l-1.64 1.44a2.89 2.89 0 0 1-3.866 0l-1.64-1.44a2.89 2.89 0 0 0-2.454-.656l-2.16.39a2.89 2.89 0 0 1-3.298-2.396l-.39-2.16a2.89 2.89 0 0 0-.656-2.454l-1.44-1.64a2.89 2.89 0 0 1 0-3.866l1.44-1.64a2.89 2.89 0 0 0 .656-2.454l.39-2.16A2.89 2.89 0 0 1 4.54 1.93l2.16-.39a2.89 2.89 0 0 0 2.454-.656l1.64-1.44zM9.5 15.5l7-7-1.41-1.41-5.59 5.59-2.59-2.59-1.41 1.41 4 4z"/>
                </svg>
              </div>
              <span className="project-type-label">{activeProject.type}</span>
            </div>

            <button 
              type="button" 
              className={`follow-toggle-btn ${isFollowing ? 'active' : ''}`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Project Title */}
          <h2 className="reel-title-heading">{activeProject.title}</h2>

          {/* Caption & Expandable Notes */}
          <div className="reel-caption-block">
            <p className={`caption-paragraph ${showNotes ? 'expanded' : ''}`}>
              {activeProject.description}
            </p>

            {/* Expandable Director's Notes & Tools */}
            {showNotes && (
              <div className="director-notes-overlay-box">
                <div className="notes-header-chip">
                  <Sparkles size={11} /> DIRECTOR'S NOTES
                </div>
                <p className="notes-text">{activeProject.directorNotes}</p>
                <div className="notes-tools-row">
                  {activeProject.tools.map(tool => (
                    <span key={tool} className="note-tool-pill">
                      <CheckCircle2 size={10} className="pill-check" /> {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="button" 
              className="caption-expand-toggle"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? (
                <><span>Less info</span> <ChevronUp size={12} /></>
              ) : (
                <><span>...more info</span> <ChevronDown size={12} /></>
              )}
            </button>
          </div>

          {/* Audio Tag */}
          <div className="reel-audio-bar" onClick={toggleMute}>
            <Music size={12} className="audio-note-icon" />
            <span className="audio-title">{activeProject.audioTag}</span>
          </div>
        </div>

        {/* ===================================================================
            SLIM BOTTOM PROGRESS TIMELINE
            =================================================================== */}
        <div 
          className="reel-bottom-timeline"
          onClick={handleSeek}
          title="Click to seek"
        >
          <div className="timeline-fill-bar" ref={timelineFillRef} style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  );
}
