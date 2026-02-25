(function () {
  const MOBILE_BREAKPOINT = 1000;
  const PAGE_BY_FILENAME = {
    '': 'home',
    'index.html': 'home',
    'services.html': 'services',
    'about.html': 'about',
    'blog.html': 'blog',
    'contact.html': 'contact',
    'privacy.html': 'privacy',
    'terms.html': 'terms',
  };
  const NAV_ITEMS = [
    { key: 'home', href: 'index.html', label: 'Home' },
    { key: 'services', href: 'services.html', label: 'Services' },
    { key: 'about', href: 'about.html', label: 'About' },
    { key: 'blog', href: 'blog.html', label: 'Blog' },
    { key: 'contact', href: 'contact.html', label: 'Contact' },
  ];

  function onReady(handler) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handler, { once: true });
      return;
    }
    handler();
  }

  function inferCurrentPage() {
    const explicitPage = (document.body?.dataset.page || '').trim().toLowerCase();
    if (explicitPage) {
      return explicitPage;
    }

    const pathname = decodeURIComponent(window.location.pathname || '').toLowerCase();
    const filename = pathname.split('/').pop() || '';
    return PAGE_BY_FILENAME[filename] || '';
  }

  function buildSharedNav(activePage, logoSrc) {
    const navLinks = NAV_ITEMS.map((item) => {
      const isActive = item.key === activePage;
      return `<li><a href="${item.href}"${isActive ? ' class="active" aria-current="page"' : ''}>${item.label}</a></li>`;
    }).join('');

    return `<nav>
  <a class="nav-logo" href="index.html"><img class="site-logo site-logo-nav" src="${logoSrc}" alt="Trare Technologies logo"/><span class="sr-only">Trare Technologies</span></a>
  <ul class="nav-links">${navLinks}</ul>
  <a class="nav-cta" href="contact.html">Get Secured</a>
</nav>`;
  }

  function buildSharedFooter(logoSrc) {
    return `<div class="footer-grid">
    <div class="footer-brand-col">
      <div class="footer-logo"><img class="site-logo site-logo-footer" src="${logoSrc}" alt="Trare Technologies logo"/><span class="sr-only">Trare Technologies</span></div>
      <div class="footer-slogan">// Quest for Zero Defeat</div>
      <p>Zambia's premier IT and Cybersecurity company, delivering digital defense and software solutions since 2019.</p>
    </div>
    <div class="footer-col">
      <h4>Pages</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="services.html">Cybersecurity</a></li>
        <li><a href="services.html">Pen Testing</a></li>
        <li><a href="services.html">Web Design</a></li>
        <li><a href="services.html">Networking</a></li>
        <li><a href="services.html">Software</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:+2600776514220">+260 0776 514 220</a></li>
        <li><a href="tel:+260960847673">+260 960 847 673</a></li>
        <li><a href="contact.html">Send Message</a></li>
        <li><a href="index.html#brochure">Get Brochure</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">&copy; 2024 Trare Technologies &middot; Lusaka, Zambia &middot; PACRA Registered</div>
    <div class="footer-legal">
      <a href="privacy.html">Privacy Policy</a>
      <a href="terms.html">Terms & Conditions</a>
    </div>
  </div>`;
  }

  function mountSharedLayout() {
    const logoSrc = (document.body?.dataset.logoSrc || 'assets/img/logo.png').trim();
    const activePage = inferCurrentPage();
    const headerHost = document.getElementById('site-header');
    const footerHost = document.getElementById('site-footer');

    if (headerHost) {
      headerHost.innerHTML = buildSharedNav(activePage, logoSrc);
    }

    if (footerHost) {
      footerHost.innerHTML = buildSharedFooter(logoSrc);
    }
  }

  function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function applyExternalLinkSafety() {
    document.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
      const relParts = (anchor.getAttribute('rel') || '')
        .split(/\s+/)
        .filter(Boolean);

      if (!relParts.includes('noopener')) {
        relParts.push('noopener');
      }
      if (!relParts.includes('noreferrer')) {
        relParts.push('noreferrer');
      }

      anchor.setAttribute('rel', relParts.join(' '));

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('http://maps.google.com')) {
        anchor.setAttribute('href', href.replace('http://', 'https://'));
      }
    });
  }

  function initMobileNav() {
    const nav = document.querySelector('nav');
    if (!nav) {
      return;
    }

    const sourceLinks = nav.querySelector('.nav-links');
    if (!sourceLinks) {
      return;
    }

    document.body.classList.add('nav-mobile-ready');

    let toggle = nav.querySelector('.nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle navigation menu');
      toggle.innerHTML = '<span></span><span></span><span></span>';
      nav.appendChild(toggle);
    }

    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-label', 'Close navigation menu');
    backdrop.hidden = true;

    const panel = document.createElement('aside');
    panel.className = 'mobile-nav-panel';
    panel.hidden = true;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mobile-nav-close';
    closeButton.setAttribute('aria-label', 'Close navigation menu');
    closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    panel.appendChild(closeButton);

    const title = document.createElement('div');
    title.className = 'mobile-nav-title';
    title.textContent = 'Navigation';
    panel.appendChild(title);

    const linksList = document.createElement('ul');
    linksList.className = 'mobile-nav-links';

    sourceLinks.querySelectorAll('a').forEach((anchor) => {
      const li = document.createElement('li');
      const clone = anchor.cloneNode(true);
      li.appendChild(clone);
      linksList.appendChild(li);
    });

    panel.appendChild(linksList);

    const cta = nav.querySelector('.nav-cta');
    if (cta) {
      const ctaClone = cta.cloneNode(true);
      ctaClone.classList.add('mobile-nav-cta');
      panel.appendChild(ctaClone);
    }

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    const closePanel = () => {
      toggle.setAttribute('aria-expanded', 'false');
      backdrop.hidden = true;
      panel.hidden = true;
      document.body.classList.remove('nav-open');
    };

    const openPanel = () => {
      toggle.setAttribute('aria-expanded', 'true');
      backdrop.hidden = false;
      panel.hidden = false;
      document.body.classList.add('nav-open');
    };

    const togglePanel = () => {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closePanel();
      } else {
        openPanel();
      }
    };

    toggle.addEventListener('click', togglePanel);
    closeButton.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    panel.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        closePanel();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closePanel();
      }
    });
  }

  function initRevealAnimations() {
    const targets = document.querySelectorAll('.fade-up');
    if (!targets.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function initNodeCanvas() {
    const canvas = document.getElementById('node-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const isReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      return;
    }

    const nodeCount = parseNumber(canvas.dataset.nodes, 55);
    const threatRate = parseNumber(canvas.dataset.threatRate, 0.07);
    const linkDistance = parseNumber(canvas.dataset.linkDistance, 180);
    const linkAlpha = parseNumber(canvas.dataset.linkAlpha, 0.22);
    const speedScale = parseNumber(canvas.dataset.speed, 0.55);
    const linkColor = canvas.dataset.linkColor || '#1e90ff';
    const threatLinkColor = canvas.dataset.linkThreatColor || '#8a5cff';
    const palette = (canvas.dataset.palette || '#1e90ff,#ff8c00,#1e90ff,#2f66ff')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    let width = 0;
    let height = 0;
    let frameHandle = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    const nodes = [];

    for (let i = 0; i < nodeCount; i += 1) {
      const isThreat = Math.random() < threatRate;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedScale,
        vy: (Math.random() - 0.5) * speedScale,
        radius: Math.random() * 2 + 1,
        isThreat,
        color: isThreat ? '#8a5cff' : palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.45 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.018,
      });
    }

    function tick() {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < linkDistance) {
            context.save();
            context.globalAlpha = (1 - distance / linkDistance) * linkAlpha;
            context.strokeStyle = a.isThreat || b.isThreat ? threatLinkColor : linkColor;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
            context.restore();
          }
        }
      }

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < -60) node.x = width + 60;
        if (node.x > width + 60) node.x = -60;
        if (node.y < -60) node.y = height + 60;
        if (node.y > height + 60) node.y = -60;

        const alpha = node.alpha * (0.65 + 0.35 * Math.sin(node.pulse));

        context.save();
        context.globalAlpha = alpha;
        context.strokeStyle = node.color;
        context.lineWidth = 0.5;
        context.beginPath();
        context.arc(node.x, node.y, node.radius * 2.8, 0, Math.PI * 2);
        context.stroke();

        context.fillStyle = node.color;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();

        const glow = context.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 6
        );
        glow.addColorStop(0, node.color + '2a');
        glow.addColorStop(1, 'transparent');

        context.beginPath();
        context.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
        context.fillStyle = glow;
        context.fill();
        context.restore();
      });

      frameHandle = window.requestAnimationFrame(tick);
    }

    tick();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameHandle);
      } else {
        tick();
      }
    });
  }

  function setMessage(target, message, stateClass) {
    if (!target) {
      return;
    }
    target.textContent = message;
    target.classList.remove('is-success', 'is-error');
    if (stateClass) {
      target.classList.add(stateClass);
    }
  }

  function initBlogFilters() {
    const buttons = Array.from(document.querySelectorAll('.filter-btn[data-filter]'));
    const cards = Array.from(document.querySelectorAll('.blog-card[data-category]'));

    if (!buttons.length || !cards.length) {
      return;
    }

    const emptyState = document.getElementById('blog-empty');

    function applyFilter(filter) {
      let visibleCount = 0;

      buttons.forEach((button) => {
        button.classList.toggle('active', button.dataset.filter === filter);
      });

      cards.forEach((card) => {
        const category = card.dataset.category || '';
        const show = filter === 'all' || category.split(',').includes(filter);
        card.hidden = !show;
        if (show) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
    });

    const urlFilter = new URL(window.location.href).searchParams.get('category');
    const initialFilter = buttons.some((btn) => btn.dataset.filter === urlFilter)
      ? urlFilter
      : 'all';

    applyFilter(initialFilter || 'all');
  }

  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const emailInput = form.querySelector('input[type="email"]');
    if (!(emailInput instanceof HTMLInputElement)) {
      return;
    }

    const status =
      document.getElementById('newsletter-status') ||
      form.parentElement?.querySelector('.nl-status');
    const storageKey = form.dataset.storageKey || 'trare_newsletter_subscribers';

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = emailInput.value.trim().toLowerCase();
      if (!email) {
        setMessage(status, 'Enter a valid email address.', 'is-error');
        emailInput.focus();
        return;
      }

      let subscribers = [];

      try {
        const raw = localStorage.getItem(storageKey);
        subscribers = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(subscribers)) {
          subscribers = [];
        }
      } catch (error) {
        subscribers = [];
      }

      if (subscribers.includes(email)) {
        setMessage(status, 'This email is already subscribed.', 'is-error');
        return;
      }

      subscribers.push(email);
      localStorage.setItem(storageKey, JSON.stringify(subscribers));

      setMessage(status, 'Subscription saved. You will receive the next brief.', 'is-success');
      form.reset();
    });
  }

  function serializeForm(form) {
    const payload = {};
    const formData = new FormData(form);

    formData.forEach((value, key) => {
      payload[key] = typeof value === 'string' ? value.trim() : value;
    });

    return payload;
  }

  function buildContactBody(payload) {
    const lines = [
      `Full Name: ${payload.full_name || ''}`,
      `Company: ${payload.company || ''}`,
      `Email: ${payload.email || ''}`,
      `Phone: ${payload.phone || ''}`,
      `Service Needed: ${payload.service || 'Not specified'}`,
      '',
      'Message:',
      payload.message || '',
    ];

    return lines.join('\n');
  }

  async function postContactForm(endpoint, payload) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  }

  function rememberSubmission(payload) {
    const key = 'trare_contact_submissions';

    try {
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const safeCurrent = Array.isArray(current) ? current : [];
      safeCurrent.push({ ...payload, submittedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(safeCurrent));
    } catch (error) {
      // Best effort only.
    }
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const status =
      document.getElementById('contact-status') || form.parentElement?.querySelector('.form-status');
    const successBox = document.getElementById('form-success');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setMessage(status, 'Please complete all required fields.', 'is-error');
        return;
      }

      const payload = serializeForm(form);
      const endpoint = form.dataset.endpoint;
      const mailTo = form.dataset.mailto || 'traretechnologies@email.com';

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }

      setMessage(status, 'Submitting your message...', '');

      let sent = false;

      try {
        if (endpoint) {
          sent = await postContactForm(endpoint, payload);
        }
      } catch (error) {
        sent = false;
      }

      rememberSubmission(payload);

      if (!sent) {
        const subject = encodeURIComponent(
          `Website inquiry from ${payload.full_name || payload.email || 'visitor'}`
        );
        const body = encodeURIComponent(buildContactBody(payload));
        window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
        sent = true;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }

      if (sent) {
        form.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';
        }
        setMessage(
          status,
          'Message prepared successfully. If your email app did not open, call +260 0776 514 220.',
          'is-success'
        );
        form.reset();
      } else {
        setMessage(
          status,
          'Unable to send now. Please contact us by phone.',
          'is-error'
        );
      }
    });
  }

  onReady(() => {
    mountSharedLayout();
    applyExternalLinkSafety();
    initMobileNav();
    initRevealAnimations();
    initNodeCanvas();
    initBlogFilters();
    initNewsletterForm();
    initContactForm();
  });
})();
