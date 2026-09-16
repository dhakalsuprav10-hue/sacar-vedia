import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ArrowUpRight, 
  Film, 
  Music,
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import { COMMERCIAL_PROJECTS } from '../data/commercialProjects';
import './CommercialShowcase.css';

export default function CommercialShowcase({ onStartProject, onCreateSimilar }) {
  // State for inline card playback
  const [activeInlineId, setActiveInlineId] = useState(null);
  
  // State for Cinema Fullscreen Lightbox
  const [fullscreenProject, setFullscreenProject] = useState(null);
  const [isFullscreenPlaying, setIsFullscreenPlaying] = useState(true);
  const [isFullscreenMuted, setIsFullscreenMuted] = useState(false);
  const [fullscreenProgress, setFullscreenProgress] = useState(0);
  const [fullscreenTime, setFullscreenTime] = useState('00:00');
  const [fullscreenDurationStr, setFullscreenDurationStr] = useState('00:00');
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  // Refs
  const inlineVideoRefs = useRef({});
  const fullscreenVideoRef = useRef(null);
  const theaterStageRef = useRef(null);
  const trackRef = useRef(null);

  // Smoothly scroll horizontal track
  const handleScrollTrack = (direction) => {
    if (trackRef.current) {
      const scrollStep = window.innerWidth < 640 ? 320 : 520;
      trackRef.current.scrollBy({ left: direction * scrollStep, behavior: 'smooth' });
    }
  };

  // Stop inline video playback
  const handleStopInlineVideo = (e, projectId) => {
    if (e) e.stopPropagation();
    if (inlineVideoRefs.current[projectId]) {
      inlineVideoRefs.current[projectId].pause();
      inlineVideoRefs.current[projectId].currentTime = 0;
    }
    setActiveInlineId(null);
  };

  // Start inline video playback
  const handlePlayInlineVideo = (projectId) => {
    // Pause any active inline video
    if (activeInlineId && inlineVideoRefs.current[activeInlineId]) {
      inlineVideoRefs.current[activeInlineId].pause();
    }

    setActiveInlineId(projectId);

    setTimeout(() => {
      if (inlineVideoRefs.current[projectId]) {
        inlineVideoRefs.current[projectId].play().catch(() => {});
      }
    }, 50);
  };

  // Open video in Fullscreen Cinema Lightbox (preserving original aspect ratio)
  const handleOpenFullscreen = (project, startAtCurrentTime = true) => {
    let initialTime = 0;

    // If already playing inline, capture current timestamp and pause inline
    if (activeInlineId === project.id && inlineVideoRefs.current[project.id]) {
      initialTime = inlineVideoRefs.current[project.id].currentTime;
      inlineVideoRefs.current[project.id].pause();
      setActiveInlineId(null);
    } else if (activeInlineId && inlineVideoRefs.current[activeInlineId]) {
      inlineVideoRefs.current[activeInlineId].pause();
      setActiveInlineId(null);
    }

    setFullscreenProject(project);
    setIsFullscreenPlaying(true);
    setFullscreenProgress(0);
    setFullscreenTime('00:00');

    setTimeout(() => {
      if (fullscreenVideoRef.current) {
        if (startAtCurrentTime && initialTime > 0) {
          fullscreenVideoRef.current.currentTime = initialTime;
        }
        fullscreenVideoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  // Close Fullscreen Cinema Lightbox
  const handleCloseFullscreen = useCallback(() => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setFullscreenProject(null);
    setIsFullscreenPlaying(false);
  }, []);

  // Toggle Fullscreen Play / Pause
  const toggleFullscreenPlay = useCallback(() => {
    if (!fullscreenVideoRef.current) return;
    if (isFullscreenPlaying) {
      fullscreenVideoRef.current.pause();
      setIsFullscreenPlaying(false);
    } else {
      fullscreenVideoRef.current.play().catch(() => {});
      setIsFullscreenPlaying(true);
    }
  }, [isFullscreenPlaying]);

  // Toggle Fullscreen Mute
  const toggleFullscreenMute = useCallback(() => {
    if (!fullscreenVideoRef.current) return;
    const nextMuted = !isFullscreenMuted;
    fullscreenVideoRef.current.muted = nextMuted;
    setIsFullscreenMuted(nextMuted);
  }, [isFullscreenMuted]);

  // Seek relative seconds (-5s / +5s)
  const handleSkipTime = useCallback((deltaSeconds) => {
    if (!fullscreenVideoRef.current) return;
    const current = fullscreenVideoRef.current.currentTime;
    const duration = fullscreenVideoRef.current.duration || 0;
    fullscreenVideoRef.current.currentTime = Math.max(0, Math.min(duration, current + deltaSeconds));
  }, []);

  // Handle timeline scrubber scrub/click
  const handleTimelineScrub = (e) => {
    if (!fullscreenVideoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const duration = fullscreenVideoRef.current.duration || 0;
    fullscreenVideoRef.current.currentTime = percentage * duration;
    setFullscreenProgress(percentage * 100);
  };

  // Native Fullscreen Toggle
  const toggleNativeFullscreen = useCallback(() => {
    if (!theaterStageRef.current) return;

    if (!document.fullscreenElement) {
      theaterStageRef.current.requestFullscreen().catch(() => {});
      setIsNativeFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsNativeFullscreen(false);
    }
  }, []);

  // Switch between projects in Fullscreen Theater
  const handleSwitchFullscreenProject = (direction) => {
    if (!fullscreenProject) return;
    const currentIndex = COMMERCIAL_PROJECTS.findIndex(p => p.id === fullscreenProject.id);
    const newIndex = (currentIndex + direction + COMMERCIAL_PROJECTS.length) % COMMERCIAL_PROJECTS.length;
    handleOpenFullscreen(COMMERCIAL_PROJECTS[newIndex], false);
  };

  // Keyboard controls for Fullscreen Theater
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreenProject) return;

      if (e.key === 'Escape') {
        handleCloseFullscreen();
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleFullscreenPlay();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSkipTime(5);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSkipTime(-5);
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleFullscreenMute();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleNativeFullscreen();
      }
    };

    if (fullscreenProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fullscreenProject, 
    handleCloseFullscreen, 
    toggleFullscreenPlay, 
    handleSkipTime, 
    toggleFullscreenMute, 
    toggleNativeFullscreen
  ]);

  return (
    <section className="commercial-showcase-section" id="work">
      {/* Background Ambience */}
      <div className="showcase-bg-grid" aria-hidden="true" />
      <div className="showcase-glow-radial" aria-hidden="true" />

      <div className="showcase-content-wrapper">
        {/* Section Header & Horizontal Nav Controls */}
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <div className="section-pill reveal-text">
              <Sparkles size={12} className="pill-sparkle" />
              <span>COMMERCIAL SHOWCASE</span>
            </div>
            <h2 className="showcase-title reveal-text reveal-delay-1">
              COMMERCIAL <span className="title-champagne">SHOWCASE.</span>
            </h2>
            <p className="showcase-subtitle reveal-text reveal-delay-2">
              High-impact commercial ads, AI cinema &amp; viral reels by Sakar Vedia.
            </p>
          </div>

          {/* Horizontal Track Navigation Controls */}
          <div className="horizontal-nav-controls">
            <span className="horizontal-swipe-hint">
              <span>SWIPE / SCROLL HORIZONTALLY</span>
              <span className="swipe-arrow-anim">→</span>
            </span>
            <div className="nav-arrow-buttons">
              <button 
                type="button" 
                className="track-arrow-btn"
                onClick={() => handleScrollTrack(-1)}
                aria-label="Scroll left through showcase videos"
                title="Previous Showcase Video"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                className="track-arrow-btn"
                onClick={() => handleScrollTrack(1)}
                aria-label="Scroll right through showcase videos"
                title="Next Showcase Video"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Container (flexbox, overflow-x: auto, scroll-snap-type: x mandatory) */}
        <div className="commercials-horizontal-track" ref={trackRef}>
          {COMMERCIAL_PROJECTS.map((project, index) => {
            const isPlayingInline = activeInlineId === project.id;
            const isVertical = project.aspectRatio === '9/16';

            return (
              <article 
                key={project.id} 
                className={`commercial-horizontal-card ${isVertical ? 'card-vertical-layout' : 'card-widescreen-layout'} ${isPlayingInline ? 'is-playing' : ''}`}
                id={`card-${project.id}`}
              >
                {/* Media Container */}
                <div 
                  className={`card-media-wrapper ${isVertical ? 'media-vertical' : 'media-widescreen'}`}
                  onClick={() => !isPlayingInline && handlePlayInlineVideo(project.id)}
                >
                  <video
                    ref={(el) => (inlineVideoRefs.current[project.id] = el)}
                    src={project.videoSrc}
                    poster={project.poster}
                    controls={isPlayingInline}
                    playsInline
                    preload="metadata"
                    className={`card-video-element ${isPlayingInline ? 'video-active' : 'video-hidden'}`}
                    style={{
                      objectFit: isVertical ? 'cover' : 'cover',
                      backgroundColor: '#050709',
                    }}
                    onEnded={() => setActiveInlineId(null)}
                  />

                  {/* Idle Poster & Interactive Overlay */}
                  {!isPlayingInline && (
                    <div className="card-idle-overlay">
                      <img 
                        src={project.poster} 
                        alt={project.title}
                        className="card-poster-image"
                        loading="lazy"
                        decoding="async"
                        width="640"
                        height="360"
                        style={{
                          objectFit: isVertical ? 'cover' : 'cover',
                          backgroundColor: '#050709',
                        }}
                      />
                      <div className="card-gradient-vignette" />

                      {/* Top Bar Badges */}
                      <div className="card-top-bar">
                        <div className="card-category-pill">
                          {project.category === 'MUSIC VIDEO' ? (
                            <Music size={11} className="category-icon" />
                          ) : (
                            <Film size={11} className="category-icon" />
                          )}
                          <span>{project.category}</span>
                        </div>
                        <div className="card-aspect-pill">
                          {isVertical ? <Smartphone size={10} /> : <Monitor size={10} />}
                          <span>{project.aspectRatio}</span>
                        </div>
                      </div>

                      {/* Central Play Trigger Button */}
                      <button
                        type="button"
                        className="card-play-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayInlineVideo(project.id);
                        }}
                        aria-label={`Preview ${project.title}`}
                      >
                        <div className="card-play-core">
                          <Play size={22} className="card-play-icon" />
                        </div>
                        <span className="card-play-text">QUICK PREVIEW</span>
                      </button>

                      {/* Bottom Duration & Format Bar */}
                      <div className="card-bottom-bar">
                        <span className="card-format-tag">
                          {isVertical ? '9:16 VERTICAL SPOT' : project.category === 'MUSIC VIDEO' ? '16:9 MUSIC VIDEO' : '16:9 CINEMA SPOT'}
                        </span>
                        <span className="card-duration-tag">{project.duration}</span>
                      </div>
                    </div>
                  )}

                  {/* Inline Playback Overlay Controls */}
                  {isPlayingInline && (
                    <div className="card-playing-controls">
                      <button
                        type="button"
                        className="card-expand-full-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFullscreen(project, true);
                        }}
                        title="Watch Fullscreen in Original Aspect Ratio"
                        aria-label="Watch Fullscreen in Original Aspect Ratio"
                      >
                        <Maximize2 size={13} />
                        <span>WATCH FULLSCREEN</span>
                      </button>

                      <button
                        type="button"
                        className="card-stop-btn"
                        onClick={(e) => handleStopInlineVideo(e, project.id)}
                        title="Close Video Preview"
                        aria-label="Close Video Preview"
                      >
                        <X size={14} />
                        <span>CLOSE</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Content & Details */}
                <div className="card-horizontal-info">
                  <div className="card-header-meta">
                    <span className="card-number">0{index + 1}</span>
                    <span className="card-meta-ratio">
                      {isVertical ? <Smartphone size={11} /> : <Monitor size={11} />}
                      {project.aspectRatioLabel || (isVertical ? '9:16 VERTICAL' : '16:9 WIDESCREEN')}
                    </span>
                  </div>

                  <h3 className="card-title">{project.title}</h3>
                  <span className="card-client-tag">{project.client}</span>
                  <p className="card-description">{project.description}</p>

                  {/* =======================================================
                      HIGH-FOCUS 'CREATE SIMILAR TO THIS ONE' HERO ACTION
                      ======================================================= */}
                  <button
                    type="button"
                    className="card-create-similar-hero-btn"
                    onClick={() => {
                      if (onCreateSimilar) {
                        onCreateSimilar(project);
                      } else if (onStartProject) {
                        onStartProject({ title: project.title, category: project.category });
                      }
                    }}
                    id={`btn-create-similar-${project.id}`}
                    aria-label={`Create video project similar to ${project.title}`}
                  >
                    <div className="similar-hero-badge">
                      <Sparkles size={11} className="badge-sparkle-icon" />
                      <span>INSTANT BRIEF</span>
                    </div>
                    <span className="similar-hero-text">CREATE SIMILAR TO THIS ONE</span>
                    <ArrowDown size={15} className="similar-hero-arrow" />
                  </button>

                  {/* Secondary Action Buttons */}
                  <div className="card-secondary-actions">
                    <button 
                      type="button" 
                      className="card-action-primary"
                      onClick={() => handleOpenFullscreen(project, false)}
                      aria-label={`Watch full video of ${project.title} in original aspect ratio`}
                    >
                      <Maximize2 size={14} className="btn-icon-left" />
                      <span>WATCH FULL VIDEO</span>
                    </button>

                    <button
                      type="button"
                      className="card-action-secondary"
                      onClick={(e) => {
                        if (isPlayingInline) {
                          handleStopInlineVideo(e, project.id);
                        } else {
                          handlePlayInlineVideo(project.id);
                        }
                      }}
                    >
                      {isPlayingInline ? (
                        <>
                          <X size={13} />
                          <span>STOP</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} />
                          <span>PREVIEW</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="card-tags-list">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="card-mini-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          CINEMA FULLSCREEN THEATER LIGHTBOX (ORIGINAL ASPECT RATIO)
          =================================================================== */}
      {fullscreenProject && (
        <div 
          className="cinema-theater-backdrop" 
          onClick={handleCloseFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label={`Theater View: ${fullscreenProject.title}`}
        >
          <div 
            className={`cinema-theater-container ${fullscreenProject.aspectRatio === '9/16' ? 'ratio-vertical' : 'ratio-widescreen'}`}
            onClick={(e) => e.stopPropagation()}
            ref={theaterStageRef}
          >
            {/* Top Bar Header */}
            <div className="theater-header-bar">
              <div className="theater-title-group">
                <div className="theater-badges-row">
                  <span className="theater-badge-cat">{fullscreenProject.category}</span>
                  <span className="theater-badge-ratio">
                    {fullscreenProject.aspectRatio === '9/16' ? (
                      <>
                        <Smartphone size={12} />
                        <span>9:16 VERTICAL SPOT • ORIGINAL ASPECT RATIO</span>
                      </>
                    ) : (
                      <>
                        <Monitor size={12} />
                        <span>16:9 WIDESCREEN CINEMA • ORIGINAL ASPECT RATIO</span>
                      </>
                    )}
                  </span>
                </div>
                <h2 className="theater-title">{fullscreenProject.title}</h2>
                <span className="theater-client">{fullscreenProject.client}</span>
              </div>

              {/* Header Right Actions */}
              <div className="theater-header-actions">
                <button
                  type="button"
                  className="theater-ctrl-btn"
                  onClick={toggleNativeFullscreen}
                  title="Toggle Fullscreen (F)"
                  aria-label="Toggle Fullscreen"
                >
                  {isNativeFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                <button 
                  type="button" 
                  className="theater-close-btn"
                  onClick={handleCloseFullscreen}
                  title="Close Theater View (ESC)"
                  aria-label="Close Theater View"
                >
                  <X size={20} />
                  <span className="close-label">ESC</span>
                </button>
              </div>
            </div>

            {/* Video Stage Frame (strictly formatted in original aspect ratio) */}
            <div 
              className={`theater-stage-frame ${fullscreenProject.aspectRatio === '9/16' ? 'frame-vertical' : 'frame-widescreen'}`}
              onClick={toggleFullscreenPlay}
            >
              <video 
                ref={fullscreenVideoRef}
                src={fullscreenProject.videoSrc}
                poster={fullscreenProject.poster}
                playsInline
                autoPlay
                className="theater-video-element"
                style={{
                  objectFit: fullscreenProject.aspectRatio === '9/16' ? 'cover' : 'contain',
                }}
                onTimeUpdate={() => {
                  if (fullscreenVideoRef.current && fullscreenVideoRef.current.duration) {
                    const cur = fullscreenVideoRef.current.currentTime;
                    const dur = fullscreenVideoRef.current.duration;
                    setFullscreenProgress((cur / dur) * 100);

                    const curM = Math.floor(cur / 60).toString().padStart(2, '0');
                    const curS = Math.floor(cur % 60).toString().padStart(2, '0');
                    setFullscreenTime(`${curM}:${curS}`);

                    const durM = Math.floor(dur / 60).toString().padStart(2, '0');
                    const durS = Math.floor(dur % 60).toString().padStart(2, '0');
                    setFullscreenDurationStr(`${durM}:${durS}`);
                  }
                }}
                onPlay={() => setIsFullscreenPlaying(true)}
                onPause={() => setIsFullscreenPlaying(false)}
                onEnded={() => setIsFullscreenPlaying(false)}
              />

              {/* Center Play/Pause Pulsing Overlay on Pause */}
              {!isFullscreenPlaying && (
                <div className="theater-paused-badge">
                  <div className="paused-badge-circle">
                    <Play size={28} className="paused-badge-icon" />
                  </div>
                  <span>PAUSED</span>
                </div>
              )}

              {/* Theater Ambient Edge Glow */}
              <div className="theater-ambient-vignette" />
            </div>

            {/* Comprehensive Theater Player Controls Bar */}
            <div className="theater-controls-wrapper" onClick={(e) => e.stopPropagation()}>
              {/* Interactive Timeline Track */}
              <div 
                className="theater-timeline-track"
                onClick={handleTimelineScrub}
                title="Click or drag to seek in full video"
              >
                <div 
                  className="theater-timeline-fill"
                  style={{ width: `${fullscreenProgress}%` }}
                />
                <div 
                  className="theater-timeline-handle"
                  style={{ left: `${fullscreenProgress}%` }}
                />
              </div>

              {/* Controls Buttons Row */}
              <div className="theater-controls-row">
                <div className="controls-left-group">
                  {/* Play / Pause */}
                  <button
                    type="button"
                    className="theater-ctrl-btn primary-ctrl"
                    onClick={toggleFullscreenPlay}
                    aria-label={isFullscreenPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isFullscreenPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  {/* Seek -5s */}
                  <button
                    type="button"
                    className="theater-ctrl-btn"
                    onClick={() => handleSkipTime(-5)}
                    title="Rewind 5 seconds"
                    aria-label="Rewind 5 seconds"
                  >
                    <RotateCcw size={16} />
                    <span className="ctrl-tiny-text">5s</span>
                  </button>

                  {/* Seek +5s */}
                  <button
                    type="button"
                    className="theater-ctrl-btn"
                    onClick={() => handleSkipTime(5)}
                    title="Forward 5 seconds"
                    aria-label="Forward 5 seconds"
                  >
                    <RotateCw size={16} />
                    <span className="ctrl-tiny-text">5s</span>
                  </button>

                  {/* Volume / Mute */}
                  <button
                    type="button"
                    className="theater-ctrl-btn"
                    onClick={toggleFullscreenMute}
                    aria-label={isFullscreenMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isFullscreenMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>

                  {/* Timecode display */}
                  <div className="theater-timecode">
                    <span className="current-time">{fullscreenTime}</span>
                    <span className="time-separator">/</span>
                    <span className="total-time">{fullscreenDurationStr || fullscreenProject.duration}</span>
                  </div>
                </div>

                <div className="controls-right-group">
                  {/* Aspect Ratio confirmation tag */}
                  <div className="theater-format-pill">
                    {fullscreenProject.aspectRatio === '9/16' ? (
                      <>
                        <Smartphone size={12} />
                        <span>9:16 VERTICAL</span>
                      </>
                    ) : (
                      <>
                        <Monitor size={12} />
                        <span>16:9 WIDESCREEN</span>
                      </>
                    )}
                  </div>

                  {/* Project Switcher in Theater */}
                  <div className="theater-nav-group">
                    <button
                      type="button"
                      className="theater-nav-btn"
                      onClick={() => handleSwitchFullscreenProject(-1)}
                      title="Previous Commercial"
                      aria-label="Previous Commercial"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="theater-nav-counter">
                      {COMMERCIAL_PROJECTS.findIndex(p => p.id === fullscreenProject.id) + 1} / {COMMERCIAL_PROJECTS.length}
                    </span>
                    <button
                      type="button"
                      className="theater-nav-btn"
                      onClick={() => handleSwitchFullscreenProject(1)}
                      title="Next Commercial"
                      aria-label="Next Commercial"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Native Browser Fullscreen */}
                  <button
                    type="button"
                    className="theater-ctrl-btn"
                    onClick={toggleNativeFullscreen}
                    title="Toggle Monitor Fullscreen (F)"
                    aria-label="Toggle Monitor Fullscreen"
                  >
                    {isNativeFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Theater Footer Description & Action */}
            <div className="theater-footer-info">
              <p className="theater-footer-desc">{fullscreenProject.description}</p>
              <div className="theater-footer-actions">
                <button
                  type="button"
                  className="theater-inquire-btn"
                  onClick={() => {
                    handleCloseFullscreen();
                    if (onCreateSimilar) {
                      onCreateSimilar(fullscreenProject);
                    } else if (onStartProject) {
                      onStartProject({ title: fullscreenProject.title, category: fullscreenProject.category });
                    }
                  }}
                >
                  <Sparkles size={14} />
                  <span>Create similar to this one</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
