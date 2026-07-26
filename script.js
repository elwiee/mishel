const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

reveals.forEach((element) => revealObserver.observe(element));

const siteHeader = document.querySelector('.nav');
const siteNav = siteHeader?.querySelector('nav');
let menuButton;

if (siteHeader && siteNav) {
  menuButton = document.createElement('button');
  menuButton.className = 'menu-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Открыть меню');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span><span></span>';

  const extraLink = siteHeader.querySelector('.nav-social');
  if (extraLink) {
    const mobileExtra = extraLink.cloneNode(true);
    mobileExtra.className = 'mobile-nav-extra';
    siteNav.appendChild(mobileExtra);
  }

  siteHeader.appendChild(menuButton);

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };

  menuButton.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}

const progress = document.querySelector('.progress span');
const cinemaImage = document.querySelector('.cinema img');
const finaleImage = document.querySelector('.finale > img');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroLandscape = document.querySelector('.hero-landscape');
const naturePortal = document.querySelector('.nature-portal');
const scenicHero = document.querySelector('.scenic-hero');
const galleryLandscape = document.querySelector('.gallery-landscape img');
const storyList = document.querySelector('.story-list');

let botanicalLayer;
if (!reducedMotion.matches) {
  botanicalLayer = document.createElement('div');
  botanicalLayer.className = 'botanical-layer';
  botanicalLayer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 7; i += 1) {
    const leaf = document.createElement('i');
    leaf.className = 'drifting-leaf';
    leaf.style.cssText = `--leaf-x:${9 + ((i * 17) % 84)}%;--leaf-y:${(i * 19) % 90}%;--leaf-size:${14 + (i % 4) * 5}px;--leaf-delay:${i * -.9}s;--leaf-speed:${.035 + (i % 3) * .014}`;
    botanicalLayer.appendChild(leaf);
  }
  document.body.appendChild(botanicalLayer);
}

function updateScrollEffects() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);

  if (!reducedMotion.matches) {
    const progressRatio = max > 0 ? window.scrollY / max : 0;
    document.body.style.setProperty('--glow-x', `${12 + progressRatio * 55}%`);
    document.body.style.setProperty('--glow-y', `${18 + Math.sin(progressRatio * Math.PI) * 35}%`);
    if (cinemaImage) {
      const cinemaRect = cinemaImage.parentElement.getBoundingClientRect();
      cinemaImage.style.transform = `translateY(${cinemaRect.top * -0.045}px)`;
    }
    if (finaleImage) {
      const finaleRect = finaleImage.parentElement.getBoundingClientRect();
      finaleImage.style.transform = `translateY(${finaleRect.top * -0.035}px)`;
    }
    if (heroLandscape) heroLandscape.style.transform = `translate3d(0, ${window.scrollY * .16}px, 0) scale(1.08)`;
    if (naturePortal) {
      const natureRect = naturePortal.getBoundingClientRect();
      const natureImage = naturePortal.querySelector('img');
      if (natureImage && natureRect.bottom > 0 && natureRect.top < window.innerHeight) {
        natureImage.style.transform = `translate3d(0, ${natureRect.top * -.075}px, 0) scale(1.12)`;
        naturePortal.style.setProperty('--portal-progress', Math.max(0, Math.min(1, 1 - natureRect.top / window.innerHeight)));
      }
    }
    if (scenicHero) {
      const image = scenicHero.querySelector('.scenic-hero-image');
      const amount = Math.min(window.scrollY, window.innerHeight) * .19;
      if (image) image.style.transform = `translate3d(0, ${amount}px, 0) scale(1.1)`;
      scenicHero.style.setProperty('--hero-fade', Math.min(1, window.scrollY / (window.innerHeight * .72)));
    }
    if (galleryLandscape) {
      galleryLandscape.style.transform = `translate3d(0, ${(window.scrollY * -.035) % 90}px, 0) scale(1.18)`;
    }
    if (storyList) {
      const rect = storyList.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      storyList.style.setProperty('--story-progress', progress);
    }
    if (botanicalLayer) {
      botanicalLayer.querySelectorAll('.drifting-leaf').forEach((leaf, index) => {
        const shift = window.scrollY * Number(getComputedStyle(leaf).getPropertyValue('--leaf-speed'));
        const sway = Math.sin(window.scrollY * .004 + index * 1.7) * 24;
        leaf.style.transform = `translate3d(${sway}px, ${shift % (window.innerHeight + 160)}px, 0) rotate(${35 + sway * 1.4}deg)`;
      });
    }

    document.querySelectorAll('.gallery-full figure, .masonry figure').forEach((figure, index) => {
      const rect = figure.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const image = figure.querySelector('img');
        const offset = (rect.top - window.innerHeight / 2) * (index % 2 ? .018 : -.018);
        const tilt = Math.max(-1.2, Math.min(1.2, (rect.top - window.innerHeight / 2) / 500));
        if (image) image.style.transform = `scale(1.06) translateY(${offset}px) rotate(${tilt}deg)`;
      }
    });
  }
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateScrollEffects(); ticking = false; });
    ticking = true;
  }
}, { passive: true });

updateScrollEffects();
