/**
 * Recherche rapide dans le header : ID → fiche Pokémon, texte → Pokédex avec ?name=...
 */
function renderHeaderSearch() {
  const el = document.getElementById('header-search');
  if (!el) return;
  el.innerHTML = `
    <form id="quick-search-form" class="header-search-form">
      <input type="text" id="quick-search-input" placeholder="ID ou nom Pokémon" autocomplete="off">
      <button type="submit" class="btn btn-small">Rechercher</button>
    </form>
  `;
  const form = document.getElementById('quick-search-form');
  const input = document.getElementById('quick-search-input');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (input?.value || '').trim();
    if (!v) return;
    if (/^\d+$/.test(v)) {
      window.location.href = './pokemon.html?id=' + v;
    } else {
      window.location.href = './pokedex.html?name=' + encodeURIComponent(v);
    }
  });
}
