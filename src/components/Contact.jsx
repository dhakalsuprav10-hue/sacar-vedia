import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  ArrowUpRight, 
  Mail, 
  Copy, 
  Check, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  CONTACT_EMAIL, 
  WHATSAPP_PHONE, 
  WHATSAPP_BASE_URL, 
  buildWhatsAppUrl, 
  sendInquiryEmail 
} from '../services/emailService';
import './Contact.css';

export { CONTACT_EMAIL, WHATSAPP_PHONE };
export const WHATSAPP_URL = "https://wa.me/9779851239728";
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const SOCIAL_LINKS = [
  {
    name: 'Gmail',
    href: `mailto:${CONTACT_EMAIL}`,
    colorClass: 'social-gmail',
    ariaLabel: `Send email to ${CONTACT_EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    colorClass: 'social-facebook',
    ariaLabel: 'Sacar Vedia Company on Facebook',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    colorClass: 'social-instagram',
    ariaLabel: 'Sacar Vedia Company on Instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    colorClass: 'social-linkedin',
    ariaLabel: 'Sacar Vedia Company on LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
];

export default function Contact({ onStartProject }) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [openWhatsAppOnSubmit, setOpenWhatsAppOnSubmit] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your Name or Brand.');
      setStatus('error');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage('Please provide at least one contact method: an Email address or Phone/WhatsApp number.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // If user has chosen to open in WhatsApp, launch pre-filled WhatsApp link immediately
    if (openWhatsAppOnSubmit) {
      try {
        const waUrl = buildWhatsAppUrl({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        });
        window.open(waUrl, '_blank');
      } catch (waErr) {
        console.warn('WhatsApp window open notice:', waErr);
      }
    }

    try {
      const result = await sendInquiryEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      if (result.ok) {
        setStatus('success');
      } else {
        setErrorMessage(result.error || `Unable to reach the automated endpoint. Please email directly at ${CONTACT_EMAIL}.`);
        setStatus('error');
      }
    } catch (err) {
      console.warn('Submission network notice:', err);
      setErrorMessage(`Network notice: Your brief is ready to send directly via WhatsApp or email to ${CONTACT_EMAIL}.`);
      setStatus('error');
    }
  };

  const handleResetForm = () => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section className="contact-section" id="contact">
      {/* Dynamic Background Ambient Accents */}
      <div className="contact-ambient-glow" aria-hidden="true" />
      <div className="contact-beam-glow" aria-hidden="true" />

      <div className="contact-container">
        {/* Luxury Glassmorphic Centerpiece Card */}
        <div className="contact-glass-card">
          <div className="glass-card-border-glow" aria-hidden="true" />

          {/* Catchy Header */}
          <div className="contact-header">
            <div className="contact-badge reveal-text">
              <span className="badge-ping">
                <span className="badge-ping-ring" />
                <span className="badge-ping-dot" />
              </span>
              <Sparkles size={13} className="badge-sparkle" />
              <span>DIRECT COLLABORATIONS • 24/7 PRIORITY INBOX</span>
            </div>

            <h2 className="contact-headline reveal-text reveal-delay-1">
              LET'S CREATE <span className="headline-gradient">SOMETHING AMAZING.</span>
            </h2>

            <p className="contact-subtitle reveal-text reveal-delay-2">
              Ready to elevate your brand with high-converting AI commercials, brand campaigns, or viral reels?
              Reach out directly to <strong>Sakar Vedia</strong> via email, WhatsApp, or send a brief below.
            </p>
          </div>

          {/* Primary Communication Channels: WhatsApp + Prominent Email Card */}
          <div className="contact-channels-grid">
            {/* WhatsApp Direct Line Card */}
            <a
              href={WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card whatsapp-channel-card"
              id="whatsapp-contact-btn"
            >
              <div className="channel-card-glow" aria-hidden="true" />
              <div className="channel-icon-wrap whatsapp-icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="currentColor"
                  className="whatsapp-svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="channel-text-group reveal-text reveal-delay-2">
                <span className="channel-label">INSTANT CHAT</span>
                <span className="channel-title">WhatsApp Direct</span>
                <span className="channel-value">+977 9851239728</span>
              </div>
              <ArrowUpRight size={18} className="channel-arrow" />
            </a>

            {/* Official Agency Email Card (sakarmtech@gmail.com) */}
            <div className="channel-card email-channel-card" id="email-contact-card">
              <div className="channel-card-glow email-glow" aria-hidden="true" />
              <div className="channel-icon-wrap email-icon-wrap">
                <Mail size={22} className="email-svg" />
              </div>
              <div className="channel-text-group reveal-text reveal-delay-2">
                <span className="channel-label">OFFICIAL AGENCY EMAIL</span>
                <span className="channel-title">Direct Client Inbox</span>
                <a 
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="channel-value email-link"
                  title="Compose email to sakarmtech@gmail.com"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="email-actions-group">
                <button
                  type="button"
                  className={`email-copy-pill ${copied ? 'copied' : ''}`}
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="copy-icon" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="copy-icon" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="email-compose-btn"
                  title="Open mail client"
                  aria-label="Open mail client"
                >
                  <ArrowUpRight size={18} className="channel-arrow" />
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Action: Project Inquiry Modal Trigger */}
          {onStartProject && (
            <div className="contact-modal-trigger-wrap reveal-text reveal-delay-2">
              <button
                type="button"
                className="contact-brief-btn"
                onClick={onStartProject}
                id="contact-open-brief-btn"
              >
                <MessageSquare size={15} />
                <span>Fill Out Detailed Multi-Option Project Brief</span>
              </button>
            </div>
          )}

          {/* Social Channels Row */}
          <div className="contact-social-section">
            <span className="social-row-label reveal-text">OR CONNECT ON SOCIAL NETWORKS</span>
            <div className="social-icons-grid reveal-text reveal-delay-1">
              {SOCIAL_LINKS.map(({ name, href, colorClass, icon, ariaLabel }) => (
                <a
                  key={name}
                  href={href}
                  className={`social-icon-btn ${colorClass}`}
                  aria-label={ariaLabel}
                  title={name}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span className="social-icon-box">{icon}</span>
                  <span className="social-name">{name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ===================================================================
              DIRECT CONTACT & PROJECT INQUIRY FORM (WIRED TO sakarmtech@gmail.com)
              =================================================================== */}
          <div className="contact-form-container">
            <div className="form-divider-line" />

            <div className="form-heading-group">
              <span className="form-eyebrow-chip reveal-text">
                <Sparkles size={11} /> DIRECT INBOX FORM
              </span>
              <h3 className="embedded-form-title reveal-text reveal-delay-1">SEND AN INQUIRY OR PROJECT BRIEF</h3>
              <p className="embedded-form-desc reveal-text reveal-delay-2">
                Your message is sent straight to <strong className="email-highlight">{CONTACT_EMAIL}</strong>. We typically reply within 24 hours.
              </p>
            </div>

            {/* Submission Feedback Alert: Success State */}
            {status === 'success' ? (
              <div className="form-alert-panel alert-success" role="alert">
                <div className="alert-icon-ring">
                  <CheckCircle2 size={34} className="alert-check-icon" />
                </div>
                <div className="alert-body">
                  <h4 className="alert-headline">INQUIRY RECEIVED AT {CONTACT_EMAIL.toUpperCase()}</h4>
                  <p className="alert-paragraph">
                    Thank you, <strong>{formData.name || 'Client'}</strong>. Your inquiry has been transmitted directly to <strong>{CONTACT_EMAIL}</strong>.
                    Our production team has received your brief and will review it within 24 hours.
                  </p>

                  {/* Summary Receipt Card */}
                  <div className="success-receipt-card">
                    <div className="receipt-row">
                      <span className="receipt-label">CLIENT / BRAND:</span>
                      <span className="receipt-val">{formData.name}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">CONTACT:</span>
                      <span className="receipt-val">
                        {formData.email || ''}{formData.email && formData.phone ? ' • ' : ''}{formData.phone ? `Tel/WA: ${formData.phone}` : ''}
                      </span>
                    </div>
                    {formData.subject && (
                      <div className="receipt-row">
                        <span className="receipt-label">SUBJECT:</span>
                        <span className="receipt-val">{formData.subject}</span>
                      </div>
                    )}
                    {formData.message && (
                      <div className="receipt-row">
                        <span className="receipt-label">VISION OVERVIEW:</span>
                        <span className="receipt-val brief-snippet">{formData.message}</span>
                      </div>
                    )}
                    <div className="receipt-row">
                      <span className="receipt-label">ROUTED DIRECTLY TO:</span>
                      <span className="receipt-val highlight">{CONTACT_EMAIL}</span>
                    </div>
                  </div>

                  {/* Direct WhatsApp Call to Action & Reset */}
                  <div className="success-action-buttons">
                    <a
                      href={buildWhatsAppUrl(formData)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp-direct"
                      id="contact-success-whatsapp-btn"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>CONTINUE ON WHATSAPP (+977 9851239728)</span>
                      <ArrowUpRight size={15} />
                    </a>

                    <button
                      type="button"
                      className="btn-primary alert-reset-btn"
                      onClick={handleResetForm}
                    >
                      <span>SEND ANOTHER MESSAGE</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form className="contact-integrated-form" onSubmit={handleSubmit}>
                {/* Submission Feedback Alert: Error State */}
                {status === 'error' && (
                  <div className="form-alert-panel alert-error" role="alert">
                    <AlertCircle size={24} className="alert-error-icon" />
                    <div className="alert-body">
                      <h4 className="alert-headline error-headline">COULD NOT TRANSMIT MESSAGE</h4>
                      <p className="alert-paragraph">
                        {errorMessage || `Unable to reach the automated endpoint. Please email us directly at ${CONTACT_EMAIL}.`}
                      </p>
                      <div className="alert-error-actions">
                        <a
                          href={buildWhatsAppUrl(formData)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="error-whatsapp-btn"
                        >
                          <span>Send Brief via WhatsApp</span>
                          <ArrowUpRight size={14} />
                        </a>
                        <a
                          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.subject || 'Video Production Inquiry')}&body=${encodeURIComponent(`Hi Sacar Vedia Company,\n\nName: ${formData.name}\nEmail: ${formData.email || 'Not provided'}\nPhone/WhatsApp: ${formData.phone || 'Not provided'}\n\nProject Brief:\n${formData.message || 'Quick inquiry - No custom brief specified.'}`)}`}
                          className="error-mailto-btn"
                        >
                          <span>Open Email App Directly</span>
                          <ArrowUpRight size={14} />
                        </a>
                        <button
                          type="button"
                          className="error-retry-btn"
                          onClick={() => setStatus('idle')}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-fields-grid contact-three-col-grid">
                  {/* Name Input */}
                  <div className="form-input-block">
                    <label htmlFor="form-client-name" className="field-label">
                      YOUR NAME / BRAND <span className="req-star">*</span>
                    </label>
                    <input
                      id="form-client-name"
                      name="name"
                      type="text"
                      required
                      disabled={status === 'submitting'}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Hello Smart Trade / Sacar"
                      className="form-text-input"
                    />
                  </div>

                  {/* Flexible Contact: Email Address */}
                  <div className="form-input-block">
                    <label htmlFor="form-client-email" className="field-label">
                      CONTACT EMAIL <span className="field-optional-tag">(OR PHONE)</span>
                    </label>
                    <input
                      id="form-client-email"
                      name="email"
                      type="email"
                      disabled={status === 'submitting'}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. client@company.com"
                      className="form-text-input"
                    />
                  </div>

                  {/* Flexible Contact: Phone / WhatsApp */}
                  <div className="form-input-block">
                    <label htmlFor="form-client-phone" className="field-label">
                      PHONE / WHATSAPP <span className="field-optional-tag">(OR EMAIL)</span>
                    </label>
                    <input
                      id="form-client-phone"
                      name="phone"
                      type="tel"
                      disabled={status === 'submitting'}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +977 98XXXXXXXX"
                      className="form-text-input"
                    />
                  </div>
                </div>

                {/* Subject / Brief Title Input (Optional) */}
                <div className="form-input-block">
                  <label htmlFor="form-client-subject" className="field-label">
                    SUBJECT / PROJECT BRIEF <span className="field-optional-tag">(OPTIONAL)</span>
                  </label>
                  <input
                    id="form-client-subject"
                    name="subject"
                    type="text"
                    disabled={status === 'submitting'}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Optional: e.g. 4K Commercial AI Spot / Music Video / Reels Campaign"
                    className="form-text-input"
                  />
                </div>

                {/* Message Textarea (Optional) */}
                <div className="form-input-block">
                  <label htmlFor="form-client-message" className="field-label">
                    BRIEF / VISION OVERVIEW <span className="field-optional-tag">(OPTIONAL)</span>
                  </label>
                  <textarea
                    id="form-client-message"
                    name="message"
                    rows={4}
                    disabled={status === 'submitting'}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Optional: Share project goals, deliverables, script ideas, or leave blank for a quick consultation..."
                    className="form-text-input form-textarea"
                  />
                </div>

                {/* Optional WhatsApp Direct Forwarding Checkbox */}
                <div className="whatsapp-toggle-wrap">
                  <label className="whatsapp-toggle-label" htmlFor="contact-wa-toggle">
                    <input
                      type="checkbox"
                      id="contact-wa-toggle"
                      checked={openWhatsAppOnSubmit}
                      onChange={(e) => setOpenWhatsAppOnSubmit(e.target.checked)}
                      className="whatsapp-toggle-checkbox"
                    />
                    <span className="whatsapp-toggle-custom" />
                    <span className="whatsapp-toggle-text">
                      Also open brief directly in <strong>WhatsApp (+977 9851239728)</strong> on submit
                    </span>
                  </label>
                </div>

                {/* Submit Action Bar */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn-primary form-submit-btn"
                    disabled={status === 'submitting'}
                    id="contact-form-submit-btn"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="submit-spinner" aria-hidden="true" />
                        <span>TRANSMITTING TO {CONTACT_EMAIL}...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT MESSAGE TO {CONTACT_EMAIL}</span>
                        <Send size={15} className="submit-arrow" />
                      </>
                    )}
                  </button>

                  <div className="form-trust-indicator">
                    <span className="trust-lock-icon">🔒</span>
                    <span>Direct forwarding to {CONTACT_EMAIL} • 100% Confidential</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Card Micro-Footer */}
          <div className="contact-card-footer">
            <div className="footer-location-pill">
              <span className="location-dot" />
              <span>Kathmandu, Nepal • Global Production Service</span>
            </div>
            <div className="footer-rates-hint">
              <span>Standard Video Pricing from <strong>Rs. 800 / Video</strong></span>
            </div>
          </div>
        </div>

        {/* Agency Bottom Brand Copyright */}
        <div className="contact-bottom-bar">
          <div className="agency-credit">
            <span className="brand-highlight">SACAR VEDIA COMPANY</span>
            <span className="credit-dot">•</span>
            <span>Commercial &amp; AI Video Production Studio</span>
          </div>
          <div className="copyright-tag">
            © {new Date().getFullYear()} Sacar Vedia Company. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
