/**
 * Recherche rapide dans le header : ID → fiche Pokémon, texte → Pokédex avec ?name=...
 * Suggestions dynamiques avec debounce pour ne pas surcharger.
 */
function renderHeaderSearch() {
  const el = document.getElementById('header-search');
  if (!el) return;
  el.innerHTML = `
    <div class="header-search-wrap">
      <form id="quick-search-form" class="header-search-form">
        <input type="text" id="quick-search-input" placeholder="ID ou nom Pokémon" autocomplete="off" aria-autocomplete="list" aria-controls="quick-search-suggestions" aria-expanded="false">
        <button type="submit" class="btn btn-small">Rechercher</button>
      </form>
      <div id="quick-search-suggestions" class="search-suggestions" role="listbox"></div>
    </div>
  `;
  const form = document.getElementById('quick-search-form');
  const input = document.getElementById('quick-search-input');
  const suggestionsEl = document.getElementById('quick-search-suggestions');

  let debounceTimer = null;
  let abortController = null;
  const DEBOUNCE_MS = 280;
  const MIN_CHARS = 2;
  const SUGGESTIONS_LIMIT = 8;

  function hideSuggestions() {
    suggestionsEl.classList.remove('search-suggestions-visible');
    suggestionsEl.innerHTML = '';
    input?.setAttribute('aria-expanded', 'false');
  }

  function showSuggestions(html) {
    suggestionsEl.innerHTML = html;
    suggestionsEl.classList.add('search-suggestions-visible');
    input?.setAttribute('aria-expanded', 'true');
  }

  function goToSearch(value) {
    const v = (value || input?.value || '').trim();
    if (!v) return;
    hideSuggestions();
    if (/^\d+$/.test(v)) {
      window.location.href = './pokemon.html?id=' + v;
    } else {
      window.location.href = './pokedex.html?name=' + encodeURIComponent(v);
    }
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    goToSearch();
  });

  input?.addEventListener('input', () => {
    const q = (input.value || '').trim();
    clearTimeout(debounceTimer);
    if (q.length < MIN_CHARS) {
      hideSuggestions();
      return;
    }
    debounceTimer = setTimeout(() => {
      if (abortController) abortController.abort();
      abortController = new AbortController();
      const url = '/api/pokemons?name=' + encodeURIComponent(q) + '&limit=' + SUGGESTIONS_LIMIT;
      fetch(url, { signal: abortController.signal })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
          const list = data?.data || [];
          if (list.length === 0) {
            showSuggestions('<div class="search-suggestion-item search-suggestion-empty">Aucun résultat</div>');
            return;
          }
          const html = list.map(p => {
            const name = p.name?.french || p.name?.english || p.id;
            const img = typeof pokemonImageUrl === 'function' ? pokemonImageUrl(p) : ('/assets/pokemons/' + p.id + '.png');
            return '<a href="./pokemon.html?id=' + p.id + '" class="search-suggestion-item" role="option">' +
              '<img src="' + img + '" alt="" class="search-suggestion-img">' +
              '<span>#' + p.id + ' ' + escapeHtml(name) + '</span></a>';
          }).join('') +
            '<a href="./pokedex.html?name=' + encodeURIComponent(q) + '" class="search-suggestion-item search-suggestion-all" role="option">Voir tous les résultats</a>';
          showSuggestions(html);
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          hideSuggestions();
        });
    }, DEBOUNCE_MS);
  });

  input?.addEventListener('focus', () => {
    const q = (input.value || '').trim();
    if (q.length >= MIN_CHARS && suggestionsEl.innerHTML) suggestionsEl.classList.add('search-suggestions-visible');
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSuggestions();
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (el && !el.contains(e.target)) hideSuggestions();
  });

  // Clic sur une suggestion : navigation (lien) ; on ferme quand même la liste
  suggestionsEl.addEventListener('click', () => hideSuggestions());
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
