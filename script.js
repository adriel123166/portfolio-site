document.documentElement.classList.add('js');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const archiveProjects = [...document.querySelectorAll('.archive-project')];
const filterStatus = document.getElementById('filter-status');
for (const button of filterButtons) {
  button.addEventListener('click', () => {
    let count = 0;
    for (const project of archiveProjects) {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    }
    for (const candidate of filterButtons) candidate.setAttribute('aria-pressed', String(candidate === button));
    filterStatus.textContent = `${count} additional projects shown.`;
  });
}
// Track the section nearest the reading position, including short sections.
const navigationLinks = [...document.querySelectorAll('nav a')];
const sections = navigationLinks.map(link => document.querySelector(link.hash));
let navigationFrame;
function updateNavigation() {
  navigationFrame = undefined;
  const readingLine = window.innerHeight * .3;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) active = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = sections.at(-1);
  for (const link of navigationLinks) {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function requestNavigationUpdate() {
  if (navigationFrame === undefined) navigationFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('resize', requestNavigationUpdate);
window.addEventListener('hashchange', requestNavigationUpdate);
document.addEventListener('toggle', requestNavigationUpdate, true);
updateNavigation();
// A subtle spotlight for desktop pointers; respect reduced-motion preferences.
const pointerEnabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let pointerFrame;
let pointerX = 0;
let pointerY = 0;
window.addEventListener('pointermove', event => {
  if (!pointerEnabled.matches || motionPaused || reducedMotion.matches) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (pointerFrame !== undefined) return;
  pointerFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
    pointerFrame = undefined;
  });
}, { passive: true });

// Progressive motion: content is visible by default, including without JavaScript.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
let motionPaused = false;
const revealItems = [...document.querySelectorAll('.experience-card, .project-feature, .archive-project, .education-card, .credential-list article, .contact-section')];
for (const item of revealItems) item.dataset.reveal = '';
let revealObserver;
let introStarted = false;
function syncMotion() {
  revealObserver?.disconnect();
  const enabled = !reducedMotion.matches && !motionPaused && 'IntersectionObserver' in window;
  document.documentElement.classList.toggle('motion-ready', enabled);
  document.documentElement.classList.toggle('motion-paused', !enabled);
  motionToggle.hidden = reducedMotion.matches || !('IntersectionObserver' in window);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
  if (!enabled) {
    for (const item of revealItems) item.classList.add('is-visible');
    return;
  }
  if (!introStarted) {
    introStarted = true;
    document.documentElement.classList.add('intro-motion');
    requestAnimationFrame(() => {
      const introduction = document.getAnimations().filter(animation => animation.animationName === 'introduction-enter');
      Promise.allSettled(introduction.map(animation => animation.finished)).then(() => {
        document.documentElement.classList.remove('intro-motion');
      });
    });
  }
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: .05, rootMargin: '0px 0px -20px 0px' });
  for (const item of revealItems) {
    if (!item.classList.contains('is-visible')) revealObserver.observe(item);
  }
}
// Keyboard navigation should reveal its destination immediately.
document.addEventListener('focusin', event => {
  const item = event.target.closest('[data-reveal]');
  if (item) item.classList.add('is-visible');
});
reducedMotion.addEventListener('change', syncMotion);
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncMotion();
});
syncMotion();

// Keep hover depth local to the small illustrations so text stays still.
for (const thumbnail of document.querySelectorAll('.project-thumb')) {
  let frame;
  let tiltX = 0;
  let tiltY = 0;
  function paintTilt() {
    thumbnail.style.setProperty('--tilt-x', `${tiltX}deg`);
    thumbnail.style.setProperty('--tilt-y', `${tiltY}deg`);
    frame = undefined;
  }
  thumbnail.addEventListener('pointermove', event => {
    if (!pointerEnabled.matches || motionPaused || reducedMotion.matches) return;
    const box = thumbnail.getBoundingClientRect();
    tiltX = (0.5 - (event.clientY - box.top) / box.height) * 8;
    tiltY = ((event.clientX - box.left) / box.width - 0.5) * 8;
    if (frame === undefined) frame = requestAnimationFrame(paintTilt);
  }, { passive: true });
  thumbnail.addEventListener('pointerleave', () => {
    tiltX = 0;
    tiltY = 0;
    if (frame === undefined) frame = requestAnimationFrame(paintTilt);
  });
}
