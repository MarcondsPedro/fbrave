document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  const stickyWrap = document.querySelector('.sticky-component-showcase');
  const showcase = document.querySelector('.showcase_component');
  const collection = document.querySelector('.marquee-advanced__collection');
  const target = document.querySelector('.marquee-advanced__item-width.is-target');
  const targetInner = target?.querySelector('.marquee-advanced_target');

  if (!stickyWrap || !showcase || !collection || !target || !targetInner) return;

  gsap.set(showcase, { overflow: 'hidden' });
  gsap.set(targetInner, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });

  const targetRect = target.getBoundingClientRect();
  const collectionRect = collection.getBoundingClientRect();
  const targetCenterInCollection = (targetRect.left - collectionRect.left) + (targetRect.width / 2);
  const moveX = targetCenterInCollection - (window.innerWidth / 2);

  gsap.to(collection, {
    x: -moveX,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: stickyWrap,
      start: 'top 80%',
      end: 'top top',
      scrub: 3
    }
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stickyWrap,
      start: 'top top',
      end: 'bottom bottom',
      pin: showcase,
      scrub: 1.5
    }
  });

  tl.to(targetInner, {
    width: '100vw',
    height: '100vh',
    duration: 3,
    ease: 'power2.inOut'
  });

});
