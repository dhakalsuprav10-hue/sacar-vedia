import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  Building2,
  Download
} from 'lucide-react';
import './PanVerificationModal.css';

const VERIFICATION_DOCUMENTS = [
  {
    id: 'pan-01',
    title: 'PAN Registration Certificate',
    titleNepali: 'स्थायी लेखा नम्बर दर्ता प्रमाण-पत्र (PAN)',
    authority: 'Government of Nepal • Ministry of Finance • Inland Revenue Department',
    badge: 'OFFICIAL PAN DARTA',
    imageSrc: '/images/pan-certificate-01.jpg',
    aspectRatio: '1044 / 1303',
    width: 1044,
    height: 1303,
    description: 'Official Permanent Account Number (PAN) tax registration issued by the Inland Revenue Department, Government of Nepal.'
  },
  {
    id: 'biz-02',
    title: 'Business Registration Certificate',
    titleNepali: 'उद्योग / व्यवसाय दर्ता प्रमाण-पत्र',
    authority: 'Local Government • Office of Municipal Executive',
    badge: 'BUSINESS REGISTRATION',
    imageSrc: '/images/pan-certificate-02.jpg',
    aspectRatio: '945 / 1232',
    width: 945,
    height: 1232,
    description: 'Official Business Registration Certificate certifying legal commercial operation under Government of Nepal regulations.'
  }
];

export default function PanVerificationModal({ isOpen, onClose }) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setIsZoomed(false);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDoc = VERIFICATION_DOCUMENTS[activeDocIndex];

  return (
    <div className="pan-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className={`pan-modal-dialog ${isZoomed ? 'zoomed-container' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="pan-modal-header">
          <div className="pan-header-meta">
            <div className="pan-verified-chip">
              <ShieldCheck size={14} className="shield-icon" />
              <span>OFFICIALLY REGISTERED &amp; VERIFIED IN NEPAL</span>
            </div>
            <h2 className="pan-modal-title">
              {currentDoc.title}
              <span className="pan-title-nepali">{currentDoc.titleNepali}</span>
            </h2>
            <p className="pan-authority-text">{currentDoc.authority}</p>
          </div>

          <button 
            type="button" 
            className="pan-close-btn"
            onClick={onClose}
            aria-label="Close Verification Certificate"
            title="Close (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher for 2 Documents */}
        <div className="pan-tabs-bar">
          {VERIFICATION_DOCUMENTS.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              className={`pan-tab-btn ${activeDocIndex === idx ? 'active' : ''}`}
              onClick={() => {
                setActiveDocIndex(idx);
                setIsZoomed(false);
              }}
            >
              {idx === 0 ? <FileText size={14} /> : <Building2 size={14} />}
              <span>{doc.badge}</span>
              <span className="tab-doc-num">DOC 0{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Document Viewer Frame */}
        <div className="pan-doc-stage">
          <div className="pan-stage-toolbar">
            <span className="pan-stage-status">
              <CheckCircle2 size={13} className="check-gold" />
              <span>Legitimate Government Issued Certificate</span>
            </span>

            <div className="toolbar-actions">
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? 'Zoom Out' : 'Zoom In to Read Text'}
              >
                {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                <span>{isZoomed ? 'Reset View' : 'Zoom In'}</span>
              </button>

              <a 
                href={currentDoc.imageSrc} 
                target="_blank" 
                rel="noopener noreferrer"
                className="toolbar-btn link-btn"
                title="Open high-resolution document in new browser tab"
              >
                <ExternalLink size={14} />
                <span>Open Full Size</span>
              </a>

              <a 
                href={currentDoc.imageSrc} 
                download={`SacarVedia-${currentDoc.id}.jpg`}
                className="toolbar-btn download-btn"
                title="Download certificate copy"
              >
                <Download size={14} />
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* Interactive Document Image Container */}
          <div 
            className={`pan-image-scroll-wrapper ${isZoomed ? 'is-zoomed' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Click to reset view' : 'Click to zoom in'}
          >
            <img 
              src={currentDoc.imageSrc} 
              alt={`${currentDoc.title} - ${currentDoc.titleNepali}`}
              className="pan-document-img"
              style={{ aspectRatio: currentDoc.aspectRatio }}
              width={currentDoc.width}
              height={currentDoc.height}
              loading="eager"
            />
          </div>

          {/* Bottom Security & Legality Footnote */}
          <div className="pan-security-footer">
            <div className="security-icon-dot" />
            <p className="security-text">
              <strong>Sacar Vedia Company</strong> is a fully recognized, tax-compliant commercial video production and creative agency in Kathmandu, Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
