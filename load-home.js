document.addEventListener('DOMContentLoaded', () => {

  const loader = document.querySelector('.loader');
  const isXImage = document.querySelector('.loader_img.is-x');
  const normalImages = [...document.querySelectorAll('.loader_img:not(.is-x)')];
  const embed = document.querySelectorAll('.fbrave-embed');
  const navbar = document.querySelector('.navbar');
  const heroInfo = document.querySelector('.hero_info');
  const heroTitle = document.querySelector('.hero_title');

  if (!loader || !normalImages.length || !isXImage) return;

  window.scrollTo(0, 0);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  gsap.set('.loader_img-wrap', { perspective: 800 });
  gsap.set(embed, { y: '100%' });
  gsap.set([navbar, heroInfo, heroTitle].filter(Boolean), { opacity: 0 });
  gsap.set(isXImage, { opacity: 0 });
  gsap.set(normalImages, { opacity: 0 });

  const middleIdx = Math.floor(normalImages.length / 2);

  const fan = [
    { x: -320, y: 50, rotation: -20, zIndex: 1 },
    { x: -160, y: 20, rotation: -10, zIndex: 2 },
    { x: 0, y: 0, rotation: 0, zIndex: 3 },
    { x: 160, y: 20, rotation: 10, zIndex: 2 },
    { x: 320, y: 50, rotation: 20, zIndex: 1 }
  ];

  const blinkTl = gsap.timeline({ repeat: -1 });
  normalImages.forEach((img, i) => {
    blinkTl.set(normalImages, { opacity: 0 }, i * 0.15);
    blinkTl.set(img, { opacity: 1 }, i * 0.15);
  });
  blinkTl.set(normalImages, { opacity: 0 }, normalImages.length * 0.15);

  let pageLoaded = document.readyState === 'complete';
  let minTimeDone = false;

  const tryStart = () => {
    if (pageLoaded && minTimeDone) runOutro();
  };

  if (!pageLoaded) {
    window.addEventListener('load', () => {
      pageLoaded = true;
      tryStart();
    });
  }

  setTimeout(() => {
    minTimeDone = true;
    tryStart();
  }, 3000);

  function runOutro() {
    blinkTl.kill();

    const tl = gsap.timeline();

    tl.set(normalImages, { opacity: 1 });

    normalImages.forEach((img, i) => {
      tl.to(img, {
        x: fan[i].x,
        y: fan[i].y,
        rotation: fan[i].rotation,
        zIndex: fan[i].zIndex,
        duration: 1.2,
        ease: 'elastic.out(1, 0.75)'
      }, 0);
    });

    tl.addLabel('fanned', '+=1');

    const middleCard = normalImages[middleIdx];

    tl.to(middleCard, {
      rotationY: 90,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set(middleCard, { opacity: 0 });
        gsap.set(isXImage, {
          opacity: 1,
          x: fan[middleIdx].x,
          y: fan[middleIdx].y,
          rotation: fan[middleIdx].rotation,
          rotationY: -90,
          zIndex: 10
        });
      }
    }, 'fanned');

    tl.to(isXImage, {
      rotationY: 0,
      duration: 0.35,
      ease: 'power3.out'
    }, 'fanned+=0.35');

    tl.addLabel('revealed', '+=0.4');

    const otherCards = normalImages.filter((_, i) => i !== middleIdx);

    tl.to(otherCards, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      duration: 0.7,
      ease: 'expo.inOut',
      stagger: { amount: 0.15, from: 'edges' }
    }, 'revealed');

    if (embed.length) {
      tl.to(embed, {
        y: '0%',
        ease: 'expo.out',
        duration: 1.2,
        stagger: { amount: 0.6, from: 'start' }
      }, 'revealed+=0.2');
    }

    const fadeEls = [navbar, heroInfo, heroTitle].filter(Boolean);
    if (fadeEls.length) {
      tl.to(fadeEls, {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut'
      }, 'revealed+=0.4');
    }

    tl.to(loader, {
      pointerEvents: 'none',
      onComplete: () => {
        gsap.set(loader, { pointerEvents: 'none' });
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    }, 'revealed+=0.5');
  }

});
