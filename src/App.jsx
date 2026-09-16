import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShowreelModal from './components/ShowreelModal';
import ProjectModal from './components/ProjectModal';
import CustomCursor from './components/CustomCursor';
import CommercialShowcase from './components/CommercialShowcase';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import useScrollReveal from './hooks/useScrollReveal';
import './App.css';

export default function App() {
  useScrollReveal();
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [reelCategory, setReelCategory] = useState('film');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [prefilledSubject, setPrefilledSubject] = useState('');

  const handleOpenReel = (category = 'film') => {
    setReelCategory(category);
    setReelModalOpen(true);
  };

  const handleCloseReel = () => {
    setReelModalOpen(false);
  };

  const handleOpenProjectModal = () => {
    setProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setProjectModalOpen(false);
  };

  // Smart Auto-Fill & Smooth Scroll when user clicks "Create similar to this one"
  const handleCreateSimilar = (project) => {
    const aspectLabel = 
      project.aspectRatio === '9/16' 
        ? '9:16 Vertical Reel' 
        : project.category === 'MUSIC VIDEO' 
          ? '16:9 Music Video' 
          : '16:9 Commercial';

    const briefText = `Inquiring for a similar style to: ${project.title} (${aspectLabel})`;
    setPrefilledSubject(briefText);

    // Smooth scroll down to contact / inquiry brief section
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }

    // Auto-focus and pulse-highlight the subject input field
    setTimeout(() => {
      const inputEl = document.getElementById('form-client-subject');
      if (inputEl) {
        inputEl.focus();
        inputEl.classList.remove('input-highlight-pulse');
        void inputEl.offsetWidth; // Force CSS reflow to re-trigger animation
        inputEl.classList.add('input-highlight-pulse');
      }
    }, 450);
  };

  return (
    <div className="portfolio-app">
      {/* Luxury Cinematic Cursor & Smooth Following Glow */}
      <CustomCursor />

      {/* Cinematic Film Grain Overlay */}
      <div className="film-grain" />

      {/* Frosted Sticky Navigation Bar */}
      <Navbar onStartProject={handleOpenProjectModal} />

      {/* Main Content */}
      <main>
        {/* Page 1: Hero Section (Restored 2-column balanced layout with autoplaying phone mockup) */}
        <Hero 
          onOpenReel={handleOpenReel}
          onContactClick={handleOpenProjectModal}
          isModalOpen={reelModalOpen || projectModalOpen}
        />

        {/* Real Commercial Video Showcase (Horizontal Scroll Showcase Container) */}
        <CommercialShowcase 
          onStartProject={handleOpenProjectModal}
          onCreateSimilar={handleCreateSimilar}
        />

        {/* 2x2 Glassmorphic Services Section */}
        <Services 
          onStartProject={handleOpenProjectModal}
        />

        {/* Cinematic Bilingual About Us Section */}
        <About 
          onStartProject={handleOpenProjectModal}
        />

        {/* Visual Glassmorphic Contact Section */}
        <Contact 
          onStartProject={handleOpenProjectModal}
          prefilledSubject={prefilledSubject}
        />
      </main>

      {/* Interactive Cinematic Showreel Modal */}
      <ShowreelModal 
        isOpen={reelModalOpen}
        onClose={handleCloseReel}
        initialCategory={reelCategory}
        onStartProject={handleOpenProjectModal}
      />

      {/* Interactive Project Inquiry / Commission Modal */}
      <ProjectModal 
        isOpen={projectModalOpen}
        onClose={handleCloseProjectModal}
      />
    </div>
  );
}
