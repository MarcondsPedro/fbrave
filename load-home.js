document.addEventListener('DOMContentLoaded', () => {

  const embed = document.querySelectorAll('.fbrave-embed');
  const navbar = document.querySelector('.navbar');
  const heroInfo = document.querySelector('.hero_info');
  const heroTitle = document.querySelector('.hero_title');

  if (!embed.length || !navbar || !heroInfo || !heroTitle) return;

  gsap.set(embed, { y: '100%' });
  gsap.set([navbar, heroInfo, heroTitle], { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.inOut', duration: 0.6 } });

  tl.to(embed, {
    y: '0%',
    ease: 'elastic.out(1, 0.75)',
    duration: 1.2,
    stagger: { amount: 0.6, from: 'start' }
  })
  .to([navbar, heroInfo, heroTitle], {
    opacity: 1,
    duration: 1,
    ease: 'power2.inOut'
  }, '+=0.1');

});
