document.addEventListener('DOMContentLoaded', () => {

  const embed = document.querySelector('.fbrave-embed');
  const navbar = document.querySelector('.navbar');
  const heroInfo = document.querySelector('.hero_info');

  if (!embed || !navbar || !heroInfo) return;

  gsap.set(embed, { y: '100%', opacity: 0 });
  gsap.set([navbar, heroInfo], { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.inOut', duration: 0.6 } });

  tl.to(embed, {
    y: '0%',
    opacity: 1,
    stagger: 0.15
  })
  .to([navbar, heroInfo], {
    opacity: 1,
    stagger: 0.15
  }, '+=0.1');

});
