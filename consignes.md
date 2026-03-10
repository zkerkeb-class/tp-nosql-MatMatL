# API Pokémon & MongoDB — Sujet de TP NoSQL

<aside>
📋

**6 parties progressives** · ~18h de TP · Individuel

</aside>

Vous disposez d'une API Express.js avec les **151 Pokémon** de la première génération. Le serveur tourne, les données existent dans un fichier JSON, mais **il n'y a aucune route et aucune base de données**.

Votre mission : construire, étape par étape, une API REST complète connectée à MongoDB.

<aside>
💡

**Comment lire ce sujet ?** Chaque partie est indépendante et progressive. Les étapes sont numérotées : suivez-les dans l'ordre. Les sections *Indice* sont là si vous bloquez — essayez d'abord sans.

</aside>

---

# Prérequis & Installation

## Ce dont vous avez besoin

- **Node.js** (v18 ou supérieur)
- **MongoDB** lancé en local (`mongod`) ou un cluster **MongoDB Atlas** (gratuit)
- Un éditeur de code (VS Code recommandé)
- Un outil pour tester les requêtes : **Thunder Client** (extension VS Code), Postman, ou `curl`

## Installation du projet

```bash
# Cloner le projet (votre prof vous donnera l'URL)
git clone <url-du-repo>
cd nosql_2026

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# (vérifiez que MONGODB_URI pointe vers votre MongoDB)

# Lancer le serveur en mode dev
npm run dev
```

## Structure du projet

```
nosql_2026/
├── index.js              ← Point d'entrée du serveur (déjà configuré)
├── package.json
├── .env                  ← Vos variables d'environnement
├── data/
│   ├── pokemonsList.js   ← Les 151 Pokémon (JS)
│   └── pokemons.json     ← Les 151 Pokémon (JSON)
└── assets/
    └── pokemons/         ← Images des 151 Pokémon (1.png à 151.png)
```

## Vérification

Ouvrez `http://localhost:3000` dans votre navigateur. Vous devriez voir **"Hello, World!"**. Si oui, tout est bon.

---

# Partie 1 — Premières routes Express

`~2h` · Facile

Avant de toucher à MongoDB, on va d'abord créer des routes qui servent les données depuis le fichier JSON existant. Cela vous permettra de comprendre le fonctionnement d'Express.

## Étape 1.1 — Servir la liste complète

Créez une route `GET /api/pokemons` qui retourne les 151 Pokémon.

1. Importez le fichier `data/pokemonsList.js` dans `index.js`
2. Créez une route `GET` sur `/api/pokemons`
3. Retournez la liste complète en JSON

<aside>
🎯

**Résultat attendu**

```
GET http://localhost:3000/api/pokemons
→ Réponse : 200 OK
→ Body : un tableau JSON de 151 objets
```

</aside>

## Étape 1.2 — Récupérer un Pokémon par ID

Créez une route `GET /api/pokemons/:id` qui retourne un seul Pokémon.

1. Récupérez le paramètre `:id` depuis l'URL
2. Cherchez le Pokémon correspondant dans le tableau
3. Si trouvé : retournez-le avec le status **200**
4. Si non trouvé : retournez une erreur avec le status **404**
- Indice
    
    `req.params.id` est toujours une **string**. Pensez à le convertir en nombre avec `parseInt()` ou le préfixe `+` pour comparer avec l'`id` des Pokémon.
    

## Étape 1.3 — Organiser son code avec un Router

Séparez les routes Pokémon dans un fichier dédié.

1. Créez un dossier `routes/`
2. Créez le fichier `routes/pokemons.js`
3. Utilisez `express.Router()` pour y définir vos routes
4. Exportez le router et importez-le dans `index.js` avec `app.use('/api/pokemons', pokemonsRouter)`

<aside>
✅

**Checklist Partie 1**

- [ ]  `GET /api/pokemons` retourne les 151 Pokémon
- [ ]  `GET /api/pokemons/25` retourne Pikachu
- [ ]  `GET /api/pokemons/999` retourne une 404
- [ ]  Les routes sont dans `routes/pokemons.js`
</aside>

---

# Partie 2 — Connexion à MongoDB & Modèle Mongoose

`~3h` · Facile

On passe aux choses sérieuses : connecter l'API à une vraie base de données.

## Étape 2.1 — Connexion à MongoDB

1. Vérifiez que votre `.env` contient la variable `MONGODB_URI`
2. Créez un fichier `db/connect.js`
3. Utilisez `mongoose.connect()` pour vous connecter à MongoDB
4. Affichez un message de succès dans la console (ou un message d'erreur si ça échoue)
5. Importez et appelez cette connexion dans `index.js`, **avant** de lancer le serveur

<aside>
🎯

**Résultat attendu**

```
$ npm run dev
Connecté à MongoDB !
Server is running on http://localhost:3000
```

</aside>

<aside>
⚠️

**Attention** : si le serveur se lance *avant* que la connexion soit établie, vos requêtes MongoDB échoueront. Utilisez `await` ou `.then()` pour vous assurer que la connexion est établie d'abord.

</aside>

## Étape 2.2 — Créer le schéma Pokemon

1. Créez un dossier `models/`
2. Créez le fichier `models/pokemon.js`
3. Définissez un schéma Mongoose qui correspond à la structure des données :

```json
{
  "id": 25,                             // Number, requis, unique
  "name": {
    "english":  "Pikachu",              // String, requis
    "french":   "Pikachu",              // String, requis
    "japanese": "ピカチュウ",              // String
    "chinese":  "皮卡丘"                 // String
  },
  "type": ["Electric"],                 // [String], requis
  "base": {
    "HP": 35,                           // Number, requis
    "Attack": 55,                       // Number, requis
    "Defense": 40,                      // Number, requis
    "SpecialAttack": 50,                // Number
    "SpecialDefense": 50,               // Number
    "Speed": 90                         // Number
  }
}
```

Exportez le modèle avec `mongoose.model('Pokemon', pokemonSchema)`.

- Indice
    
    Pour déclarer un champ comme unique et requis : `{ type: Number, required: true, unique: true }`. Pour un tableau de strings : `{ type: [String] }`.
    

## Étape 2.3 — Script de seed (import des données)

Les 151 Pokémon existent dans `data/pokemons.json` mais pas encore dans MongoDB. Créez un script pour les importer.

1. Créez un fichier `db/seed.js`
2. Connectez-vous à MongoDB
3. Lisez les données depuis `data/pokemons.json` (avec un `import` ou `fs.readFileSync`)
4. Supprimez les anciens documents avec `Pokemon.deleteMany({})` (pour pouvoir relancer le script)
5. Insérez tous les Pokémon avec `Pokemon.insertMany()`
6. Affichez le nombre de Pokémon insérés et fermez la connexion

Ajoutez un script dans `package.json` :

```json
"scripts": {
  "dev": "nodemon index.js",
  "seed": "node db/seed.js"
}
```

<aside>
🎯

**Résultat attendu**

```
$ npm run seed
Connecté à MongoDB !
Collection vidée.
151 Pokémon insérés avec succès !
Connexion fermée.
```

</aside>

## Étape 2.4 — Vérifier dans le shell MongoDB

Ouvrez un terminal et lancez `mongosh` pour vérifier :

```jsx
use pokemons
db.pokemons.countDocuments()      // doit retourner 151
db.pokemons.findOne({ id: 25 })   // doit retourner Pikachu
```

<aside>
✅

**Checklist Partie 2**

- [ ]  Le serveur se connecte à MongoDB au démarrage
- [ ]  Le fichier `models/pokemon.js` exporte un modèle Mongoose valide
- [ ]  `npm run seed` insère 151 documents dans la collection `pokemons`
- [ ]  Vérification réussie dans `mongosh`
</aside>

---

# Partie 3 — CRUD complet avec Mongoose

`~4h` · Moyen

Maintenant que la base est remplie, remplacez les routes de la Partie 1 pour qu'elles lisent et écrivent dans MongoDB au lieu du fichier JSON.

## Étape 3.1 — READ : Lister et chercher

Modifiez vos routes dans `routes/pokemons.js` :

### GET /api/pokemons

- Retournez tous les Pokémon depuis MongoDB avec `Pokemon.find()`

### GET /api/pokemons/:id

- Cherchez un Pokémon par son champ `id` avec `Pokemon.findOne()`
- Retournez **404** si non trouvé
- Indice
    
    N'oubliez pas d'importer votre modèle `Pokemon` dans le fichier routes et d'utiliser `async/await` pour les requêtes Mongoose.
    

## Étape 3.2 — CREATE : Ajouter un Pokémon

### POST /api/pokemons

1. Récupérez les données du body (`req.body`)
2. Créez le Pokémon en base avec `Pokemon.create()`
3. Retournez le Pokémon créé avec le status **201**
4. En cas d'erreur (validation, doublon...), retournez une **400** avec le message d'erreur

<aside>
🎯

**Testez avec Thunder Client / curl**

```
POST http://localhost:3000/api/pokemons
Content-Type: application/json

{
  "id": 152,
  "name": { "english": "Chikorita", "french": "Germignon" },
  "type": ["Grass"],
  "base": { "HP": 45, "Attack": 49, "Defense": 65 }
}
```

</aside>

## Étape 3.3 — UPDATE : Modifier un Pokémon

### PUT /api/pokemons/:id

1. Cherchez le Pokémon par `id`
2. Mettez à jour ses champs avec les données du body
3. Utilisez `Pokemon.findOneAndUpdate()` avec l'option `{ new: true }` pour retourner le document mis à jour
4. Retournez **404** si le Pokémon n'existe pas
- Indice
    
    `findOneAndUpdate({ id: ... }, req.body, { new: true })` — l'option `new: true` fait que Mongoose retourne le document **après** modification (par défaut il retourne l'ancien).
    

## Étape 3.4 — DELETE : Supprimer un Pokémon

### DELETE /api/pokemons/:id

1. Supprimez le Pokémon avec `Pokemon.findOneAndDelete()`
2. Retournez **404** si le Pokémon n'existait pas
3. Retournez le status **204** (No Content) si la suppression a réussi

## Étape 3.5 — Gestion des erreurs

Vos routes peuvent planter (MongoDB down, données invalides...). Entourez chaque route d'un `try/catch` :

```jsx
router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

<aside>
✅

**Checklist Partie 3**

- [ ]  `GET /api/pokemons` retourne les données depuis MongoDB
- [ ]  `GET /api/pokemons/25` retourne Pikachu
- [ ]  `POST /api/pokemons` crée un Pokémon et retourne 201
- [ ]  `PUT /api/pokemons/25` modifie Pikachu
- [ ]  `DELETE /api/pokemons/25` supprime Pikachu et retourne 204
- [ ]  Les routes retournent 404 pour un Pokémon inexistant
- [ ]  Les erreurs sont capturées avec try/catch
</aside>

---

# Partie 4 — Filtres, tri et pagination

`~4h` · Moyen

Une API avec 151 résultats c'est gérable, mais avec 1000 ? 1 million ? Il faut pouvoir **filtrer**, **trier** et **paginer** les résultats.

## Étape 4.1 — Filtrer par type

Modifiez `GET /api/pokemons` pour accepter un query parameter `type`.

```
GET /api/pokemons?type=Fire      → tous les Pokémon de type Feu
GET /api/pokemons?type=Water     → tous les Pokémon de type Eau
GET /api/pokemons                → tous les Pokémon (pas de filtre)
```

1. Récupérez `req.query.type`
2. Si présent, ajoutez-le au filtre Mongoose : `Pokemon.find({ type: req.query.type })`
3. Si absent, retournez tout

## Étape 4.2 — Rechercher par nom

Ajoutez un query parameter `name` pour chercher un Pokémon par nom (partiel, insensible à la casse).

```
GET /api/pokemons?name=pika       → Pikachu
GET /api/pokemons?name=char       → Charmander, Charmeleon, Charizard
```

- Indice
    
    Utilisez l'opérateur `$regex` de MongoDB avec l'option `$options: 'i'` pour la recherche insensible à la casse :
    
    ```jsx
    { "name.english": { $regex: req.query.name, $options: 'i' } }
    ```
    

## Étape 4.3 — Trier les résultats

Ajoutez un query parameter `sort` pour trier les résultats.

```
GET /api/pokemons?sort=name.french     → tri alphabétique par nom français
GET /api/pokemons?sort=-base.HP        → tri par HP décroissant (le - = desc)
```

- Indice
    
    Mongoose accepte directement la syntaxe `.sort(req.query.sort)` avec le préfixe `-` pour l'ordre décroissant.
    

## Étape 4.4 — Paginer les résultats

Ajoutez les query parameters `page` et `limit`.

```
GET /api/pokemons?page=1&limit=20   → Pokémon 1 à 20
GET /api/pokemons?page=2&limit=20   → Pokémon 21 à 40
GET /api/pokemons?limit=10           → Les 10 premiers
```

1. Valeurs par défaut : `page = 1`, `limit = 50`
2. Calculez le `skip` : `(page - 1) * limit`
3. Chaînez `.skip(skip).limit(limit)` sur votre requête Mongoose
4. Retournez aussi les métadonnées de pagination dans la réponse

<aside>
🎯

**Format de réponse avec pagination**

```json
{
  "data": [],
  "page": 1,
  "limit": 20,
  "total": 151,
  "totalPages": 8
}
```

</aside>

- Indice
    
    Utilisez `Pokemon.countDocuments(filter)` pour obtenir le nombre total de résultats (avec les mêmes filtres que la requête principale).
    

## Étape 4.5 — Combiner les paramètres

Tous les filtres doivent pouvoir se combiner :

```
GET /api/pokemons?type=Fire&sort=-base.Attack&page=1&limit=5
```

→ Les 5 Pokémon Feu les plus puissants en attaque.

<aside>
✅

**Checklist Partie 4**

- [ ]  `?type=Fire` filtre par type
- [ ]  `?name=char` cherche par nom (insensible à la casse)
- [ ]  `?sort=-base.HP` trie par HP décroissant
- [ ]  `?page=2&limit=20` retourne la 2e page de 20 résultats
- [ ]  La réponse inclut `total` et `totalPages`
- [ ]  Les paramètres se combinent entre eux
</aside>

---

# Partie 5 — Authentification & Protéger les routes

`~3h` · Difficile

N'importe qui peut actuellement créer et supprimer des Pokémon. On va ajouter un système d'authentification avec **JWT** (JSON Web Token).

## Étape 5.1 — Modèle User

1. Installez `bcrypt` et `jsonwebtoken` :

```bash
npm install bcrypt jsonwebtoken
```

1. Créez `models/user.js` avec le schéma suivant :
- `username` — String, requis, unique
- `password` — String, requis (sera hashé)
1. Ajoutez un **middleware pre-save** sur le schéma pour hasher le mot de passe avant de l'enregistrer en base
- Indice
    
    Un middleware pre-save se définit comme ceci :
    
    ```jsx
    userSchema.pre('save', async function () {
      // this.password = le mot de passe en clair
      // hashez-le avec bcrypt.hash()
    });
    ```
    

## Étape 5.2 — Routes d'inscription et connexion

Créez `routes/auth.js` avec deux routes :

### POST /api/auth/register

1. Récupérez `username` et `password` du body
2. Créez l'utilisateur en base (le pre-save hashera le mdp)
3. Retournez **201** avec un message de succès

### POST /api/auth/login

1. Vérifiez que l'utilisateur existe
2. Comparez le mot de passe avec `bcrypt.compare()`
3. Si valide : générez un **JWT** avec `jsonwebtoken.sign()` et retournez-le
4. Si invalide : retournez **401**

<aside>
🎯

**Résultat attendu**

```
POST /api/auth/login
{ "username": "sacha", "password": "pikachu" }

→ Réponse : 200 OK
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

</aside>

- Indice
    
    Ajoutez une variable `JWT_SECRET` dans votre `.env`. Utilisez-la pour signer les tokens : `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })`
    

## Étape 5.3 — Middleware d'authentification

1. Créez `middleware/auth.js`
2. Récupérez le token dans le header `Authorization: Bearer <token>`
3. Vérifiez le token avec `jwt.verify()`
4. Si valide : ajoutez l'utilisateur décodé à `req.user` et appelez `next()`
5. Si invalide ou absent : retournez **401**

## Étape 5.4 — Protéger les routes sensibles

Appliquez votre middleware sur les routes qui modifient des données :

| **Route** | **Auth requise ?** |
| --- | --- |
| `GET /api/pokemons` | Non |
| `GET /api/pokemons/:id` | Non |
| `POST /api/pokemons` | **Oui** |
| `PUT /api/pokemons/:id` | **Oui** |
| `DELETE /api/pokemons/:id` | **Oui** |

```jsx
// Syntaxe : le middleware auth se place entre le chemin et le callback
router.post('/', auth, async (req, res) => { ... });
router.put('/:id', auth, async (req, res) => { ... });
router.delete('/:id', auth, async (req, res) => { ... });
```

<aside>
✅

**Checklist Partie 5**

- [ ]  `POST /api/auth/register` crée un utilisateur (mot de passe hashé en base)
- [ ]  `POST /api/auth/login` retourne un JWT
- [ ]  `POST /api/pokemons` sans token → 401
- [ ]  `POST /api/pokemons` avec token valide → 201
- [ ]  `DELETE /api/pokemons/:id` sans token → 401
- [ ]  Les routes GET restent publiques
</aside>

---

# Partie 6 — Pour aller plus loin

`~2h+` · Avancé

Cette partie est un ensemble de fonctionnalités bonus à implémenter dans l'ordre que vous voulez. Chaque fonctionnalité est indépendante.

## 6.A — Système de favoris

Ajoutez la possibilité pour un utilisateur connecté de marquer des Pokémon en **favoris**.

1. Ajoutez un champ `favorites: [Number]` au modèle User (tableau d'IDs de Pokémon)
2. Créez les routes :
    - `POST /api/favorites/:pokemonId` — ajouter un favori (authentifié)
    - `DELETE /api/favorites/:pokemonId` — retirer un favori (authentifié)
    - `GET /api/favorites` — lister mes Pokémon favoris (authentifié)
- Indice
    
    Utilisez `$addToSet` pour ajouter sans doublon et `$pull` pour retirer un élément d'un tableau.
    

## 6.B — Statistiques avancées avec l'agrégation

Créez une route `GET /api/stats` qui utilise le **pipeline d'agrégation** de MongoDB pour retourner :

- Le nombre de Pokémon par type
- La moyenne des HP par type
- Le Pokémon avec le plus d'attaque
- Le Pokémon avec le plus de HP
- Indice
    
    Explorez `Pokemon.aggregate([ ... ])` avec les étapes `$group`, `$sort`, `$avg`, `$max`.
    

## 6.C — Validation avancée

Améliorez la validation des données à la création / modification d'un Pokémon :

- Les types doivent faire partie d'une liste autorisée : `Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy`
- Les stats (`HP`, `Attack`...) doivent être entre **1** et **255**
- Le champ `id` doit être un entier positif
- Les messages d'erreur doivent être **clairs** et en **français**
- Indice
    
    Utilisez l'option `enum` pour les types et les validateurs `min` / `max` pour les stats dans votre schéma Mongoose.
    

## 6.D — Route d'équipe Pokémon

Créez un système où chaque utilisateur peut constituer une **équipe** de 6 Pokémon maximum.

1. Créez un modèle `Team` avec :
    - `user` — référence vers le User
    - `name` — nom de l'équipe
    - `pokemons` — tableau de références vers les Pokemon (max 6)
2. Créez les routes :
    - `POST /api/teams` — créer une équipe
    - `GET /api/teams` — lister mes équipes
    - `GET /api/teams/:id` — détail d'une équipe (avec les données complètes des Pokémon)
    - `PUT /api/teams/:id` — modifier une équipe
    - `DELETE /api/teams/:id` — supprimer une équipe
- Indice
    
    Utilisez `populate()` de Mongoose pour récupérer les données complètes des Pokémon quand vous affichez une équipe.
    

<aside>
✅

**Checklist Partie 6**

- [ ]  **6.A** — Ajouter/retirer/lister des favoris
- [ ]  **6.B** — Route /api/stats avec agrégation MongoDB
- [ ]  **6.C** — Validation des types et des stats
- [ ]  **6.D** — CRUD complet des équipes avec populate
</aside>

---

# Récapitulatif

| **Partie** | **Sujet** | **Durée** | **Difficulté** |
| --- | --- | --- | --- |
| 1 | Premières routes Express | ~2h | Facile |
| 2 | Connexion MongoDB & Modèle Mongoose | ~3h | Facile |
| 3 | CRUD complet avec Mongoose | ~4h | Moyen |
| 4 | Filtres, tri et pagination | ~4h | Moyen |
| 5 | Authentification JWT | ~3h | Difficile |
| 6 | Pour aller plus loin | ~2h+ | Avancé |

<aside>
💪

**Bon courage !** N'hésitez pas à relire le cours, chercher dans la documentation de [Mongoose](https://mongoosejs.com/docs/) et [Express](https://expressjs.com/fr/), et à demander de l'aide si vous bloquez.

</aside>