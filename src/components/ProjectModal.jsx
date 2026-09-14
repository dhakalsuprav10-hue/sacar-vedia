import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle, Film, Clapperboard, Music, Smartphone, Vote, ArrowRight, Calculator } from 'lucide-react';
import { CONTACT_EMAIL, WHATSAPP_BASE_URL, buildWhatsAppUrl, sendInquiryEmail } from '../services/emailService';
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
  const [openWhatsApp, setOpenWhatsApp] = useState(true);
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

    const briefData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      productionType: selectedService,
      videoCount: validCount,
      budget: budgetString,
      timeline: timeline,
      details: details.trim(),
      subject: `${selectedService} (${validCount} videos)`
    };

    // Optional: open WhatsApp immediately on submission with user gesture
    if (openWhatsApp) {
      try {
        const waUrl = buildWhatsAppUrl(briefData);
        window.open(waUrl, '_blank');
      } catch (waErr) {
        console.warn('WhatsApp window open notice:', waErr);
      }
    }

    try {
      await sendInquiryEmail(briefData);
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

            <div className="modal-success-actions">
              <a
                href={buildWhatsAppUrl({
                  name,
                  email,
                  phone,
                  productionType: selectedService,
                  videoCount: validCount,
                  budget: budgetString,
                  timeline,
                  details
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-whatsapp"
                id="modal-success-whatsapp-btn"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>CHAT ON WHATSAPP (+977 9851239728)</span>
                <ArrowRight size={14} />
              </a>

              <button 
                type="button" 
                className="btn-secondary success-close-btn" 
                onClick={handleReset}
              >
                <span>RETURN TO PORTFOLIO</span>
                <ArrowRight size={15} />
              </button>
            </div>
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

            {/* Optional WhatsApp Direct Forwarding Checkbox */}
            <div className="project-modal-wa-toggle">
              <label className="modal-wa-label" htmlFor="modal-wa-toggle">
                <input
                  type="checkbox"
                  id="modal-wa-toggle"
                  checked={openWhatsApp}
                  onChange={(e) => setOpenWhatsApp(e.target.checked)}
                  className="modal-wa-checkbox"
                />
                <span className="modal-wa-custom-box" />
                <span className="modal-wa-text">
                  Also open brief directly in <strong>WhatsApp (+977 9851239728)</strong> on submit
                </span>
              </label>
            </div>

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


