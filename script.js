'use strict';

/* ===========================
   BOOT GUARD
   =========================== */
let booted = false;
function safeBoot() {
  if (booted) return;
  booted = true;
  boot();
}
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(safeBoot, 4000);
});

/* ===========================
   LOADER — centered name, status
   + progress bar bottom-left
   =========================== */
(function () {
  const loaderEl = document.getElementById('loader');
  const fillEl   = document.getElementById('loaderFill');
  const pctEl    = document.getElementById('loaderPct');

  if (!loaderEl || !fillEl || !pctEl) {
    if (loaderEl) loaderEl.style.display = 'none';
    safeBoot();
    return;
  }

  let pct = 0;
  const TOTAL_MS = 2200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / TOTAL_MS, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out, feels less robotic than linear
    pct = Math.round(eased * 100);

    fillEl.style.width = pct + '%';
    pctEl.textContent = pct + '%';

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(hide, 380);
    }
  }

  function hide() {
    loaderEl.classList.add('hidden');
    setTimeout(() => {
      loaderEl.style.display = 'none';
      safeBoot();
    }, 620);
  }

  requestAnimationFrame(tick);
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
  initProjectNavRail();
  initArchCanvasReveal();
}

function downloadResume(event, fileUrl) {
  if (event) event.preventDefault();

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileUrl.split('/').pop();
  link.target = '_self';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    '.hero-badge,.hero-intro,.hero-tw-row,.hero-desc,.tech-pills,.hero-actions,.deploying-strip,.fast-access,.intro-right'
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
   PROJECT NAV RAIL
   Builds the 01–10 quick-jump buttons for both the desktop vertical dock
   and the mobile horizontal strip from the actual .proj-featured cards on
   the page, so the list never drifts out of sync with the markup.
   =========================== */
function initProjectNavRail() {
  const section = document.getElementById('projects');
  const cards = document.querySelectorAll('#projects .proj-featured');
  const desktopRail = document.getElementById('pnavDesktop');
  const mobileRail = document.getElementById('pnavMobile');
  if (!section || !cards.length || !desktopRail || !mobileRail) return;

  cards.forEach((card, i) => {
    const num = String(i + 1).padStart(2, '0');
    [desktopRail, mobileRail].forEach(rail => {
      const btn = document.createElement('button');
      btn.className = 'pnav-dot';
      btn.type = 'button';
      btn.textContent = num;
      btn.setAttribute('aria-label', `Jump to project ${num}`);
      btn.addEventListener('click', () => {
        const h = document.querySelector('.nav')?.offsetHeight || 66;
        window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - h - 16, behavior: 'smooth' });
      });
      rail.appendChild(btn);
    });
  });

  const setActive = (index) => {
    [desktopRail, mobileRail].forEach(rail => {
      rail.querySelectorAll('.pnav-dot').forEach((btn, i) => {
        btn.classList.toggle('pnav-active', i === index);
      });
    });
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(Array.from(cards).indexOf(entry.target));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  cards.forEach(card => cardObserver.observe(card));

  // Only show the fixed desktop rail while the Projects section itself is on screen.
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      desktopRail.classList.toggle('pnav-visible', entry.isIntersecting);
    });
  }, { threshold: 0.05 });
  sectionObserver.observe(section);
}

/* ===========================
   ARCHITECTURE CANVAS REVEAL
   Adds .ac-visible to each .ac-tree the first time it scrolls into view,
   which triggers the staggered node/connector/branch-line animations
   defined in CSS (transition-delay driven by each element's --i).
   =========================== */
function initArchCanvasReveal() {
  const trees = document.querySelectorAll('.ac-tree');
  if (!trees.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('ac-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: .2, rootMargin: '0px 0px -60px 0px' });

  trees.forEach(tree => obs.observe(tree));
}


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

  document.querySelectorAll('#home, #about, section[id]').forEach(s => obs.observe(s));
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
    '.about-text', '.about-summary', '.about-side', '.about-card', '.trait',
    '.ah-title', '.ah-intro', '.ah-item', '.ah-stat',
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
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.proj-featured, .proj-card');
  if (!btns.length) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('pf-active'));
    btn.classList.add('pf-active');
    const f = btn.dataset.filter;

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
   ===========================
   NOTE ON THE FIX: project 0's public-facing title on the card
   ("E-commerce Web Application Deployment") previously did not
   match the title shown inside the Architecture modal ("Zomato
   Web App..."). They're now kept in sync below, and each project
   has its own "arch" text instead of one static paragraph that
   never changed between projects.

   VIDEO SUPPORT: add a `video` path per project (mp4/webm) once
   you have a screen-recording for that deployment. Drop the file
   next to index.html (e.g. /assets/videos/ecommerce-demo.mp4) and
   set the `video` field below — the "Watch Demo" button + modal
   video tab will pick it up automatically. Leave `video: null`
   until you have one; the modal shows a clean "coming soon" state.
   =========================== */
const projectData = [
  {
    num: '01',
    title: 'E-commerce Web App — Azure DevOps CI/CD Pipeline',
    desc: 'Designed and deployed a production-style CI/CD pipeline on Azure DevOps for a .NET e-commerce web application. Automated the full delivery workflow from code commit to live deployment on Azure App Service using YAML-based multi-stage pipelines.',
    tech: ['Azure DevOps', 'YAML Pipelines', '.NET', 'Azure App Service', 'Azure Repos', 'GitHub'],
    arch: 'Multi-stage pipeline design across Build, Test, and Deploy — enforcing clean separation of environments and automated promotion on every commit, with zero manual steps from commit to live App Service deployment.',
    link: 'https://github.com/Sivashankar9929/zomato.net.git',
    video: null, // e.g. 'assets/videos/ecommerce-demo.mp4'
  },
  {
    num: '02',
    title: 'Dockerized Java Web Application',
    desc: 'Containerized a Java/Tomcat web application using multi-stage Docker builds, reducing image size by ~60%. Includes Docker Compose for local orchestration and a clean repeatable CI flow with optimized layer caching.',
    tech: ['Docker', 'Java', 'Tomcat', 'Docker Compose', 'Multi-stage Builds'],
    arch: 'Multi-stage Dockerfile separates the build environment from the runtime image, stripping build tools and caches from the final layer — the main driver of the ~60% image size reduction.',
    link: 'https://github.com/Sivashankar9929/dockerized-java-webapp',
    video: null, // e.g. 'assets/videos/docker-java-demo.mp4'
  },
  {
    num: '03',
    title: 'Terraform Infrastructure Automation',
    desc: 'Provisioned a complete Azure environment (VNet, subnets, NSGs, App Service, Storage) using modular Terraform. State managed in Azure Blob Storage with CI/CD-triggered plan and apply workflows including drift detection.',
    tech: ['Terraform', 'Azure ARM', 'Azure CLI', 'Remote State', 'Modules', 'Bicep'],
    arch: 'Modular Terraform structure with remote state in Azure Blob Storage for team-safe locking, plus a scheduled `terraform plan` step in the pipeline that flags configuration drift before it reaches production.',
    link: 'https://github.com/Sivashankar9929/terraform-automation',
    video: null, // e.g. 'assets/videos/terraform-demo.mp4'
  },
  {
    num: '04',
    title: 'Azure App Service Deployment',
    desc: 'Deployed a production web application to Azure App Service with slot-based blue/green deployments, Application Insights telemetry, autoscale rules based on CPU and memory metrics, and a full Azure Pipelines release pipeline with approval gates.',
    tech: ['Azure App Service', 'Azure Pipelines', 'Application Insights', 'Deployment Slots', 'Autoscale'],
    arch: 'Blue/green release via deployment slots means traffic only swaps to the new slot after health checks pass — giving zero-downtime releases with an instant rollback path if Application Insights flags a regression.',
    link: 'https://github.com/Sivashankar9929/azure-appservice-deploy',
    video: null, // e.g. 'assets/videos/appservice-demo.mp4'
  },
  {
    num: '05',
    title: 'Kubernetes Sample Deployment',
    desc: 'Built complete Kubernetes manifests for a microservice deployment on AKS including Deployments, Services, ConfigMaps, Secrets, and HorizontalPodAutoscaler. Helm chart packaged for reusable environment-parameterized releases with rolling update strategy.',
    tech: ['Kubernetes', 'AKS', 'Helm', 'YAML', 'HPA', 'ConfigMaps', 'Secrets'],
    arch: 'Helm-packaged manifests keep environment values (replica counts, resource limits, secrets refs) separate from the deployment logic, while the HPA watches CPU utilization to scale pods automatically under load.',
    link: 'https://github.com/Sivashankar9929/kubernetes-sample-deployment',
    video: null, // e.g. 'assets/videos/k8s-demo.mp4'
  },
  {
    num: '02',
    title: 'Azure Infrastructure Automation Using ARM Templates',
    desc: 'Designed and automated the deployment of a Linux-based web server on Azure using ARM Templates. Provisioned VNet, Subnet, NSG, Public IP, NIC, and Ubuntu VM, with NGINX installation and custom web page configuration during deployment.',
    tech: ['Azure', 'ARM Templates', 'JSON', 'Ubuntu', 'NGINX', 'VNet', 'NSG', 'NIC'],
    arch: 'ARM Template-based infrastructure provisioning using Azure Portal Deploy a Custom Template service, delivering a repeatable, standardized deployment workflow for networking, VM provisioning, security, and web hosting.',
    link: 'https://github.com/Sivashankar9929/azure-arm-automation',
    video: null,
  },
  {
    num: '03',
    title: 'Personal Portfolio Website Hosted Using Azure Storage Account',
    desc: 'Designed and deployed a responsive portfolio website with HTML, CSS, and JavaScript. Hosted it as a static website on Azure Storage Account by enabling Static Website hosting, uploading assets, and using the Azure-generated endpoint.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Azure', 'Azure Storage', 'Static Website Hosting', 'VS Code'],
    arch: 'Static website hosting on Azure Storage with Blob storage-backed website files, index/error document configuration, and public endpoint delivery for a responsive portfolio experience.',
    link: 'https://github.com/Sivashankar9929/azure-static-portfolio',
    video: null,
  },
  {
    num: '04',
    title: 'Microsoft Azure Manual Infrastructure Deployment for Two-Tier Web Applications',
    desc: 'Designed and deployed a secure two-tier Azure architecture for Electro GO EV Charging Station Management through manual Azure resource provisioning. Configured VNet, public/private subnets, route tables, NSGs, NAT Gateway, Azure Load Balancer, Ubuntu VM, and private Azure Database for MySQL Flexible Server connectivity.',
    tech: ['Azure', 'ASP.NET Core 8', 'Ubuntu 22.04', 'Azure VM', 'MySQL Flexible Server', 'VNet', 'NSG', 'NAT Gateway', 'Load Balancer', 'RBAC'],
    arch: 'Manual Azure infrastructure deployment with private connectivity between the VM and MySQL Flexible Server, secure managed identity access, RBAC controls, and load-balanced two-tier application availability validation.',
    link: 'https://github.com/Sivashankar9929/azure-manual-two-tier',
    video: null,
  },
  {
    num: '05',
    title: 'Azure Infrastructure Automation for Two-Tier Web Application Deployment',
    desc: 'Designed and implemented a modular Terraform IaC solution for ElectroGO ASP.NET Core deployment on Azure. Provisioned networking, compute, database, and load balancer resources through reusable modules, and used a bootstrap script to install .NET 8, Nginx, and application dependencies on Linux VM.',
    tech: ['Azure', 'Terraform', 'ASP.NET Core 8', 'Ubuntu', 'Azure DB for MySQL', 'Azure Load Balancer', 'Blob Backend', 'NGINX', 'Bash'],
    arch: 'Reusable Terraform modules provision the two-tier Azure architecture with remote state in Azure Blob Storage, dynamic database endpoint injection, and automated VM bootstrap for app deployment and load-balanced availability.',
    link: 'https://github.com/Sivashankar9929/azure-terraform-two-tier',
    video: null,
  },
  {
    num: '06',
    title: 'End-to-End CI/CD Pipeline Automation with Azure DevOps & Terraform',
    desc: 'Designed and implemented an end-to-end CI/CD pipeline for the ElectroGo EV Charging station using Azure DevOps Classic Pipelines. Automated build, test, Terraform provisioning, and deployment of an ASP.NET Core application to Azure VMs.',
    tech: ['Azure', 'Azure DevOps', 'Terraform', 'ASP.NET Core', 'MySQL', 'Ubuntu', 'NGINX', 'Git'],
    arch: 'Azure DevOps Classic Pipelines integrate source, build validation, Terraform IaC provisioning, and VM deployment for a production-ready end-to-end release workflow that removes manual deployment steps.',
    link: 'https://github.com/Sivashankar9929/azure-devops-terraform-cicd',
    video: null,
  },
  {
    num: '07',
    title: 'Docker Containerization & Two-Tier Application Deployment on Microsoft Azure',
    desc: 'Containerized the ElectroGo EV Charging Platform using Docker and deployed it as a two-tier application on an Azure Ubuntu VM. Built multi-stage Docker images, pushed them to Azure Container Registry, used Managed Identity, and deployed the application with Docker Compose.',
    tech: ['Azure', 'Ubuntu', 'Docker', 'Docker Compose', 'ACR', 'Managed Identity', 'ASP.NET Core', 'MySQL', 'Azure CLI'],
    arch: 'Secure Docker-based deployment with multi-stage image builds, Azure Container Registry storage, Managed Identity authentication, and Docker Compose orchestration for a repeatable two-tier application workflow.',
    link: 'https://github.com/Sivashankar9929/azure-docker-two-tier',
    video: null,
  },
  {
    num: '08',
    title: 'Cloud Infrastructure Automation & AKS Deployment on Microsoft Azure',
    desc: 'Designed and deployed production-ready infrastructure for the ElectroGo EV Charging Platform using Terraform and Azure Kubernetes Service. Containerized the application, managed secrets with Azure Key Vault, deployed workloads with Helm, and automated delivery through Azure DevOps CI/CD.',
    tech: ['Azure', 'Terraform', 'AKS', 'Docker', 'ACR', 'Key Vault', 'Helm', 'Azure DevOps', 'NGINX Ingress'],
    arch: 'Terraform provisions the Azure infrastructure and AKS cluster, Azure Key Vault secures secrets, and Helm deploys containerized workloads with CI/CD automation for scalable application delivery.',
    link: 'https://github.com/Sivashankar9929/azure-aks-automation',
    video: null,
  },
  {
    num: '09',
    title: 'Enterprise Security Hardening for Azure Kubernetes Service (AKS)',
    desc: 'Implemented enterprise-grade security for the ElectroGo platform on AKS by securing identities, workloads, network traffic, and application secrets. Integrated Azure Front Door, WAF, Azure Key Vault, Azure RBAC, Microsoft Entra ID, Defender for Containers, Kubernetes Network Policies, and automated DevSecOps validation within Azure DevOps CI/CD pipelines.',
    tech: ['Azure', 'AKS', 'Terraform', 'Azure DevOps', 'Azure Front Door', 'WAF', 'Key Vault', 'Azure RBAC', 'Entra ID', 'Defender for Containers'],
    arch: 'Defense-in-depth AKS hardening from infrastructure provisioning to identity, secrets, network protection, and automated security validation — delivering a secure deployment pipeline with Azure Front Door/WAF, Key Vault, RBAC, and Kubernetes network policies.',
    link: 'https://github.com/Sivashankar9929/azure-aks-security-hardening',
    video: null,
  },
  {
    num: '10',
    title: 'Cloud Monitoring & Observability Platform for Azure Kubernetes Service',
    desc: 'Built a comprehensive monitoring and observability solution for the ElectroGo platform running on AKS. Integrated Azure Monitor, Log Analytics, Container Insights, Application Insights, Prometheus, Grafana, and Azure Monitor Alerts to provide real-time visibility into application performance, Kubernetes resources, infrastructure health, centralized logging, and proactive incident detection.',
    tech: ['Azure', 'AKS', 'Terraform', 'Azure Monitor', 'Application Insights', 'Log Analytics', 'Container Insights', 'Prometheus', 'Grafana', 'Azure Monitor Alerts'],
    arch: 'Observation-driven AKS operations that collect telemetry from applications and infrastructure, centralize logs and metrics in Azure Monitor and Log Analytics, visualize data in Grafana, and trigger proactive incident alerts using Azure Monitor Alerts and Action Groups.',
    link: 'https://github.com/Sivashankar9929/azure-aks-observability',
    video: null,
  },
  {
    num: '11',
    title: '3-Tier Banking Web Application on AWS',
    desc: 'Built and manually deployed a secure 3-tier banking web application on AWS using a separated Web, Application, and Database architecture. Configured Amazon VPC, public and private subnets, Application Load Balancer, EC2, NGINX, Flask/Gunicorn, Amazon RDS MySQL, Security Groups, and Bastion Host access to provide secure and controlled communication between application tiers.',
    tech: ['AWS', 'EC2', 'VPC', 'Application Load Balancer', 'NGINX', 'Python', 'Flask', 'Gunicorn', 'Amazon RDS MySQL', 'Linux', 'Security Groups', 'Git/GitHub'],
    arch: 'Implemented a secure 3-tier AWS architecture where internet traffic is received through an Application Load Balancer and forwarded to the NGINX Web Tier. NGINX acts as a reverse proxy and forwards dynamic requests to the Flask Application Tier running with Gunicorn. The Application Tier communicates with Amazon RDS MySQL in private subnets, while Security Groups and a Bastion Host provide controlled network access and secure server administration.',
    link: 'https://github.com/Sivashankar9929',
    video: null,
  },
];

(function () {
  const modal = document.getElementById('modal');
  const bd    = document.getElementById('modalBd');
  const cls   = document.getElementById('modalClose');
  if (!modal) return;

  window.openModal = function (i, openVideo) {
    const d = projectData[i];
    document.getElementById('mNum').textContent   = d.num;
    document.getElementById('mTitle').textContent = d.title;
    document.getElementById('mDesc').textContent  = d.desc;
    document.getElementById('mArch').textContent  = d.arch;
    document.getElementById('mLink').href         = d.link;

    const te = document.getElementById('mTech');
    te.innerHTML = '';
    d.tech.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      te.appendChild(s);
    });

    const videoWrap = document.getElementById('mVideoWrap');
    videoWrap.innerHTML = '';
    if (d.video) {
      const v = document.createElement('video');
      v.src = d.video;
      v.controls = true;
      v.playsInline = true;
      v.preload = 'metadata';
      videoWrap.appendChild(v);
    } else {
      videoWrap.innerHTML = `
        <div class="modal-video-empty">
          <i class="fa-solid fa-clapperboard"></i>
          <strong>Demo video coming soon</strong>
          <span>A short walkthrough of this deployment is on the way. Check back shortly, or view the architecture and source in the meantime.</span>
        </div>`;
    }

    showModalTab(openVideo ? 'video' : 'overview');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Helper: open modal by project `num` (allows stable linking even if projectData order changes)
  window.openModalByNum = function (num, openVideo) {
    const needle = typeof num === 'number' ? String(num).padStart(2, '0') : String(num);
    const idx = projectData.findIndex(p => p.num === needle || p.num === String(Number(needle)));
    if (idx === -1) return console.warn('Project not found:', num);
    openModal(idx, openVideo);
  };

  window.showModalTab = function (which) {
    const tabOverview = document.getElementById('tabOverview');
    const tabVideo     = document.getElementById('tabVideo');
    const paneOverview = document.getElementById('paneOverview');
    const paneVideo     = document.getElementById('paneVideo');
    const isVideo = which === 'video';

    tabOverview.classList.toggle('modal-tab-active', !isVideo);
    tabVideo.classList.toggle('modal-tab-active', isVideo);
    paneOverview.classList.toggle('modal-pane-hidden', isVideo);
    paneVideo.classList.toggle('modal-pane-hidden', !isVideo);

    if (!isVideo) {
      const v = document.querySelector('#mVideoWrap video');
      if (v) v.pause();
    }
  };

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const v = document.querySelector('#mVideoWrap video');
    if (v) v.pause();
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
