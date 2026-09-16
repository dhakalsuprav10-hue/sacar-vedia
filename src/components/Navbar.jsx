import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onStartProject }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Brand Name on Left */}
        <a href="#home" className="navbar-brand" aria-label="SAKAR VEDIA Home">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-title">SAKAR VEDIA</span>
        </a>

        {/* Order Now Button on Right */}
        <div className="navbar-action">
          <button 
            type="button" 
            className="nav-order-btn"
            onClick={onStartProject}
            id="nav-order-now-btn"
            aria-label="Order Video Now"
          >
            <span>Order Now</span>
            <ArrowUpRight className="order-icon" size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}
