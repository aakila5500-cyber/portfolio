document.documentElement.classList.add('js');

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const heroKicker = document.getElementById('heroKicker');

/* God Mode Elements */
const pageLoader = document.getElementById('pageLoader');
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const scrollProgress = document.getElementById('scrollProgress');
const particleCanvas = document.getElementById('particleCanvas');
const timelineElement = document.getElementById('timelineElement');
const counters = document.querySelectorAll('.counter');
const tiltCards = document.querySelectorAll('.tilt-card');

/* ============================================================
   PAGE LOADER
   ============================================================ */
window.addEventListener('load', () => {
  if (pageLoader) {
    // Add a slight delay for dramatic effect
    setTimeout(() => {
      pageLoader.classList.add('loaded');
    }, 600);
  }
});

/* ============================================================
   SMOOTH CUSTOM CURSOR (Lerped)
   ============================================================ */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = window.innerWidth / 2;
let ringY = window.innerHeight / 2;
let isHovering = false;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (cursorDot) {
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }
});

// Lerp loop for the outer ring for smooth following
function renderCursorRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  
  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
  }
  
  requestAnimationFrame(renderCursorRing);
}
renderCursorRing();

// Hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .filter-btn, input, textarea');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    if (cursorRing) cursorRing.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
    if (cursorRing) cursorRing.classList.remove('hovering');
  });
});

/* ============================================================
   PARTICLE BACKGROUND EFFECT (Canvas)
   ============================================================ */
function initParticles() {
  if (!particleCanvas) return;
  
  const ctx = particleCanvas.getContext('2d');
  let width = particleCanvas.width = window.innerWidth;
  let height = particleCanvas.height = window.innerHeight;
  let particles = [];
  
  window.addEventListener('resize', () => {
    width = particleCanvas.width = window.innerWidth;
    height = particleCanvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      
      // React to mouse slightly
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108, 99, 255, 0.4)';
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(window.innerWidth / 15, 80); // Responsive count
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 - (dist/120) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  // Only start animation if reduced motion is not requested
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateParticles();
  }
}

/* ============================================================
   3D TILT EFFECT FOR CARDS
   ============================================================ */
function addTiltEffect() {
  if (window.matchMedia('(hover: none)').matches) return; // Skip on touch devices
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
function addButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
const typewriterPhrases = [
  'Web Developer',
  'AI Enthusiast',
  'Problem Solver',
  'Creative Thinker',
  'Code Crafter',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout = null;

function typewrite() {
  if (!heroKicker) return;
  
  const currentPhrase = typewriterPhrases[phraseIndex];
  const cursor = '<span class="typewriter-cursor"></span>';

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  heroKicker.innerHTML = currentPhrase.substring(0, charIndex) + cursor;

  let delay = isDeleting ? 30 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2500; // pause before deleting
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    delay = 400; // pause before typing next
  }

  typewriterTimeout = setTimeout(typewrite, delay);
}

/* ============================================================
   ANIMATED NUMBER COUNTERS
   ============================================================ */
function runCounter(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const duration = 2000;
  const isDecimal = target % 1 !== 0;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    
    // Ease out quart
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    
    const current = easeProgress * target;
    
    if (isDecimal) {
      element.innerText = current.toFixed(2);
    } else {
      element.innerText = Math.floor(current);
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.innerText = isDecimal ? target.toFixed(2) : target;
    }
  }
  
  window.requestAnimationFrame(step);
}

/* ============================================================
   SCROLL REVEAL (Intersection Observer Enhanced)
   ============================================================ */
function addScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-block, .project-card, .achievement-card, .skill-group, .about-panel, .timeline-item, .contact-form, .section-head h2, .counter'
  );

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => {
      element.classList.add('visible');
      if (element.classList.contains('counter')) element.innerText = element.getAttribute('data-target');
      if (element.tagName === 'H2') element.classList.add('text-revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          if (el.classList.contains('counter')) {
            runCounter(el);
          } else if (el.tagName === 'H2') {
            el.classList.add('text-revealed');
          } else {
            el.classList.add('visible');
          }
          
          // Trigger timeline draw when education section is reached
          if (el.id === 'education' && timelineElement) {
            timelineElement.classList.add('line-drawn');
          }
          
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

/* ============================================================
   SCROLL EVENT HANDLERS
   ============================================================ */
function handleScroll() {
  // Header state
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
  
  // Scroll to top button
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  
  // Scroll progress bar
  if (scrollProgress) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
  }

  // Active Navigation
  const scrollPosition = window.scrollY + window.innerHeight * 0.3;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    if (currentSection) {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
    }
  });
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function closeNavigation() {
  siteHeader.classList.remove('nav-active');
  document.body.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

function toggleNavigation() {
  const isOpen = siteHeader.classList.toggle('nav-active');
  document.body.classList.toggle('nav-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

function handleSmoothNav(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  const section = document.getElementById(targetId);
  if (!section) return;

  event.preventDefault();
  closeNavigation();
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   PROJECT FILTERS
   ============================================================ */
function filterProjects(filter) {
  projectCards.forEach((card) => {
    const shouldShow = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !shouldShow);

    if (shouldShow) {
      requestAnimationFrame(() => {
        card.classList.add('visible');
      });
    }
  });
}

function onFilterClick(event) {
  const button = event.target.closest('.filter-btn');
  if (!button) return;

  filterProjects(button.dataset.filter);
  
  filterButtons.forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function handleContactSubmit(event) {
  event.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formFeedback.textContent = 'Please fill in all fields before sending.';
    formFeedback.className = 'form-feedback';
    return;
  }

  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  const submitButton = contactForm.querySelector('button[type="submit"]');

  formFeedback.textContent = 'Opening your email app...';
  formFeedback.className = 'form-feedback success';
  submitButton.disabled = true;
  
  window.location.href = `mailto:aakila5500@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    submitButton.disabled = false;
    contactForm.reset();
    setTimeout(() => { formFeedback.textContent = ''; }, 3000);
  }, 1500);
}

/* ============================================================
   CURSOR GLOW ON PROJECT CARDS
   ============================================================ */
function addCardGlowEffect() {
  projectCards.forEach((card) => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(108, 99, 255, 0.15), transparent 50%)`;
    });

    card.addEventListener('mouseleave', () => {
      glow.style.background = 'transparent';
    });
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   THROTTLE UTILITY
   ============================================================ */
function throttle(fn, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/* ============================================================
   INITIALIZE
   ============================================================ */
function initialize() {
  // Initialize visuals
  initParticles();
  addScrollReveal();
  addCardGlowEffect();
  addTiltEffect();
  addButtonRipple();
  
  // Set initial scroll state
  handleScroll();

  // Start typewriter
  if (heroKicker) {
    setTimeout(typewrite, 1200); // Wait for page loader
  }

  // Scroll events (throttled)
  window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

  // Event listeners
  menuToggle.addEventListener('click', toggleNavigation);
  mainNav.addEventListener('click', handleSmoothNav);
  document.querySelector('.brand').addEventListener('click', handleSmoothNav);
  document.querySelector('.project-filters').addEventListener('click', onFilterClick);
  contactForm.addEventListener('submit', handleContactSubmit);
  scrollTopBtn.addEventListener('click', scrollToTop);
  window.addEventListener('resize', closeNavigation);
}

window.addEventListener('DOMContentLoaded', initialize);
