/**
 * Graduation RSVP Web Application & Management Portal
 * Ian Kiromo Githengu - B.Sc. Applied Computer Science
 * Daystar University Class of 2026
 */

const CONFIG = {
  // Local Python API endpoint (active when running python server.py)
  LOCAL_API_ENDPOINT: '/api/rsvp',
  ADMIN_API_ENDPOINT: '/api/rsvps',
  EXPORT_CSV_ENDPOINT: '/api/export-csv',
  
  // Optional remote Webhook for cloud hosting (e.g., Google Apps Script Web App or Formspree)
  // See GOOGLE_SHEETS_SETUP.md for 2-minute free setup instructions
  REMOTE_WEBHOOK_URL: '',

  // Storage keys & Security
  STORAGE_KEY: 'ikg_grad_rsvp_2026',
  ADMIN_CACHE_KEY: 'ikg_all_rsvps_cache',
  ADMIN_PIN: '2026',
  BACKGROUND_IMAGE_PATH: 'blank_invitation.jpg'
};

document.addEventListener('DOMContentLoaded', () => {
  initNetworkBackground();
  initCountdownTimer();
  initRSVPForm();
  initCalendarIntegrations();
  initCopyCoordinates();
  initScrollAnimations();
  initAdminPortal();
});

/* ===================================================================
   1. TECH BACKGROUND: INTERACTIVE NETWORK NODES & CIRCUIT LINES
   =================================================================== */
function initNetworkBackground() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDistance: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 18000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDistance) {
          const force = (mouse.maxDistance - dist) / mouse.maxDistance;
          this.x -= (dx / dist) * force * 1.2;
          this.y -= (dy / dist) * force * 1.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          const alpha = (1 - distance / 110) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. FUNCTIONAL COUNTDOWN TIMER
   Target: Saturday, November 28, 2026, 14:00:00 (EAT / UTC+3)
   =================================================================== */
function initCountdownTimer() {
  const targetDate = new Date('2026-11-28T14:00:00+03:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  const barDays = document.getElementById('bar-days');
  const barHours = document.getElementById('bar-hours');
  const barMins = document.getElementById('bar-minutes');
  const barSecs = document.getElementById('bar-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function pad(num) {
    return num < 10 ? '0' + num : num.toString();
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';

      const tag = document.querySelector('.section-tag');
      if (tag) tag.textContent = '<STATUS: CELEBRATION IS LIVE / CONFERRED />';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(minutes);
    secsEl.textContent = pad(seconds);

    if (barDays) barDays.style.width = `${Math.min((days / 365) * 100, 100)}%`;
    if (barHours) barHours.style.width = `${((24 - hours) / 24) * 100}%`;
    if (barMins) barMins.style.width = `${((60 - minutes) / 60) * 100}%`;
    if (barSecs) barSecs.style.width = `${((60 - seconds) / 60) * 100}%`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ===================================================================
   3. BACKEND DATA COLLECTION & RSVP FORM
   =================================================================== */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const successCard = document.getElementById('rsvp-success-card');
  const feedbackBanner = document.getElementById('rsvp-feedback-banner');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const editBtn = document.getElementById('edit-rsvp-btn');
  const guestCountGroup = document.getElementById('guest-count-group');

  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestCountSelect = document.getElementById('guestCount');
  const congratsMsgInput = document.getElementById('congratsMessage');

  const fullNameError = document.getElementById('fullName-error');
  const phoneError = document.getElementById('phoneNumber-error');

  // Toggle guest count visibility based on Yes/No
  attendingRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'No') {
        guestCountGroup.style.display = 'none';
      } else {
        guestCountGroup.style.display = 'block';
      }
    });
  });

  fullNameInput.addEventListener('input', () => {
    fullNameError.textContent = '';
    fullNameInput.closest('.input-shell').classList.remove('has-error');
  });

  phoneInput.addEventListener('input', () => {
    phoneError.textContent = '';
    phoneInput.closest('.input-shell').classList.remove('has-error');
  });

  // Check existing RSVP in localStorage
  const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      showSuccessCard(parsed, false);
    } catch (e) {
      console.warn('Invalid saved RSVP');
    }
  }

  // Handle Form Submission with Backend Ingestion & Card Generation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = fullNameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const attendingVal = document.querySelector('input[name="attending"]:checked')?.value || 'Yes';
    const guestCountVal = attendingVal === 'Yes' ? guestCountSelect.value : '0';
    const notesVal = congratsMsgInput.value.trim();

    if (!nameVal || nameVal.length < 2) {
      fullNameError.textContent = 'Please enter your individual or group/family name.';
      fullNameInput.closest('.input-shell').classList.add('has-error');
      isValid = false;
    }

    const phonePattern = /^(\+?[0-9\s\-()]{7,20})$/;
    if (!phoneVal || !phonePattern.test(phoneVal)) {
      phoneError.textContent = 'Please provide a valid contact phone number.';
      phoneInput.closest('.input-shell').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      showFeedback('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    // Submit state animation
    submitBtn.disabled = true;
    submitBtn.classList.add('submitting');
    const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Generating Personalized Card...';

    // Generate or preserve reference code
    let refCode = 'IKG-ACS-' + Math.floor(1000 + Math.random() * 9000);
    if (savedData) {
      try {
        const p = JSON.parse(savedData);
        if (p.referenceCode) refCode = p.referenceCode;
      } catch (err) {}
    }

    const dietarySelect = document.getElementById('dietaryRequirements');
    const dietaryVal = dietarySelect ? dietarySelect.value : 'Standard Menu';
    const teaSelect = document.getElementById('teaPreference');
    const teaVal = teaSelect ? teaSelect.value : 'Chai (Tea with Sugar)';

    const rsvpPayload = {
      referenceCode: refCode,
      fullName: nameVal,
      phoneNumber: phoneVal,
      attending: attendingVal,
      guestCount: guestCountVal,
      dietary: dietaryVal,
      teaPreference: teaVal,
      message: notesVal,
      timestamp: new Date().toISOString()
    };

    let backendSuccess = false;

    // 1. Send to Local Python Server Backend
    try {
      const resp = await fetch(CONFIG.LOCAL_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpPayload)
      });
      if (resp.ok) {
        backendSuccess = true;
        console.log('✓ RSVP saved to Python backend.');
      }
    } catch (netErr) {
      console.log('Local backend not responding or running static; relying on storage.');
    }

    // 2. Send to Remote Webhook (Google Sheets / Formspree) if configured
    if (CONFIG.REMOTE_WEBHOOK_URL) {
      try {
        await fetch(CONFIG.REMOTE_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpPayload)
        });
        backendSuccess = true;
        console.log('✓ RSVP transmitted to remote webhook.');
      } catch (webhookErr) {
        console.warn('Webhook transmission error:', webhookErr);
      }
    }

    // 3. Persist to browser localStorage and Admin Cache
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(rsvpPayload));
      saveToAdminCache(rsvpPayload);
    } catch (storageErr) {
      console.warn('LocalStorage error:', storageErr);
    }

    // Reset button
    submitBtn.disabled = false;
    submitBtn.classList.remove('submitting');
    submitBtn.querySelector('.btn-text').textContent = originalBtnText;

    // Celebration Confetti
    launchConfetti();

    // Display confirmation and render Personalized Invitation Card
    showSuccessCard(rsvpPayload, true, backendSuccess);
  });

  function showSuccessCard(data, isNewSubmission, wasBackendOnline) {
    form.style.display = 'none';
    successCard.style.display = 'block';

    const recipientTitle = document.getElementById('confirmed-recipient-title');
    if (recipientTitle) recipientTitle.textContent = data.fullName;

    document.getElementById('confirmed-name').textContent = data.fullName;
    document.getElementById('confirmed-phone').textContent = data.phoneNumber;
    
    const statusEl = document.getElementById('confirmed-status');
    const partyRow = document.getElementById('confirmed-party-row');
    const dbStatusEl = document.getElementById('confirmed-db-status');
    
    if (data.attending === 'Yes') {
      statusEl.textContent = 'ATTENDING (CONFIRMED)';
      statusEl.style.color = '#38bdf8';
      statusEl.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      partyRow.style.display = 'flex';
      document.getElementById('confirmed-guests').textContent = `${data.guestCount} Attendee(s)`;
    } else {
      statusEl.textContent = 'REGRETFULLY DECLINED';
      statusEl.style.color = '#f59e0b';
      statusEl.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      partyRow.style.display = 'none';
    }

    const dietRow = document.getElementById('confirmed-diet-row');
    const dietValEl = document.getElementById('confirmed-dietary');
    const teaRow = document.getElementById('confirmed-tea-row');
    const teaValEl = document.getElementById('confirmed-tea');

    if (dietValEl) dietValEl.textContent = data.dietary || 'Standard Menu';
    if (teaValEl) teaValEl.textContent = data.teaPreference || 'Chai (Tea with Sugar)';

    if (data.attending === 'No') {
      if (dietRow) dietRow.style.display = 'none';
      if (teaRow) teaRow.style.display = 'none';
    } else {
      if (dietRow) dietRow.style.display = 'flex';
      if (teaRow) teaRow.style.display = 'flex';
    }

    document.getElementById('confirmed-ref').textContent = data.referenceCode || 'IKG-2026-ACS-DAYSTAR';

    if (dbStatusEl) {
      dbStatusEl.textContent = '✓ Recorded in Guest Database';
      dbStatusEl.className = 'ticket-val text-green';
    }

    if (feedbackBanner) {
      feedbackBanner.style.display = 'none';
    }

    // Render the Dynamic Personalized Invitation Card onto HTML5 Canvas
    renderPersonalizedInvitationCard(data.fullName, data.guestCount, data.attending);

    if (isNewSubmission) {
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Edit / Update RSVP button
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          fullNameInput.value = parsed.fullName || '';
          phoneInput.value = parsed.phoneNumber || '';
          congratsMsgInput.value = parsed.message || '';
          if (dietarySelect && parsed.dietary) dietarySelect.value = parsed.dietary;
          if (teaSelect && parsed.teaPreference) teaSelect.value = parsed.teaPreference;
          
          if (parsed.attending === 'No') {
            document.getElementById('attending-no').checked = true;
            guestCountGroup.style.display = 'none';
          } else {
            document.getElementById('attending-yes').checked = true;
            guestCountGroup.style.display = 'block';
            guestCountSelect.value = parsed.guestCount || '1';
          }
        } catch (e) {}
      }

      successCard.style.display = 'none';
      form.style.display = 'block';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function showFeedback(message, type) {
    if (!feedbackBanner) return;
    feedbackBanner.className = `feedback-banner ${type}`;
    feedbackBanner.textContent = message;
    feedbackBanner.style.display = 'block';
  }
}

/* ===================================================================
   4. DYNAMIC PERSONALIZED INVITATION CARD GENERATOR (HTML5 CANVAS)
   =================================================================== */
function renderPersonalizedInvitationCard(guestName, guestCount, attendingStatus) {
  const canvas = document.getElementById('invitation-card-canvas');
  const spinner = document.getElementById('canvas-loading-spinner');
  const downloadBtn = document.getElementById('download-invitation-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (spinner) spinner.style.display = 'flex';

  const cleanGuestName = (guestName || 'Honored Guest').trim();
  const partySize = parseInt(guestCount, 10) || 1;

  const bgImg = new Image();
  bgImg.crossOrigin = 'anonymous';
  bgImg.src = CONFIG.BACKGROUND_IMAGE_PATH;

  bgImg.onload = async () => {
    if (spinner) spinner.style.display = 'none';
    
    // Ensure custom web fonts (Playfair Display, Montserrat) are ready
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {}
    }

    // Set high-res canvas dimensions matching the background card
    canvas.width = bgImg.naturalWidth || 848;
    canvas.height = bgImg.naturalHeight || 1264;

    // 1. Draw the background card
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // 2. Draw the Personalized Guest/Family Name
    drawPersonalizedOverlay(ctx, canvas.width, canvas.height, cleanGuestName, partySize);
  };

  bgImg.onerror = () => {
    // Elegant procedural fallback in case image file is not yet cached or offline
    if (spinner) spinner.style.display = 'none';
    canvas.width = 1536;
    canvas.height = 1024;
    renderProceduralCard(ctx, canvas.width, canvas.height, cleanGuestName, partySize);
  };

  // Wire up the 1-Click Card Download Button
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      try {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        const sanitized = cleanGuestName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        link.download = `Ian_Kiromo_Graduation_Invitation_${sanitized}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.warn('Canvas export error:', err);
      }
    };
  }
}

function drawPersonalizedOverlay(ctx, width, height, guestName, partySize) {
  ctx.save();

  // Position: Perfectly centered in the open dark space below 'IAN KIROMO GITHENGU'
  const centerX = width * 0.50;
  const centerY = height * 0.625; // y ≈ 790 on 1264h poster
  const scale = width / 848;

  // Vertical positions with elegant, balanced spacing
  const cordiallyY = centerY - Math.round(65 * scale);
  const nameY = centerY - Math.round(10 * scale);
  const badgeY = centerY + Math.round(55 * scale);

  // -------------------------------------------------------------
  // 1. 'CORDIALLY INVITING' (Clean, heavily letter-spaced, #A0ABC0)
  // -------------------------------------------------------------
  ctx.save();
  const cordiallySize = Math.max(12, Math.round(14 * scale));
  ctx.fillStyle = '#A0ABC0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${Math.round(6 * scale)}px`;
    ctx.font = `500 ${cordiallySize}px "Montserrat", "Inter", sans-serif`;
    ctx.fillText('CORDIALLY INVITING', centerX, cordiallyY);
  } else {
    ctx.font = `500 ${cordiallySize}px "Montserrat", "Inter", sans-serif`;
    ctx.fillText('C O R D I A L L Y   I N V I T I N G', centerX, cordiallyY);
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 2. [GUEST NAME] (Focal point: Elegant serif, pure white #FFFFFF,
  //    soft black drop shadow blur 4px, NO neon glow)
  // -------------------------------------------------------------
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Dynamic font scaling for group names ("The Maina Family", "Alex & Guest")
  let nameSize = Math.round(44 * scale);
  const maxNameWidth = width * 0.72;
  const serifFontFamily = '"Playfair Display", "Cinzel", "Times New Roman", Georgia, serif';

  ctx.font = `700 ${nameSize}px ${serifFontFamily}`;
  let measured = ctx.measureText(guestName).width;
  while (measured > maxNameWidth && nameSize > 20) {
    nameSize -= 2;
    ctx.font = `700 ${nameSize}px ${serifFontFamily}`;
    measured = ctx.measureText(guestName).width;
  }

  // Soft, subtle black drop shadow (blur 4px) to float naturally over background
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Pure white crisp focal text
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(guestName, centerX, nameY);
  ctx.restore();

  // -------------------------------------------------------------
  // 3. '[ RESERVED PARTY: X GUESTS ]' (Small, tech-elegant, #8A9BB4)
  // -------------------------------------------------------------
  ctx.save();
  const badgeSize = Math.max(11, Math.round(13 * scale));
  ctx.fillStyle = '#8A9BB4';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${Math.round(2 * scale)}px`;
  }
  ctx.font = `500 ${badgeSize}px "Roboto Mono", "JetBrains Mono", "Inter", monospace`;

  const partyCount = parseInt(partySize, 10) || 1;
  const partyText = partyCount > 1
    ? `[ RESERVED PARTY: ${partyCount} GUESTS ]`
    : `[ RESERVED: 1 GUEST ]`;

  ctx.fillText(partyText, centerX, badgeY);
  ctx.restore();

  ctx.restore();
}

// Procedural Fallback in case image asset cannot be loaded
function renderProceduralCard(ctx, width, height, guestName, partySize) {
  // Slate Blue Background
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
  bgGrad.addColorStop(0, '#1c304f');
  bgGrad.addColorStop(1, '#0c1626');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Metallic Silver Outer Borders
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // Top Header
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ACADEMIC COMMENCEMENT // CLASS OF 2026', width / 2, 130);

  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('YOU ARE INVITED TO THE GRADUATION CELEBRATION OF IAN KIROMO GITHENGU', width / 2, 180);

  // Elegant Floating Guest Name (No box)
  drawPersonalizedOverlay(ctx, width, height, guestName, partySize);

  // Footer Details
  ctx.font = '600 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('DAYSTAR UNIVERSITY • B.SC. APPLIED COMPUTER SCIENCE', width / 2, height - 120);

  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('SATURDAY, NOVEMBER 28TH, 2026 • 2:00 PM • THEE BOBIANS RESIDENCE', width / 2, height - 85);
}

function saveToAdminCache(record) {
  let list = [];
  try {
    const raw = localStorage.getItem(CONFIG.ADMIN_CACHE_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {}

  const idx = list.findIndex(item => item.referenceCode === record.referenceCode || item.phoneNumber === record.phoneNumber);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.push(record);
  }

  try {
    localStorage.setItem(CONFIG.ADMIN_CACHE_KEY, JSON.stringify(list));
  } catch (e) {}
}

/* ===================================================================
   5. CALENDAR INTEGRATION (GOOGLE CALENDAR + APPLE/OUTLOOK .ICS)
   =================================================================== */
function initCalendarIntegrations() {
  const modal = document.getElementById('calendar-modal');
  const heroBtn = document.getElementById('add-to-calendar-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  
  const googleLink = document.getElementById('cal-google');
  const icsBtn = document.getElementById('cal-ics');
  
  const postGoogleLink = document.getElementById('post-rsvp-cal-google');
  const postIcsBtn = document.getElementById('post-rsvp-cal-ics');

  const title = encodeURIComponent("Graduation Celebration of Ian Kiromo Githengu");
  const details = encodeURIComponent(
    "Celebration of Ian Kiromo Githengu's Bachelor's Degree in Applied Computer Science from Daystar University.\n\n" +
    "Date: Saturday, November 28th, 2026 at 2:00 PM EAT\n" +
    "Venue: Thee Bobians Residence\n" +
    "Google Maps Pin: https://maps.google.com/?q=-1.1562,36.6424\n\n" +
    "We look forward to celebrating this milestone with you!"
  );
  const location = encodeURIComponent("Thee Bobians Residence (https://maps.google.com/?q=-1.1562,36.6424)");
  
  const startUtc = "20261128T110000Z";
  const endUtc = "20261128T160000Z";

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
  
  if (googleLink) googleLink.href = gcalUrl;
  if (postGoogleLink) postGoogleLink.href = gcalUrl;

  if (heroBtn && modal) {
    heroBtn.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        window.open(gcalUrl, '_blank');
      }
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }

  function downloadIcs() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ian Kiromo Githengu//Graduation Celebration//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:ikg-grad-2026@daystar.ac.ke",
      `DTSTAMP:${startUtc}`,
      `DTSTART:${startUtc}`,
      `DTEND:${endUtc}`,
      "SUMMARY:Graduation Celebration - Ian Kiromo Githengu (B.Sc. Applied Computer Science)",
      "DESCRIPTION:Celebrating Ian Kiromo Githengu's Bachelor's Degree in Applied Computer Science from Daystar University.\\nLocation: Thee Bobians Residence\\nMap: https://maps.google.com/?q=-1.1562,36.6424",
      "LOCATION:Thee Bobians Residence (-1.1562\\, 36.6424)",
      "GEO:-1.1562;36.6424",
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-PT24H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Ian Kiromo Graduation Celebration tomorrow at 2:00 PM!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Ian_Kiromo_Graduation_Celebration_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (modal && modal.open) modal.close();
  }

  if (icsBtn) icsBtn.addEventListener('click', downloadIcs);
  if (postIcsBtn) postIcsBtn.addEventListener('click', downloadIcs);
}

/* ===================================================================
   6. HIDDEN ADMIN PORTAL & BUDGETING CALCULATOR
   =================================================================== */
function initAdminPortal() {
  const authDialog = document.getElementById('admin-auth-dialog');
  const dashDialog = document.getElementById('admin-dashboard-modal');
  const authForm = document.getElementById('admin-auth-form');
  const pinInput = document.getElementById('admin-pin-input');
  const authError = document.getElementById('admin-auth-error');

  const closeAuthBtn = document.getElementById('close-auth-modal');
  const closeDashBtn = document.getElementById('close-admin-dash');

  const headerAdminBtn = document.getElementById('header-admin-btn');
  const footerAdminLink = document.getElementById('footer-admin-link');
  const terminalBadge = document.getElementById('brand-terminal-badge');

  const exportCsvBtn = document.getElementById('export-csv-btn');
  const refreshBtn = document.getElementById('refresh-admin-btn');
  const searchInput = document.getElementById('admin-search-input');
  const sampleDataBtn = document.getElementById('add-sample-data-btn');

  function navigateToAdmin() {
    window.location.href = 'admin.html';
  }

  if (terminalBadge) terminalBadge.addEventListener('click', navigateToAdmin);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      navigateToAdmin();
    }
  });

  async function loadAdminData() {
    let rsvps = [];
    
    try {
      const res = await fetch(`${CONFIG.ADMIN_API_ENDPOINT}?pin=${CONFIG.ADMIN_PIN}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.rsvps) {
          rsvps = json.rsvps;
        }
      }
    } catch (err) {
      console.log('Backend not reachable; falling back to local storage cache.');
    }

    try {
      const localCache = localStorage.getItem(CONFIG.ADMIN_CACHE_KEY);
      if (localCache) {
        const parsedCache = JSON.parse(localCache);
        parsedCache.forEach(item => {
          if (!rsvps.some(r => r.referenceCode === item.referenceCode || r.phoneNumber === item.phoneNumber)) {
            rsvps.push(item);
          }
        });
      }

      const selfRsvp = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (selfRsvp) {
        const p = JSON.parse(selfRsvp);
        if (!rsvps.some(r => r.referenceCode === p.referenceCode || r.phoneNumber === p.phoneNumber)) {
          rsvps.push(p);
        }
      }
    } catch (e) {}

    activeRsvps = rsvps;
    renderAdminView(activeRsvps);
  }

  function renderAdminView(rsvps) {
    let totalConfirmedGuests = 0;
    let attendingResponses = 0;
    let declinedResponses = 0;

    rsvps.forEach(r => {
      if (r.attending === 'Yes') {
        attendingResponses++;
        const g = parseInt(r.guestCount, 10);
        totalConfirmedGuests += isNaN(g) ? 1 : g;
      } else {
        declinedResponses++;
      }
    });

    document.getElementById('kpi-headcount').textContent = totalConfirmedGuests;
    document.getElementById('kpi-attending').textContent = attendingResponses;
    document.getElementById('kpi-declined').textContent = declinedResponses;
    document.getElementById('kpi-total').textContent = rsvps.length;

    renderTable(rsvps);
  }

  function renderTable(rsvps) {
    const tbody = document.getElementById('admin-table-body');
    const countEl = document.getElementById('table-display-count');
    if (!tbody) return;

    countEl.textContent = `Showing ${rsvps.length} guest records`;

    if (rsvps.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No RSVP responses recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = rsvps.map(r => {
      const isAttending = r.attending === 'Yes';
      const statusBadge = isAttending
        ? '<span class="badge-attending">Attending</span>'
        : '<span class="badge-declined">Declined</span>';

      return `
        <tr>
          <td><code class="code-font text-accent-blue">${r.referenceCode || '-'}</code></td>
          <td><strong>${escapeHtml(r.fullName)}</strong></td>
          <td>${escapeHtml(r.phoneNumber)}</td>
          <td>${statusBadge}</td>
          <td>${isAttending ? (r.guestCount || '1') + ' person(s)' : '-'}</td>
          <td><span class="text-muted">${escapeHtml(r.message || '—')}</span></td>
          <td><span class="text-muted" style="font-size: 0.78rem;">${r.timestamp ? r.timestamp.slice(0, 16) : '-'}</span></td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = activeRsvps.filter(r => 
        (r.fullName && r.fullName.toLowerCase().includes(q)) ||
        (r.phoneNumber && r.phoneNumber.includes(q)) ||
        (r.referenceCode && r.referenceCode.toLowerCase().includes(q))
      );
      renderTable(filtered);
    });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', loadAdminData);

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      window.location.href = `${CONFIG.EXPORT_CSV_ENDPOINT}?pin=${CONFIG.ADMIN_PIN}`;
      setTimeout(() => downloadClientCsv(activeRsvps), 500);
    });
  }

  function downloadClientCsv(data) {
    const headers = ["Reference Code", "Timestamp", "Full Name", "Phone Number", "Attending", "Party Size (Guests)", "Message"];
    const rows = data.map(r => [
      `"${r.referenceCode || ''}"`,
      `"${r.timestamp || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.phoneNumber || ''}"`,
      `"${r.attending || ''}"`,
      `"${r.attending === 'Yes' ? (r.guestCount || '1') : '0'}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `ian_kiromo_graduation_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (sampleDataBtn) {
    sampleDataBtn.addEventListener('click', () => {
      const sampleNames = ["The Maina Family", "Alex & Guest", "Dr. Jane Kariuki", "Grace Mwende"];
      const randName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const sample = {
        referenceCode: 'IKG-ACS-' + Math.floor(1000 + Math.random() * 9000),
        fullName: randName,
        phoneNumber: '+254 7' + Math.floor(10000000 + Math.random() * 90000000),
        attending: Math.random() > 0.2 ? 'Yes' : 'No',
        guestCount: Math.random() > 0.3 ? '3' : '2',
        message: 'Congratulations Ian! Proud of your achievement in Applied Computer Science.',
        timestamp: new Date().toISOString()
      };

      saveToAdminCache(sample);
      
      fetch(CONFIG.LOCAL_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      }).catch(() => {});

      loadAdminData();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

/* ===================================================================
   7. COPY GPS COORDINATES
   =================================================================== */
function initCopyCoordinates() {
  const copyBtn = document.getElementById('copy-coords-btn');
  const copyText = document.getElementById('copy-coords-text');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const coords = "-1.1562, 36.6424";
    try {
      await navigator.clipboard.writeText(coords);
      if (copyText) copyText.textContent = "✓ Coordinates Copied!";
      copyBtn.style.borderColor = "var(--accent-blue)";
      
      setTimeout(() => {
        if (copyText) copyText.textContent = "Copy Coordinates";
        copyBtn.style.borderColor = "";
      }, 2500);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = coords;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      if (copyText) copyText.textContent = "✓ Coordinates Copied!";
      setTimeout(() => {
        if (copyText) copyText.textContent = "Copy Coordinates";
      }, 2500);
    }
  });
}

/* ===================================================================
   8. SCROLL FADE-IN ANIMATIONS
   =================================================================== */
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-in-up');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach((el) => observer.observe(el));
}

/* ===================================================================
   9. TECH CONFETTI CELEBRATION ENGINE
   =================================================================== */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#38bdf8', '#60a5fa', '#e2e8f0', '#ffffff', '#22d3ee', '#818cf8'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -12 - 5,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.35,
      opacity: 1
    });
  }

  let animationFrame;
  let startTimestamp = null;

  function render(now) {
    if (!startTimestamp) startTimestamp = now;
    const elapsed = now - startTimestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let active = false;
    for (let p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      if (elapsed > 1800) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < canvas.height + 20) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (active && elapsed < 4000) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  requestAnimationFrame(render);
}
