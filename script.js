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
// All content and disclosures remain accessible without JavaScript.
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  for (const link of links) {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  }
}
