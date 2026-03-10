/**
 * Helpers pour appeler l'API (même origine : servi par Express)
 */
const API_BASE = '';

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function api(method, path, body = null) {
  const opts = { method, headers: getAuthHeaders() };
  if (body && (method === 'POST' || method === 'PUT')) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, opts);
  const data = res.ok ? (res.status === 204 ? null : await res.json()) : await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

const apiGet = (path) => api('GET', path);
const apiPost = (path, body) => api('POST', path, body);
const apiPut = (path, body) => api('PUT', path, body);
const apiDelete = (path) => api('DELETE', path);

function buildQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') q.set(k, v); });
  const s = q.toString();
  return s ? '?' + s : '';
}

function pokemonImageUrl(pokemon) {
  if (pokemon?.image) return pokemon.image;
  if (pokemon?.id) return `${API_BASE}/assets/pokemons/${pokemon.id}.png`;
  return `${API_BASE}/assets/pokemons/0.png`;
}

function pokemonShinyImageUrl(pokemon) {
  const id = pokemon?.id ?? 0;
  return `${API_BASE}/assets/pokemons/shiny/${id}.png`;
}
