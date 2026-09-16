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
        <Hero 
          onOpenReel={handleOpenReel}
          onContactClick={handleOpenProjectModal}
          isModalOpen={reelModalOpen || projectModalOpen}
        />

        {/* Real Commercial Video Showcase */}
        <CommercialShowcase 
          onStartProject={handleOpenProjectModal}
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
