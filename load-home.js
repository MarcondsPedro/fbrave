const hasSeenLoader = sessionStorage.getItem('loaderDone');

if (!hasSeenLoader) {
  window.scrollTo(0, 0);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
}

document.addEventListener('DOMContentLoaded', () => {

  const loader = document.querySelector('.loader');
  const isXImage = document.querySelector('.loader_img.is-x');
  const normalImages = [...document.querySelectorAll('.loader_img:not(.is-x)')];
  const embed = document.querySelectorAll('.fbrave-embed');
  const navbar = document.querySelector('.navbar');
  const heroInfo = document.querySelector('.hero_info');
  const heroTitle = document.querySelector('.hero_title');

  if (!loader || !normalImages.length || !isXImage) return;

  const middleIdx = Math.floor(normalImages.length / 2);

  const fan = [
    { x: -320, y: 50, rotation: -20, zIndex: 1 },
    { x: -160, y: 20, rotation: -10, zIndex: 2 },
    { x: 0, y: 0, rotation: 0, zIndex: 3 },
    { x: 160, y: 20, rotation: 10, zIndex: 2 },
    { x: 320, y: 50, rotation: 20, zIndex: 1 }
  ];

  if (hasSeenLoader) {
    skipToEntrance();
    return;
  }

  gsap.set('.loader_img-wrap', { perspective: 800 });
  gsap.set(embed, { y: '105%' });
  gsap.set([navbar, heroInfo, heroTitle].filter(Boolean), { opacity: 0 });
  gsap.set(isXImage, { visibility: 'hidden' });
  gsap.set(normalImages, { opacity: 0 });

  const blinkOrder = normalImages.filter((_, i) => i !== middleIdx).concat(normalImages[middleIdx]);

  const blinkTl = gsap.timeline({ repeat: -1 });
  blinkOrder.forEach((img, i) => {
    blinkTl.set(normalImages, { opacity: 0 }, i * 0.15);
    blinkTl.set(img, { opacity: 1 }, i * 0.15);
  });
  blinkTl.set(normalImages, { opacity: 0 }, blinkOrder.length * 0.15);

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
    blinkTl.pause();
    blinkTl.kill();
    normalImages.forEach(img => {
      gsap.killTweensOf(img);
      img.style.opacity = '0';
    });

    const middleCard = normalImages[middleIdx];
    middleCard.style.opacity = '1';
    gsap.set(middleCard, { x: 0, y: 0, rotation: 0, zIndex: fan[middleIdx].zIndex });

    setTimeout(() => {
      const tl = gsap.timeline();
      const otherIdxs = normalImages.map((_, i) => i).filter(i => i !== middleIdx);

      otherIdxs.forEach(i => {
        normalImages[i].style.opacity = '1';
        gsap.set(normalImages[i], { x: 0, y: 0, rotation: 0 });
        tl.to(normalImages[i], {
          x: fan[i].x,
          y: fan[i].y,
          rotation: fan[i].rotation,
          zIndex: fan[i].zIndex,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)'
        }, 0);
      });

      tl.addLabel('fanned', '+=0.4');

      tl.to(middleCard, {
        rotationY: 90,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(middleCard, { visibility: 'hidden' });
          gsap.set(isXImage, {
            visibility: 'visible',
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
        }, 0);
      }

      const fadeEls = [navbar, heroInfo].filter(Boolean);
      if (fadeEls.length) {
        tl.to(fadeEls, {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut'
        }, 'revealed+=0.4');
      }

      if (heroTitle) {
        tl.to(heroTitle, {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut'
        }, 'revealed');
      }

      tl.add(() => {
        gsap.set(loader, { pointerEvents: 'none' });
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.height = '';
        sessionStorage.setItem('loaderDone', 'true');
        startLoop();
      }, 'done+=0.5');

    }, 500);
  }

  function startLoop() {
    const middleCard = normalImages[middleIdx];
    const otherIdxs = normalImages.map((_, i) => i).filter(i => i !== middleIdx);

    function playLoop() {
      const loop = gsap.timeline({
        delay: 3,
        onComplete: playLoop
      });

      loop.to(isXImage, {
        rotationY: 90,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(isXImage, { visibility: 'hidden' });
          gsap.set(middleCard, {
            visibility: 'visible',
            opacity: 1,
            x: 0, y: 0, rotation: 0,
            rotationY: -90,
            zIndex: fan[middleIdx].zIndex
          });
        }
      });

      loop.to(middleCard, {
        rotationY: 0,
        duration: 0.35,
        ease: 'power3.out'
      });

      otherIdxs.forEach(i => {
        gsap.set(normalImages[i], { opacity: 1, visibility: 'visible', x: 0, y: 0, rotation: 0 });
        loop.to(normalImages[i], {
          x: fan[i].x,
          y: fan[i].y,
          rotation: fan[i].rotation,
          zIndex: fan[i].zIndex,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)'
        }, '<');
      });

      loop.addLabel('hold', '+=0.8');

      otherIdxs.forEach(i => {
        loop.to(normalImages[i], {
          x: 0, y: 0, rotation: 0,
          duration: 0.6,
          ease: 'expo.inOut'
        }, 'hold');
      });

      loop.to(middleCard, {
        rotationY: 90,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(middleCard, { visibility: 'hidden' });
          normalImages.forEach((img, i) => {
            if (i !== middleIdx) gsap.set(img, { opacity: 0, visibility: 'hidden' });
          });
          gsap.set(isXImage, {
            visibility: 'visible',
            rotationY: -90,
            zIndex: 10
          });
        }
      }, 'hold+=0.5');

      loop.to(isXImage, {
        rotationY: 0,
        duration: 0.35,
        ease: 'power3.out'
      });
    }

    playLoop();
  }

  function skipToEntrance() {
    gsap.set(normalImages, { display: 'none' });
    gsap.set(loader, { pointerEvents: 'none' });
    gsap.set(isXImage, { opacity: 0, visibility: 'visible' });

    gsap.set(embed, { y: '105%' });
    gsap.set([navbar, heroInfo, heroTitle].filter(Boolean), { opacity: 0 });

    const tl = gsap.timeline();

    tl.to(isXImage, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0);

    if (embed.length) {
      tl.to(embed, {
        y: '0%',
        ease: 'expo.out',
        duration: 1.2,
        stagger: { amount: 0.6, from: 'start' }
      }, 0.4);
    }

    const fadeEls = [navbar, heroInfo, heroTitle].filter(Boolean);
    if (fadeEls.length) {
      tl.to(fadeEls, {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.6);
    }

    tl.add(() => startLoop(), '+=0.5');
  }

});
