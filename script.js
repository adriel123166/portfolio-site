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
  if (!pointerEnabled.matches) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (pointerFrame !== undefined) return;
  pointerFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
    pointerFrame = undefined;
  });
}, { passive: true });
