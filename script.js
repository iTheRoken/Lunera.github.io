(() => {
  const config = window.LUNERA_SITE_CONFIG || {};

  function getDownloadUrl() {
    if (config.releaseUrl) return config.releaseUrl;

    // GitHub no permite subir instaladores de más de 100 MB al repositorio.
    // En GitHub Pages usamos la Release más reciente del mismo repositorio.
    const { hostname, pathname } = window.location;
    if (hostname.endsWith('.github.io')) {
      const owner = hostname.split('.')[0];
      const repository = pathname.split('/').filter(Boolean)[0];
      if (owner && repository) {
        return `https://github.com/${owner}/${repository}/releases/latest/download/${encodeURIComponent(config.installerName || 'Lunera Beta Setup.exe')}`;
      }
    }

    return config.localInstallerPath || 'downloads/Lunera%20Beta%20Setup.exe';
  }

  const installerUrl = getDownloadUrl();
  document.querySelectorAll('[data-download]').forEach((link) => {
    link.href = installerUrl;
    if (/^https?:/i.test(installerUrl)) {
      link.removeAttribute('download');
    }
  });

  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.site-nav');
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('is-open');
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
