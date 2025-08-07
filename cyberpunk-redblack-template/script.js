'use strict';

(function () {
  const config = window.SITE_CONFIG || {};

  // Elements
  const siteTitle = document.getElementById('site-title');
  const siteTagline = document.getElementById('site-tagline');
  const footerText = document.getElementById('footer-text');

  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  const aboutText = document.getElementById('about-text');
  const xpList = document.getElementById('experience-list');

  const contactList = document.getElementById('contact-list');

  const uploader = document.getElementById('image-uploader');
  const reelTrack = document.getElementById('reel-track');

  let currentPanel = document.querySelector('.panel.is-active');
  let reelTween = null;

  // Populate content from config
  function populateFromConfig() {
    if (config.siteTitle) siteTitle.textContent = config.siteTitle;
    if (config.tagline) siteTagline.textContent = config.tagline;
    if (config.footer) footerText.textContent = config.footer;

    if (config.about) aboutText.textContent = config.about;

    if (Array.isArray(config.experience)) {
      xpList.innerHTML = '';
      config.experience.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'xp-item';
        li.innerHTML = `
          <div class="xp-title">${escapeHtml(item.role || '')}</div>
          <div class="xp-meta">${escapeHtml(item.company || '')} — ${escapeHtml(item.period || '')}</div>
          <p class="xp-desc">${escapeHtml(item.description || '')}</p>
        `;
        xpList.appendChild(li);
      });
    }

    if (config.contact && typeof config.contact === 'object') {
      contactList.innerHTML = '';
      Object.entries(config.contact).forEach(([label, value]) => {
        const li = document.createElement('li');
        li.className = 'contact-item';

        const labelEl = document.createElement('div');
        labelEl.className = 'contact-label';
        labelEl.textContent = label;

        const valueEl = document.createElement('div');
        valueEl.className = 'contact-value';

        if (isLikelyUrl(value)) {
          const a = document.createElement('a');
          a.href = value;
          a.textContent = value;
          a.className = 'contact-link';
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          valueEl.appendChild(a);
        } else {
          valueEl.textContent = value;
        }

        li.appendChild(labelEl);
        li.appendChild(valueEl);
        contactList.appendChild(li);
      });
    }
  }

  function isLikelyUrl(str) {
    return typeof str === 'string' && /^(https?:)\/\//i.test(str);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Navigation: animate panel transition
  function showPanel(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target || target === currentPanel) return;

    const outgoing = currentPanel;
    const incoming = target;

    // Animate out current
    gsap.to(outgoing.querySelector('.panel-inner'), {
      duration: 0.35,
      y: 12,
      opacity: 0,
      ease: 'power2.out',
      onComplete: () => {
        outgoing.classList.remove('is-active');

        // Set up incoming initial state and show
        incoming.classList.add('is-active');
        gsap.fromTo(
          incoming.querySelector('.panel-inner'),
          { y: -12, opacity: 0 },
          { duration: 0.45, y: 0, opacity: 1, ease: 'power3.out' }
        );

        currentPanel = incoming;
      },
    });
  }

  // GSAP intro and button hover effects
  function animateIntro() {
    gsap.from(['.branding h1', '.branding .tagline'], {
      duration: 0.7,
      y: -12,
      opacity: 0,
      stagger: 0.12,
      ease: 'power3.out',
    });

    gsap.from('.nav-btn', {
      duration: 0.5,
      opacity: 0,
      y: 8,
      stagger: 0.08,
      delay: 0.1,
      ease: 'power2.out',
    });

    navButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { duration: 0.25, y: -2, boxShadow: '0 0 12px rgba(255,0,51,0.4)', borderColor: '#ff0033' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { duration: 0.25, y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', borderColor: 'var(--border)' });
      });
    });

    // Subtle panel load animation
    gsap.from('.panel.is-active .panel-inner', { duration: 0.6, y: 10, opacity: 0, ease: 'power2.out' });
  }

  // Gallery / Reel
  function clearReel() {
    if (reelTween) {
      reelTween.kill();
      reelTween = null;
    }
    reelTrack.innerHTML = '';
    gsap.set(reelTrack, { x: 0 });
  }

  function setupReelAnimation() {
    // Duplicate images to create a seamless loop effect
    const imgs = Array.from(reelTrack.querySelectorAll('img'));
    if (imgs.length === 0) return;

    // Ensure enough content width by cloning
    const baseWidth = reelTrack.scrollWidth;
    while (reelTrack.scrollWidth < baseWidth * 2.2) {
      imgs.forEach((img) => {
        const clone = img.cloneNode(true);
        reelTrack.appendChild(clone);
      });
    }

    const totalWidth = reelTrack.scrollWidth;

    reelTween = gsap.to(reelTrack, {
      x: -totalWidth / 2,
      duration: Math.max(20, totalWidth / 200),
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        gsap.set(reelTrack, { x: 0 });
      },
    });

    // Pause on hover
    const reel = reelTrack.parentElement;
    reel.addEventListener('mouseenter', () => reelTween && reelTween.pause());
    reel.addEventListener('mouseleave', () => reelTween && reelTween.resume());
  }

  function handleUpload(files) {
    if (!files || files.length === 0) return;
    clearReel();

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const img = document.createElement('img');
      img.src = url;
      img.alt = file.name;
      reelTrack.appendChild(img);
    });

    // Wait for images to load to get sizes
    const imageEls = Array.from(reelTrack.querySelectorAll('img'));
    let loaded = 0;
    imageEls.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imageEls.length) setupReelAnimation();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === imageEls.length) setupReelAnimation();
        });
      }
    });
  }

  function addPlaceholderReel() {
    // Provide a few placeholders so the reel is visible before upload
    const placeholders = [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534488972332-225fcd03f205?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514894780887-121968d00567?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565773358299-609b23db2b85?q=80&w=1400&auto=format&fit=crop'
    ];

    placeholders.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `placeholder-${i}`;
      reelTrack.appendChild(img);
    });

    const imageEls = Array.from(reelTrack.querySelectorAll('img'));
    let loaded = 0;
    imageEls.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imageEls.length) setupReelAnimation();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === imageEls.length) setupReelAnimation();
        });
      }
    });
  }

  // Wire events
  function wireEvents() {
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        showPanel(target);
      });
    });

    uploader.addEventListener('change', (e) => {
      handleUpload(e.target.files);
      // reset input so same files can be re-selected
      e.target.value = '';
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    populateFromConfig();
    wireEvents();
    animateIntro();
    addPlaceholderReel();
  });
})();