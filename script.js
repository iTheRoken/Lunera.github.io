(() => {
  'use strict';
  const config = window.LUNERA_SITE_CONFIG || {};
  function getDownloadUrl(platform = 'windows') {
    const target = platform === 'android' ? (config.android || {}) : config;
    const installerName = target.installerName || (platform === 'android' ? 'Lunera-Mobile.apk' : 'Lunera-Setup-2.0.0.exe');
    if (target.releaseUrl) return target.releaseUrl;
    const { hostname, pathname } = window.location;
    let repository = target.githubRepository || config.githubRepository;
    if (!repository && hostname.endsWith('.github.io')) {
      const owner = hostname.split('.')[0];
      const project = pathname.split('/').filter(Boolean)[0];
      repository = `${owner}/${project && project !== 'index.html' ? project : `${owner}.github.io`}`;
    }
    if (repository && /^[\w.-]+\/[\w.-]+$/.test(repository)) {
      const releasePath = target.releaseTag ? `download/${encodeURIComponent(target.releaseTag)}` : 'latest/download';
      return `https://github.com/${repository}/releases/${releasePath}/${encodeURIComponent(installerName)}`;
    }
    return target.localInstallerPath || `downloads/${encodeURIComponent(installerName)}`;
  }
  document.querySelectorAll('[data-download]').forEach(link => {
    const installerUrl = getDownloadUrl(link.dataset.download);
    link.href = installerUrl;
    if (/^https?:/i.test(installerUrl)) link.removeAttribute('download');
  });

  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('#site-navigation');
  function closeMenu() {
    navigation?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
  }
  menuButton?.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

  const tabs = [...document.querySelectorAll('[data-view]')];
  function activateTab(tab, focus = false) {
    tabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });
  const colors = { mint: '#a0e8c4', lilac: '#c8b6ed', peach: '#efb59d' };
  document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.color-art').style.setProperty('--sample', colors[button.dataset.color]);
      document.querySelectorAll('[data-color]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    });
  });

  // Decorative bars in the moon illustration. The website does not play audio.
  const linear = document.querySelector('.art-bars');
  for (let i = 0; i < 24; i++) {
    const bar = document.createElement('i');
    bar.style.setProperty('--h', `${9 + Math.sin(i * .8) ** 2 * 33}px`);
    bar.style.setProperty('--delay', `${-i * .13}s`);
    linear?.append(bar);
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.documentElement.classList.add('js-motion');
    motion.addEventListener('change', event => {
      if (event.matches) { document.documentElement.classList.remove('js-motion'); observer.disconnect(); }
    });
  }
})();
