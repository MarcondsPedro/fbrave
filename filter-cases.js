document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('[data-filter-item="all"], [data-filter-item="tag"]');
  const cmsItems = document.querySelectorAll('[data-filter-list="list"] .w-dyn-item');

  if (!filterButtons.length || !cmsItems.length) return;

  const getFilterValue = (btn) => {
    const inner = btn.querySelector('.projects_filter-item');
    if (!inner) return '';
    return inner.textContent.trim().toLowerCase();
  };

  const isAllButton = (btn) => btn.getAttribute('data-filter-item') === 'all';

  const setActive = (activeBtn) => {
    filterButtons.forEach(btn => {
      const inner = btn.querySelector('.projects_filter-item');
      if (inner) inner.classList.remove('is-active');
    });
    const activeInner = activeBtn.querySelector('.projects_filter-item');
    if (activeInner) activeInner.classList.add('is-active');
  };

  const filterProjects = (activeBtn) => {
    setActive(activeBtn);

    if (isAllButton(activeBtn)) {
      cmsItems.forEach(item => {
        gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', display: 'block' });
      });
      return;
    }

    const selectedTag = getFilterValue(activeBtn);

    cmsItems.forEach(item => {
      const tags = item.querySelectorAll('[data-filter-item="tag"]');
      const tagTexts = Array.from(tags).map(t => t.textContent.trim().toLowerCase());
      const hasMatch = tagTexts.includes(selectedTag);

      if (hasMatch) {
        gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', display: 'block' });
      } else {
        gsap.to(item, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in', onComplete: () => {
          gsap.set(item, { display: 'none' });
        }});
      }
    });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => filterProjects(btn));
  });

});
