document.addEventListener('DOMContentLoaded', () => {

  const filterWrapper = document.querySelector('.projects_filter-list');
  const cmsList = document.querySelector('[data-filter-item="list"]');

  if (!filterWrapper || !cmsList) return;

  const filterButtons = filterWrapper.querySelectorAll('[data-filter-item]');
  const cmsItems = cmsList.querySelectorAll('.w-dyn-item');

  if (!filterButtons.length || !cmsItems.length) return;

  const getButtonText = (btn) => {
    const inner = btn.querySelector('.projects_filter-item');
    return inner ? inner.textContent.trim().toLowerCase() : '';
  };

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

    const isAll = activeBtn.getAttribute('data-filter-item') === 'all';

    if (isAll) {
      cmsItems.forEach(item => {
        gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out',
          onStart: () => gsap.set(item, { display: '' })
        });
      });
      return;
    }

    const selectedTag = getButtonText(activeBtn);

    cmsItems.forEach(item => {
      const tags = item.querySelectorAll('[data-filter-item="tag"]');
      const tagTexts = Array.from(tags).map(t => t.textContent.trim().toLowerCase());
      const hasMatch = tagTexts.includes(selectedTag);

      if (hasMatch) {
        gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out',
          onStart: () => gsap.set(item, { display: '' })
        });
      } else {
        gsap.to(item, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in',
          onComplete: () => gsap.set(item, { display: 'none' })
        });
      }
    });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => filterProjects(btn));
  });

});
