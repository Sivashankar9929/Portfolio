'use strict';

/* ===========================
   BOOT GUARD
   Ensures boot() runs even if
   loader elements are missing
   =========================== */
let booted = false;
function safeBoot() {
  if (booted) return;
  booted = true;
  boot();
}
// Hard fallback — if loader never calls boot, fire after 4s
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(safeBoot, 4000);
});

/* ===========================
   LOADER
   =========================== */
(function () {
  const loaderEl = document.getElementById('loader');
  const cmdEl    = document.getElementById('loaderCmd');
  const pctEl    = document.getElementById('loaderPct');
  const statEl   = document.getElementById('loaderStatus');

  // If any element missing, hide loader immediately and boot
  if (!loaderEl || !cmdEl || !pctEl || !statEl) {
    if (loaderEl) loaderEl.style.display = 'none';
    safeBoot();
    return;
  }

  const steps = [
    { cmd: 'cloud init --env production',     status: 'Connecting to cloud...',         pct: 0   },
    { cmd: 'terraform plan --target azure',   status: 'Provisioning infrastructure...', pct: 28  },
    { cmd: 'docker build -t kss-portfolio',   status: 'Building containers...',          pct: 54  },
    { cmd: 'kubectl apply -f deploy.yaml',    status: 'Deploying to cluster...',         pct: 78  },
    { cmd: 'pipeline run --stage production', status: 'Pipeline complete \u2713',        pct: 100 },
  ];

  let si = 0, ci = 0, pctCur = 0;

  function typeLine() {
    const s = steps[si];
    if (ci < s.cmd.length) {
      cmdEl.textContent = s.cmd.slice(0, ++ci);
      setTimeout(typeLine, 36);
    } else {
      statEl.textContent = s.status;
      animatePct(s.pct, () => {
        si++;
        if (si < steps.length) { ci = 0; setTimeout(typeLine, 160); }
        else setTimeout(hide, 340);
      });
    }
  }

  function animatePct(target, cb) {
    const dur = 400, start = pctCur, diff = target - start, t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      pctEl.textContent = Math.round(start + diff * p) + '%';
      pctCur = Math.round(start + diff * p);
      p < 1 ? requestAnimationFrame(tick) : cb && cb();
    }
    requestAnimationFrame(tick);
  }

  function hide() {
    loaderEl.classList.add('hidden');
    setTimeout(() => {
      loaderEl.style.display = 'none';
      safeBoot();
    }, 620);
  }

  setTimeout(typeLine, 280);
})();

/* ===========================
   BOOT
   =========================== */
function boot() {
  initBgCanvas();
  initTypewriter();
  initHeroEntrance();
  initCounters();
  initScrollReveal();
  initFlipCardKeyboard();
}

/* ===========================
   PARTICLE CANVAS — PERF OPTIMISED
   =========================== */
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  const COUNT = 45;
  const CONN  = 110;

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    r:  Math.random() * 1.4 + .6,
    a:  Math.random() * .3 + .07,
  }));

  let visible = true;
  const io = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0 });
  io.observe(canvas);

  let lastFrame = 0;
  const TARGET_INTERVAL = 1000 / 40;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (now - lastFrame < TARGET_INTERVAL) return;
    lastFrame = now;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < COUNT; i++) {
      const a = particles[i];
      for (let j = i + 1; j < COUNT; j++) {
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,92,252,${(1 - d / CONN) * .07})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,92,252,${p.a})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(frame);
}

/* ===========================
   TYPEWRITER
   =========================== */
function initTypewriter() {
  const el = document.getElementById('twText');
  if (!el) return;

  const phrases = [
    'I am a Cloud Engineer',
    'I am a DevOps Engineer',
    'I am a DevSecOps Specialist',
    'I deployed an E-commerce Web App',
    'I build CI/CD Pipelines',
    'I provision Azure Infrastructure',
    'I containerize with Docker & K8s',
    'I am an Azure Administrator',
  ];

  let pi = 0, ci = 0, del = false;

  function tick() {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { setTimeout(() => { del = true; tick(); }, 1800); return; }
      setTimeout(tick, 72);
    } else {
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 300); return; }
      setTimeout(tick, 36);
    }
  }
  setTimeout(tick, 600);
}

/* ===========================
   HERO ENTRANCE
   =========================== */
function initHeroEntrance() {
  const items = document.querySelectorAll(
    '.hero-badge,.hero-intro,.hero-tw-row,.hero-desc,.tech-pills,.hero-actions,.deploying-strip,.fast-access,.hero-right'
  );
  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(26px)';
    setTimeout(() => {
      el.style.transition = 'opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 70 + i * 100);
  });
}

/* ===========================
   NAV — SCROLL + ACTIVE SECTION
   =========================== */
(function () {
  const nav   = document.getElementById('nav');
  const navAs = document.querySelectorAll('.nav-a');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAs.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
})();

/* ===========================
   HAMBURGER MENU
   =========================== */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    btn.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });

  document.querySelectorAll('.mob-a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ===========================
   SMOOTH SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const h = document.querySelector('.nav')?.offsetHeight || 66;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - h, behavior: 'smooth' });
  });
});

/* ===========================
   SCROLL REVEAL
   =========================== */
function initScrollReveal() {
  const sels = [
    '.sec-eyebrow', '.sec-heading', '.sec-sub',
    '.about-text-col', '.about-cards-col', '.about-card', '.trait',
    '.flip-card-wrapper',
    '.cert-main', '.cert-list',
    '.proj-featured', '.proj-card',
    '.ach-card', '.ach-stats-bar', '.ach-skills-strip',
    '.contact-main', '.contact-side', '.proj-filters',
  ];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });

  sels.forEach((sel, gi) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${gi * .02 + i * .07}s`;
      obs.observe(el);
    });
  });
}

/* ===========================
   COUNTERS (achievements only)
   =========================== */
function initCounters() {
  function animate(el) {
    const target = parseInt(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const steps  = 50;
    const dur    = 1200;
    let cur      = 0;
    const step   = target / steps;
    const iv     = dur / steps;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur) + suffix;
    }, iv);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.asb-n[data-target]').forEach(el => obs.observe(el));
}

/* ===========================
   FLIP CARDS — KEYBOARD + TOUCH
   =========================== */
function initFlipCardKeyboard() {
  const style = document.createElement('style');
  style.textContent = `.flip-card-wrapper.touch-flipped .flip-card { transform: rotateY(180deg); }`;
  document.head.appendChild(style);

  document.querySelectorAll('.flip-card-wrapper').forEach(wrapper => {
    let flipped = false;

    wrapper.addEventListener('touchstart', e => {
      if (e.target.closest('a, button')) return;
      e.preventDefault();
      flipped = !flipped;
      wrapper.classList.toggle('touch-flipped', flipped);
    }, { passive: false });

    wrapper.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipped = !flipped;
        wrapper.classList.toggle('touch-flipped', flipped);
      }
    });
  });
}

/* ===========================
   CERTIFICATIONS
   =========================== */
(function () {
  const items = document.querySelectorAll('.cert-item');
  const main  = document.getElementById('certMain');
  if (!items.length || !main) return;

  items.forEach(item => item.addEventListener('click', () => {
    items.forEach(ci => ci.classList.remove('cert-active'));
    item.classList.add('cert-active');

    main.style.opacity    = '0';
    main.style.transform  = 'translateY(8px)';
    main.style.transition = 'opacity .22s, transform .22s';

    setTimeout(() => {
      main.querySelector('.cm-badge').innerHTML    = `<i class="${item.dataset.icon}"></i>`;
      main.querySelector('.cm-issuer').textContent = item.dataset.issuer;
      main.querySelector('.cm-title').textContent  = item.dataset.title;
      main.querySelector('.cm-desc').textContent   = item.dataset.desc;
      main.querySelector('.cm-tags').innerHTML = `
        <span><i class="fa-solid fa-tag"></i> ${item.dataset.code}</span>
        <span><i class="fa-solid fa-circle-check"></i> Certified</span>
      `;
      main.style.opacity   = '1';
      main.style.transform = 'translateY(0)';
    }, 200);
  }));
})();

/* ===========================
   PROJECT FILTERS
   =========================== */
(function () {
  const btns     = document.querySelectorAll('.pf-btn');
  const cards    = document.querySelectorAll('.proj-card');
  const featured = document.querySelector('.proj-featured');
  if (!btns.length) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('pf-active'));
    btn.classList.add('pf-active');
    const f = btn.dataset.filter;

    if (featured) {
      featured.style.display = (f === 'all' || f === 'cicd') ? '' : 'none';
    }

    cards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity   = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 260);
      }
    });
  }));
})();

/* ===========================
   PROJECT MODAL
   =========================== */
const projectData = [
  {
    num: '01',
    title: 'Zomato Web App — Azure DevOps CI/CD Pipeline',
    desc: 'Designed and deployed a production-style CI/CD pipeline on Azure DevOps for a Zomato-clone .NET web application. Automated the full delivery workflow from code commit to live deployment on Azure App Service using YAML-based multi-stage pipelines.',
    tech: ['Azure DevOps', 'YAML Pipelines', '.NET', 'Azure App Service', 'Azure Repos', 'GitHub'],
    link: 'https://github.com/Sivashankar9929/zomato.net.git',
  },
  {
    num: '02',
    title: 'Dockerized Java Web Application',
    desc: 'Containerized a Java/Tomcat web application using multi-stage Docker builds, reducing image size by ~60%. Includes Docker Compose for local orchestration and a clean repeatable CI flow with optimized layer caching.',
    tech: ['Docker', 'Java', 'Tomcat', 'Docker Compose', 'Multi-stage Builds'],
    link: 'https://github.com/Sivashankar9929/dockerized-java-webapp',
  },
  {
    num: '03',
    title: 'Terraform Infrastructure Automation',
    desc: 'Provisioned a complete Azure environment (VNet, subnets, NSGs, App Service, Storage) using modular Terraform. State managed in Azure Blob Storage with CI/CD-triggered plan and apply workflows including drift detection.',
    tech: ['Terraform', 'Azure ARM', 'Azure CLI', 'Remote State', 'Modules', 'Bicep'],
    link: 'https://github.com/Sivashankar9929/terraform-automation',
  },
  {
    num: '04',
    title: 'Azure App Service Deployment',
    desc: 'Deployed a production web application to Azure App Service with slot-based blue/green deployments, Application Insights telemetry, autoscale rules based on CPU and memory metrics, and a full Azure Pipelines release pipeline with approval gates.',
    tech: ['Azure App Service', 'Azure Pipelines', 'Application Insights', 'Deployment Slots', 'Autoscale'],
    link: 'https://github.com/Sivashankar9929/azure-appservice-deploy',
  },
  {
    num: '05',
    title: 'Kubernetes Sample Deployment',
    desc: 'Built complete Kubernetes manifests for a microservice deployment on AKS including Deployments, Services, ConfigMaps, Secrets, and HorizontalPodAutoscaler. Helm chart packaged for reusable environment-parameterized releases with rolling update strategy.',
    tech: ['Kubernetes', 'AKS', 'Helm', 'YAML', 'HPA', 'ConfigMaps', 'Secrets'],
    link: 'https://github.com/Sivashankar9929/kubernetes-sample-deployment',
  },
];

(function () {
  const modal = document.getElementById('modal');
  const bd    = document.getElementById('modalBd');
  const cls   = document.getElementById('modalClose');
  if (!modal) return;

  window.openModal = function (i) {
    const d = projectData[i];
    document.getElementById('mNum').textContent   = d.num;
    document.getElementById('mTitle').textContent = d.title;
    document.getElementById('mDesc').textContent  = d.desc;
    document.getElementById('mLink').href         = d.link;
    const te = document.getElementById('mTech');
    te.innerHTML = '';
    d.tech.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      te.appendChild(s);
    });
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cls.addEventListener('click', close);
  bd.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();

/* ===========================
   FLOATING ICONS
   =========================== */
document.querySelectorAll('.fi').forEach(icon => {
  icon.addEventListener('mouseenter', () => { icon.style.animationPlayState = 'paused'; });
  icon.addEventListener('mouseleave', () => { icon.style.animationPlayState = 'running'; });
});

/* ===========================
   PROFILE CARD 3D TILT
   =========================== */
(function () {
  const card = document.querySelector('.profile-card');
  const wrap = document.querySelector('.profile-card-wrap');
  if (!card || !wrap) return;

  let rafId = null;
  let mx = 0, my = 0;

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width  - .5;
    my = (e.clientY - r.top)  / r.height - .5;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      card.style.transform = `translate(-50%,-50%) perspective(600px) rotateY(${mx * 9}deg) rotateX(${-my * 9}deg)`;
      rafId = null;
    });
  }, { passive: true });

  wrap.addEventListener('mouseleave', () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    card.style.transform  = 'translate(-50%,-50%)';
  });

  wrap.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .15s ease-out';
  });
})();

/* ===========================
   FOOTER YEAR
   =========================== */
const fyEl = document.getElementById('footerYear');
if (fyEl) fyEl.textContent = '\u00a9 ' + new Date().getFullYear() + ' Katta Siva Shankar \u00b7 All Rights Reserved';