/**
 * SACAR VEDIA COMPANY - EMAIL & MESSAGING SERVICE
 * ===============================================
 * Direct integration with:
 * - Email: sakarmtech@gmail.com (FormSubmit AJAX, Formspree, or Web3Forms)
 * - WhatsApp: https://wa.me/9779851239728
 */

export const CONTACT_EMAIL = "sakarmtech@gmail.com";
export const WHATSAPP_PHONE = "9779851239728";
export const WHATSAPP_BASE_URL = "https://wa.me/9779851239728";

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const FORMSPREE_ENDPOINT = env.VITE_FORMSPREE_ENDPOINT || "";
const WEB3FORMS_ACCESS_KEY = env.VITE_WEB3FORMS_ACCESS_KEY || "";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/**
 * Builds a formatted WhatsApp direct link pre-filled with the client's brief.
 * @param {Object} brief
 * @returns {string} WhatsApp URL
 */
export function buildWhatsAppUrl(brief = {}) {
  const parts = [];

  parts.push("🎬 *SACAR VEDIA COMPANY - PROJECT BRIEF*");
  parts.push("━━━━━━━━━━━━━━━━━━━━━━━━");

  if (brief.name) {
    parts.push(`👤 *Name / Brand:* ${brief.name}`);
  }
  if (brief.email && brief.email !== 'Not provided') {
    parts.push(`📧 *Email:* ${brief.email}`);
  }
  if (brief.phone && brief.phone !== 'Not provided') {
    parts.push(`📞 *Phone / WhatsApp:* ${brief.phone}`);
  }
  if (brief.productionType) {
    parts.push(`🎥 *Production Type:* ${brief.productionType}`);
  }
  if (brief.videoCount) {
    parts.push(`📦 *Video Quantity:* ${brief.videoCount} ${brief.videoCount === 1 ? 'Video' : 'Videos'}`);
  }
  if (brief.budget) {
    parts.push(`💰 *Estimated Budget:* ${brief.budget}`);
  }
  if (brief.timeline) {
    parts.push(`⏱️ *Timeline:* ${brief.timeline}`);
  }
  if (brief.subject) {
    parts.push(`📝 *Subject:* ${brief.subject}`);
  }

  const visionMessage = brief.message || brief.details;
  if (visionMessage && visionMessage.trim() && visionMessage !== 'Quick inquiry - No custom brief specified.') {
    parts.push("");
    parts.push("📋 *Vision Overview:*");
    parts.push(visionMessage.trim());
  }

  parts.push("━━━━━━━━━━━━━━━━━━━━━━━━");
  parts.push("🚀 _Transmitted via Sacar Vedia Company Portfolio_");

  const messageText = parts.length > 3
    ? parts.join("\n")
    : "Hi Sacar Vedia Company, I would like to discuss a video production project.";

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Dispatches form data directly to sakarmtech@gmail.com
 * @param {Object} data Form field values
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>}
 */
export async function sendInquiryEmail(data) {
  const sanitizedName = (data.name || '').trim() || 'Prospective Client';
  const sanitizedEmail = (data.email || '').trim() || 'Not provided';
  const sanitizedPhone = (data.phone || '').trim() || 'Not provided';
  const sanitizedSubject = (data.subject || data.productionType || 'New Video Production Inquiry').trim();
  const sanitizedMessage = (data.message || data.details || '').trim() || 'Quick consultation inquiry - No custom brief specified.';

  // 1. Check for custom Formspree endpoint (if user configured a non-placeholder URL)
  const isFormspreeConfigured = FORMSPREE_ENDPOINT && !FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_FORM_ID');
  if (isFormspreeConfigured) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          subject: sanitizedSubject,
          message: sanitizedMessage,
          productionType: data.productionType || undefined,
          videoCount: data.videoCount || undefined,
          budget: data.budget || undefined,
          timeline: data.timeline || undefined,
          _replyto: sanitizedEmail !== 'Not provided' ? sanitizedEmail : CONTACT_EMAIL,
          _to: CONTACT_EMAIL,
          _subject: `[Sacar Vedia] ${sanitizedSubject} - ${sanitizedName}`
        })
      });

      if (response.ok) {
        return { ok: true, message: 'Your inquiry has been successfully transmitted via Formspree.' };
      }
    } catch (err) {
      console.warn('Formspree endpoint unreachable, trying default handler:', err);
    }
  }

  // 2. Check for Web3Forms Access Key
  if (WEB3FORMS_ACCESS_KEY) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          subject: `[Sacar Vedia Inquiry] ${sanitizedSubject} - ${sanitizedName}`,
          message: sanitizedMessage,
          productionType: data.productionType || undefined,
          videoCount: data.videoCount || undefined,
          budget: data.budget || undefined,
          timeline: data.timeline || undefined,
          from_name: 'Sacar Vedia Portfolio'
        })
      });

      const json = await response.json().catch(() => ({}));
      if (response.ok && json.success) {
        return { ok: true, message: 'Your inquiry has been successfully transmitted via Web3Forms.' };
      }
    } catch (err) {
      console.warn('Web3Forms endpoint unreachable, trying default handler:', err);
    }
  }

  // 3. Primary active zero-configuration handler: FormSubmit AJAX
  // Posts directly to sakarmtech@gmail.com with zero accounts or API keys required
  try {
    const payload = {
      'Client / Brand': sanitizedName,
      'Email Address': sanitizedEmail,
      'Phone / WhatsApp': sanitizedPhone,
      'Project Subject': sanitizedSubject,
      'Vision Overview': sanitizedMessage,
      '_subject': `[Sacar Vedia Inquiry] ${sanitizedSubject} - ${sanitizedName}`,
      '_template': 'table',
      '_captcha': 'false'
    };

    if (data.productionType) {
      payload['Production Type'] = data.productionType;
    }
    if (data.videoCount) {
      payload['Video Quantity'] = `${data.videoCount} ${data.videoCount === 1 ? 'Video' : 'Videos'}`;
    }
    if (data.budget) {
      payload['Estimated Budget'] = data.budget;
    }
    if (data.timeline) {
      payload['Production Timeline'] = data.timeline;
    }
    if (sanitizedEmail !== 'Not provided') {
      payload['_replyto'] = sanitizedEmail;
    }

    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    // FormSubmit returns success: "true" or "false" (with activation notice on first run)
    if (response.ok) {
      return { 
        ok: true, 
        message: result.message || 'Inquiry successfully transmitted to sakarmtech@gmail.com.' 
      };
    }

    // If FormSubmit returns with activation message, the activation email was sent to sakarmtech@gmail.com
    if (result.message && result.message.toLowerCase().includes('activation')) {
      return { 
        ok: true, 
        isActivation: true,
        message: result.message 
      };
    }

    return { 
      ok: false, 
      error: result.message || `Unable to send automatically. Please contact ${CONTACT_EMAIL} or WhatsApp directly.` 
    };
  } catch (err) {
    console.error('Email transmission error:', err);
    return { 
      ok: false, 
      error: `Network transmission notice: Please email ${CONTACT_EMAIL} or message on WhatsApp.` 
    };
  }
}
