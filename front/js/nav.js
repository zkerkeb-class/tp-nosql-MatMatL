function renderNav(active) {
  const links = [
    { href: './', label: 'Accueil' },
    { href: './pokedex.html', label: 'Pokédex' },
    { href: './favoris.html', label: 'Favoris' },
    { href: './equipes.html', label: 'Mes équipes' },
    { href: './stats.html', label: 'Statistiques' },
  ];
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.innerHTML = links.map(({ href, label }) =>
    `<a href="${href}"${active === href ? ' class="active"' : ''}>${label}</a>`
  ).join('');
}
