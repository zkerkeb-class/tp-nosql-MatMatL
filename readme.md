# API Pokémon & MongoDB

API REST qui expose les **151 Pokémon** de la première génération, stockés dans **MongoDB**. Elle propose un CRUD complet sur les Pokémon, des filtres / tri / pagination, une **authentification JWT**, un système de **favoris** et d’**équipes** (max 6 Pokémon par équipe), ainsi que des **statistiques** calculées par agrégation MongoDB.

**Stack :** Node.js, Express 5, Mongoose 9, JWT, bcrypt.

Un **front minimal** (HTML/CSS/JS) dans le dossier `front/` est servi à la racine : ouvre `http://localhost:3000` pour parcourir le Pokédex, gérer favoris et équipes, et consulter les stats.

---

## Installation & lancement

**Prérequis :** Node.js 18+, MongoDB (local ou Atlas).

```bash
npm install
cp .env.example .env
# Éditer .env : MONGODB_URI, JWT_SECRET (optionnel : PORT, API_URL)

npm run seed   # Peupler la base (151 Pokémon)
npm run dev    # Serveur sur http://localhost:3000
```

**Variables d’environnement (`.env`) :**

| Variable     | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Port du serveur (défaut 3000)        |
| `MONGODB_URI` | URL de connexion MongoDB            |
| `API_URL`   | URL de l’API (pour les images)       |
| `JWT_SECRET`| Clé pour signer les tokens JWT       |

---

## Authentification

Les routes qui **modifient** des données (création, mise à jour, suppression) exigent un token JWT dans le header :

```
Authorization: Bearer <token>
```

### Inscription

| Méthode | Route | Description |
|--------|--------|-------------|
| **POST** | `/api/auth/register` | Crée un utilisateur. Body : `{ "username": "...", "password": "..." }`. Réponse **201** ou 400 (données invalides / username déjà pris). |

### Connexion

| Méthode | Route | Description |
|--------|--------|-------------|
| **POST** | `/api/auth/login` | Body : `{ "username": "...", "password": "..." }`. Réponse **200** avec `{ "token": "<JWT>" }` ou **401** si identifiants invalides. |

---

## Pokémon

Les Pokémon sont identifiés par un champ numérique `id` (1 à 151 pour la génération 1). Structure type : `id`, `name` (english, french, japanese, chinese), `type` (tableau), `base` (HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed), `image`.

### Endpoints Pokémon

| Méthode | Route | Auth | Description |
|--------|--------|------|-------------|
| **GET** | `/api/pokemons` | Non | Liste avec **filtres, tri, pagination**. Query : `type`, `name` (recherche partielle), `sort` (ex. `-base.HP`), `page`, `limit`. Réponse : `{ data, page, limit, total, totalPages }`. |
| **GET** | `/api/pokemons/:id` | Non | Un Pokémon par `id`. **404** si absent. |
| **POST** | `/api/pokemons` | Oui | Crée un Pokémon. Body : même structure. **201** ou 400 (validation). |
| **PUT** | `/api/pokemons/:id` | Oui | Met à jour un Pokémon. **200** / 404 / 400. |
| **DELETE** | `/api/pokemons/:id` | Oui | Supprime un Pokémon. **204** ou 404. |

---

## Favoris

Favoris par utilisateur (liste d’IDs de Pokémon). **Toutes les routes nécessitent un token JWT.**

| Méthode | Route | Description |
|--------|--------|-------------|
| **GET** | `/api/favorites` | Liste des Pokémon favoris de l’utilisateur (documents complets). |
| **POST** | `/api/favorites/:pokemonId` | Ajoute un favori (sans doublon). **201** ou 404 si Pokémon inexistant. |
| **DELETE** | `/api/favorites/:pokemonId` | Retire un favori. **200**. |

---

## Statistiques

| Méthode | Route | Auth | Description |
|--------|--------|------|-------------|
| **GET** | `/api/stats` | Non | Statistiques par agrégation MongoDB : `countByType`, `avgHpByType`, `maxAttack` (Pokémon avec la plus forte attaque), `maxHp` (Pokémon avec le plus de HP). |

---

## Équipes

Chaque utilisateur peut créer des **équipes** de **6 Pokémon maximum**. **Toutes les routes nécessitent un token JWT.** Le paramètre `:id` des équipes est l’`_id` MongoDB de l’équipe.

| Méthode | Route | Description |
|--------|--------|-------------|
| **POST** | `/api/teams` | Crée une équipe. Body : `{ "name": "...", "pokemons": [25, 1, 4] }` (ids numériques). **201** + équipe avec `pokemons` populés. |
| **GET** | `/api/teams` | Liste des équipes de l’utilisateur (avec `populate('pokemons')`). |
| **GET** | `/api/teams/:id` | Détail d’une équipe (avec Pokémon complets). **404** si non trouvée ou pas propriétaire. |
| **PUT** | `/api/teams/:id` | Modifie nom et/ou liste de Pokémon (toujours max 6). **200** / 400 / 404. |
| **DELETE** | `/api/teams/:id` | Supprime l’équipe. **204** ou 404. |

---

## Codes HTTP

| Code | Signification |
|------|----------------|
| **200** | OK, ressource retournée |
| **201** | Création réussie |
| **204** | Suppression réussie (pas de body) |
| **400** | Données invalides (validation, format) |
| **401** | Token manquant ou invalide |
| **404** | Ressource non trouvée |
| **500** | Erreur serveur |
