import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle, Film, Clapperboard, Music, Smartphone, Vote, ArrowRight, Calculator } from 'lucide-react';
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from './Contact';
import './ProjectModal.css';

const PRODUCTION_TYPES = [
  { id: 'AI Commercial', label: 'AI Commercial', icon: Film },
  { id: 'AI Brand Campaign', label: 'AI Brand Campaign', icon: Clapperboard },
  { id: 'Music Video', label: 'Music Video', icon: Music },
  { id: 'Vertical Social Reels', label: 'Vertical Social Reels', icon: Smartphone },
  { id: 'AI Political Video', label: 'AI Political Video', icon: Vote },
];

const TIMELINE_OPTIONS = [
  'Immediate (< 1 Week)',
  'Standard (1 - 2 Weeks)',
  'Within 1 Month',
  'Flexible / Ongoing Campaign',
];

export default function ProjectModal({ isOpen, onClose }) {
  const [selectedService, setSelectedService] = useState('AI Commercial');
  const [videoCount, setVideoCount] = useState(1);
  const [timeline, setTimeline] = useState('Standard (1 - 2 Weeks)');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Real-time dynamic price calculation: Formula = Input Number * Rs. 800
  const RATE_PER_VIDEO = 800;
  const parsedCount = parseInt(videoCount, 10);
  const validCount = (!isNaN(parsedCount) && parsedCount > 0) ? parsedCount : 0;
  const calculatedTotal = validCount * RATE_PER_VIDEO;
  const formattedTotal = calculatedTotal.toLocaleString('en-IN');
  const budgetString = validCount > 0 ? `Total: Rs. ${formattedTotal}` : 'Total: Rs. 0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter your name or brand name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setValidationError('Please provide at least one contact method: an Email address or Phone/WhatsApp number.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          productionType: selectedService,
          videoCount: validCount,
          estimatedBudget: budgetString,
          clientName: name.trim(),
          clientEmail: email.trim() || 'Not provided',
          clientPhone: phone.trim() || 'Not provided',
          preferredContact: email.trim() || phone.trim(),
          timeline: timeline,
          projectDetails: details.trim() || 'Quick inquiry - No custom brief specified.',
          _replyto: email.trim() || CONTACT_EMAIL,
          _to: CONTACT_EMAIL,
          _subject: `[Project Brief] ${selectedService} (${validCount} videos) - ${name.trim()}`
        })
      });
    } catch (err) {
      console.warn('Brief submission network notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setDetails('');
    setValidationError('');
    setVideoCount(1);
    onClose();
  };

  return (
    <div className="project-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Ambient Corner Glow */}
        <div className="modal-ambient-glow" aria-hidden="true" />

        {/* Modal Header */}
        <div className="project-modal-header">
          <div className="project-header-left">
            <span className="project-modal-pill">
              <Sparkles size={12} className="pill-sparkle" />
              <span>DIRECT COMMISSIONS OPEN</span>
            </span>
            <h3 className="project-modal-title">START A PROJECT WITH SACAR VEDIA COMPANY</h3>
            <p className="project-modal-tagline">
              Submit your brief directly to our production team. Fast turnaround with cinematic AI fidelity.
            </p>
          </div>
          <button 
            type="button" 
            className="project-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="project-success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={44} className="success-check" />
            </div>
            <h4 className="success-title">INQUIRY RECEIVED</h4>
            <p className="success-message">
              Thank you for reaching out. <strong>Sacar Vedia Company</strong> reviews all direct briefs personally within 24 hours.
            </p>

            {/* Brief Summary Receipt Card */}
            <div className="success-summary-card">
              <div className="summary-row">
                <span className="summary-label">PRODUCTION:</span>
                <span className="summary-value">{selectedService}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">ORDER SIZE:</span>
                <span className="summary-value">{validCount} {validCount === 1 ? 'Video' : 'Videos'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">ESTIMATED BUDGET:</span>
                <span className="summary-value highlight">{budgetString} ({validCount} × Rs. 800)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">CLIENT:</span>
                <span className="summary-value">{name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">CONTACT:</span>
                <span className="summary-value">
                  {email || ''}{email && phone ? ' • ' : ''}{phone ? `Tel: ${phone}` : ''}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">ROUTED TO:</span>
                <span className="summary-value highlight">{CONTACT_EMAIL}</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-primary success-close-btn" 
              onClick={handleReset}
            >
              <span>RETURN TO PORTFOLIO</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <form className="project-form" onSubmit={handleSubmit}>
            {/* Section 1: Select Production Type (All 5 options fully visible without truncation) */}
            <div className="service-picker-group">
              <div className="label-with-hint">
                <label className="input-label">SELECT PRODUCTION TYPE</label>
                <span className="label-counter">5 MODES AVAILABLE</span>
              </div>
              <div className="production-toggle-grid">
                {PRODUCTION_TYPES.map(({ id, label, icon: Icon }) => {
                  const isSelected = selectedService === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`production-toggle-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedService(id)}
                    >
                      <span className="toggle-indicator-dot" />
                      <Icon size={15} className="toggle-icon" />
                      <span className="toggle-label">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Contact Details (Flexible: Email OR Phone/WhatsApp) */}
            <div className="form-row">
              <div className="form-field">
                <label className="input-label" htmlFor="client-name">
                  YOUR NAME / BRAND <span className="req-star">*</span>
                </label>
                <input 
                  id="client-name"
                  type="text" 
                  required 
                  placeholder="e.g. Hello Smart Trade / Sacar" 
                  className="project-input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                />
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="client-email">
                  CONTACT EMAIL <span className="label-subtext">(OR PHONE)</span>
                </label>
                <input 
                  id="client-email"
                  type="email" 
                  placeholder="client@company.com" 
                  className="project-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                />
              </div>
            </div>

            {/* Row with Phone / WhatsApp and Timeline */}
            <div className="form-row">
              <div className="form-field">
                <label className="input-label" htmlFor="client-phone">
                  PHONE / WHATSAPP <span className="label-subtext">(OR EMAIL)</span>
                </label>
                <input 
                  id="client-phone"
                  type="tel" 
                  placeholder="e.g. +977 98XXXXXXXX / WhatsApp" 
                  className="project-input"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                />
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="project-timeline">TIMELINE</label>
                <div className="select-wrapper">
                  <select 
                    id="project-timeline"
                    className="project-input select"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Number of Videos (Numeric Input) & Estimated Budget (Dynamic Real-time Total) */}
            <div className="form-row">
              <div className="form-field">
                <div className="label-with-hint">
                  <label className="input-label" htmlFor="number-of-videos">NUMBER OF VIDEOS *</label>
                  <span className="label-counter">TYPE EXACT QTY</span>
                </div>
                <div className="number-input-wrapper">
                  <input 
                    id="number-of-videos"
                    type="number"
                    min="1"
                    step="1"
                    required 
                    placeholder="e.g. 7" 
                    className="project-input numeric-input"
                    value={videoCount}
                    onChange={(e) => setVideoCount(e.target.value)}
                  />
                  <div className="stepper-buttons">
                    <button 
                      type="button"
                      className="stepper-btn"
                      onClick={() => setVideoCount(Math.max(1, (parseInt(videoCount, 10) || 1) - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <button 
                      type="button"
                      className="stepper-btn"
                      onClick={() => setVideoCount((parseInt(videoCount, 10) || 0) + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="quick-qty-chips">
                  {[1, 4, 7, 10].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      className={`quick-qty-chip ${validCount === qty ? 'active' : ''}`}
                      onClick={() => setVideoCount(qty)}
                    >
                      {qty} {qty === 1 ? 'Video' : 'Videos'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <div className="label-with-hint">
                  <label className="input-label">ESTIMATED BUDGET</label>
                  <span className="rate-badge">RS. 800 / VIDEO</span>
                </div>
                {/* Dynamic Real-time Calculation Display */}
                <div className="dynamic-budget-card" id="estimated-budget">
                  <div className="budget-main-row">
                    <Calculator size={16} className="budget-calc-icon" />
                    <span className="budget-total-text">{budgetString}</span>
                  </div>
                  <div className="budget-formula-row">
                    {validCount > 0 ? (
                      <span className="budget-calc-detail">
                        {validCount} {validCount === 1 ? 'video' : 'videos'} × Rs. 800
                      </span>
                    ) : (
                      <span className="budget-calc-detail muted">Enter video quantity</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Brief / Vision Overview (Completely Optional) */}
            <div className="form-field">
              <div className="label-with-hint">
                <label className="input-label" htmlFor="project-details">
                  BRIEF / VISION OVERVIEW <span className="label-subtext">(OPTIONAL)</span>
                </label>
                <span className="label-counter">OPTIONAL</span>
              </div>
              <textarea 
                id="project-details"
                rows="3" 
                placeholder="Optional: Share project goals, references, script ideas, or leave blank for a quick consultation..." 
                className="project-input textarea"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {/* Validation Notice if neither Email nor Phone provided */}
            {validationError && (
              <div className="project-validation-alert" role="alert">
                <span>⚠️ {validationError}</span>
              </div>
            )}

            {/* Prominent Submit Button */}
            <button 
              type="submit" 
              className="btn-primary project-submit-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? `TRANSMITTING TO ${CONTACT_EMAIL.toUpperCase()}...` : `SUBMIT INQUIRY TO ${CONTACT_EMAIL.toUpperCase()}`}</span>
              <Send size={15} className="submit-icon" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


