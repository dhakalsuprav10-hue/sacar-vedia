import { useEffect } from 'react';

/**
 * useScrollReveal: Lightweight, GPU-accelerated IntersectionObserver hook
 * exclusively reveals text elements as they enter the viewport with a cinematic fade-in-up effect.
 */
export default function useScrollReveal() {
  useEffect(() => {
    // Respect reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-text').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, stop observing so text stays stable
          observer.unobserve(entry.target);
        }
      });
    };

    let observer;
    try {
      observer = new IntersectionObserver(handleIntersect, observerOptions);
    } catch {
      // Fallback if IntersectionObserver isn't supported
      document.querySelectorAll('.reveal-text').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-text:not(.is-revealed)');
      elements.forEach((el) => {
        // If element is already in viewport on mount, reveal it smoothly
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial check
    observeElements();

    // Re-check after minor delay to ensure all components have mounted
    const timer = setTimeout(observeElements, 100);

    // MutationObserver to catch any dynamically loaded text
    let mutationObserver;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeElements();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, []);
}
