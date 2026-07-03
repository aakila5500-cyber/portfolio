document.documentElement.classList.add('js');

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

function setHeaderState() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
}

function setActiveNav() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.28;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
  });
}

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

function updateFilterButtons(activeButton) {
  filterButtons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
}

function onFilterClick(event) {
  const button = event.target.closest('.filter-btn');
  if (!button) return;

  filterProjects(button.dataset.filter);
  updateFilterButtons(button);
}

function validateContactForm() {
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formFeedback.textContent = 'Please fill in all fields before sending.';
    return null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formFeedback.textContent = 'Please use a valid email address.';
    return null;
  }

  return { name, email, message };
}

function handleContactSubmit(event) {
  event.preventDefault();

  const formData = validateContactForm();
  if (!formData) return;

  const subject = encodeURIComponent(`Portfolio enquiry from ${formData.name}`);
  const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`);
  const mailtoUrl = `mailto:aakila5500@gmail.com?subject=${subject}&body=${body}`;
  const submitButton = contactForm.querySelector('button[type="submit"]');

  formFeedback.textContent = 'Opening your email app with the message prepared.';
  submitButton.disabled = true;
  window.location.href = mailtoUrl;

  setTimeout(() => {
    submitButton.disabled = false;
    contactForm.reset();
  }, 1200);
}

function addScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-block, .project-card, .achievement-card, .skill-group, .about-panel, .timeline-item, .contact-form'
  );

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function initialize() {
  setHeaderState();
  setActiveNav();
  addScrollReveal();

  window.addEventListener('scroll', () => {
    setHeaderState();
    setActiveNav();
  });

  menuToggle.addEventListener('click', toggleNavigation);
  mainNav.addEventListener('click', handleSmoothNav);
  document.querySelector('.brand').addEventListener('click', handleSmoothNav);
  document.querySelector('.project-filters').addEventListener('click', onFilterClick);
  contactForm.addEventListener('submit', handleContactSubmit);
  window.addEventListener('resize', closeNavigation);
}

window.addEventListener('DOMContentLoaded', initialize);
