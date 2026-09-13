import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  // Position references avoiding React re-render cycles
  const coordsRef = useRef({
    targetX: -300,
    targetY: -300,
    currentX: -300,
    currentY: -300,
    glowX: -300,
    glowY: -300,
    hasMoved: false,
    isHovering: false,
  });

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad) and reduced motion off
    if (typeof window === 'undefined') return;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    let rafId;

    const handleMouseMove = (e) => {
      const c = coordsRef.current;
      c.targetX = e.clientX;
      c.targetY = e.clientY;

      if (!c.hasMoved) {
        c.hasMoved = true;
        c.currentX = e.clientX;
        c.currentY = e.clientY;
        c.glowX = e.clientX;
        c.glowY = e.clientY;
        if (containerRef.current) {
          containerRef.current.classList.add('visible');
          containerRef.current.classList.remove('hidden');
        }
      }
    };

    const handleMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.classList.remove('visible');
        containerRef.current.classList.add('hidden');
      }
    };

    const handleMouseEnter = () => {
      if (containerRef.current && coordsRef.current.hasMoved) {
        containerRef.current.classList.add('visible');
        containerRef.current.classList.remove('hidden');
      }
    };

    // Fast delegation for interactive element detection
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      const isInteractive = Boolean(
        target.closest(
          'a, button, input, textarea, select, [role="button"], .pan-verification-trigger-btn, .showcase-tab, .single-reel-slide, .discipline-tag, .reel-stat-btn, .metric-item, .clickable'
        )
      );

      if (isInteractive !== coordsRef.current.isHovering) {
        coordsRef.current.isHovering = isInteractive;
        if (ringRef.current) {
          ringRef.current.classList.toggle('ring-expanded', isInteractive);
        }
        if (glowRef.current) {
          glowRef.current.classList.toggle('active-interactive', isInteractive);
        }
        if (dotRef.current) {
          dotRef.current.classList.toggle('dot-subtle', isInteractive);
        }
      }
    };

    // Attach high-performance passive listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // High-performance requestAnimationFrame loop with 0ms input lag on center dot
    const render = () => {
      const c = coordsRef.current;

      if (c.hasMoved) {
        // 1. Center dot: instantaneous 1:1 hardware-accelerated tracking with translate3d
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${c.targetX}px, ${c.targetY}px, 0)`;
        }

        // 2. Trailing ring: silky smooth lerp (0.28 factor for snappy precision without drag)
        c.currentX += (c.targetX - c.currentX) * 0.28;
        c.currentY += (c.targetY - c.currentY) * 0.28;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${c.currentX}px, ${c.currentY}px, 0)`;
        }

        // 3. Ambient soft champagne glow: smooth cinematic delay
        c.glowX += (c.targetX - c.glowX) * 0.085;
        c.glowY += (c.targetY - c.glowY) * 0.085;
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${c.glowX}px, ${c.glowY}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div ref={containerRef} className="custom-cursor-container hidden" aria-hidden="true">
      {/* Soft champagne radial glow */}
      <div ref={glowRef} className="cursor-glow-orb">
        <div className="cursor-glow-inner" />
      </div>

      {/* Trailing minimal champagne gold ring */}
      <div ref={ringRef} className="cursor-trail-ring">
        <div className="cursor-ring-inner" />
      </div>

      {/* Zero-latency center anchor dot */}
      <div ref={dotRef} className="cursor-center-dot">
        <div className="cursor-dot-inner" />
      </div>
    </div>
  );
}
