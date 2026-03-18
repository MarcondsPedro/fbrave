document.addEventListener('DOMContentLoaded', function () {

    const links = document.querySelectorAll('a:not([target="_blank"])');
    const transitionCover = document.querySelector('.transition-cover');
    const pageWrapper = document.querySelector('.page-wrapper');
  
    if (!transitionCover || !pageWrapper) return;
  
    const startTransitionAnimation = (targetURL) => {
      gsap.set(transitionCover, {
        display: 'flex',
        autoAlpha: 0
      });
  
      gsap.to(transitionCover, {
        duration: 0.5,
        autoAlpha: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          window.location.href = targetURL;
        }
      });
    };
  
    const endTransitionAnimation = () => {
      gsap.set(transitionCover, {
        display: 'flex',
        autoAlpha: 1
      });
      gsap.set(pageWrapper, { opacity: 1 });
  
      gsap.to(transitionCover, {
        duration: 0.5,
        autoAlpha: 0,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(transitionCover, {
            display: 'none'
          });
        }
      });
    };
  
    const hasTransition = sessionStorage.getItem('nextPageTransition');
  
    if (hasTransition) {
      endTransitionAnimation();
      sessionStorage.removeItem('nextPageTransition');
    } else {
      gsap.set(pageWrapper, { opacity: 1 });
      gsap.set(transitionCover, {
        display: 'none',
        autoAlpha: 0
      });
    }
  
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
  
        // Ignora âncoras internas
        if (!href || href.startsWith('#')) return;
  
        // Ignora links para a mesma página
        if (link.href === window.location.href) return;
  
        e.preventDefault();
        sessionStorage.setItem('nextPageTransition', 'true');
        startTransitionAnimation(link.href);
      });
    });
  
  });
  
  
  window.addEventListener('pageshow', function (event) {
    const transitionCover = document.querySelector('.transition-cover');
    const pageWrapper = document.querySelector('.page-wrapper');
  
    if (!transitionCover || !pageWrapper) return;
  
    if (event.persisted) {
      gsap.killTweensOf('*');
  
      gsap.set(pageWrapper, { opacity: 1 });
      gsap.set(transitionCover, {
        display: 'none',
        autoAlpha: 0
      });
  
      sessionStorage.removeItem('nextPageTransition');
    }
  });