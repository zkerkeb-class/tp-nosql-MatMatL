import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/pokemons -> liste complète avec filtres, tri, pagination (READ)
router.get('/', async (req, res) => {
  try {
    const { type, name, sort, page = 1, limit = 50 } = req.query;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.max(parseInt(limit, 10) || 50, 1);
    const skip = (numericPage - 1) * numericLimit;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (name && name.trim()) {
      // Recherche permissive : insensible à la casse, partielle, dans tous les noms
      const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { 'name.french': regex },
        { 'name.english': regex },
        { 'name.japanese': regex },
        { 'name.chinese': regex },
      ].filter((_, i, arr) => arr[i]); // garde toutes les clés (champs optionnels OK)
    }

    let query = Pokemon.find(filter);

    if (sort) {
      query = query.sort(sort);
    }

    const total = await Pokemon.countDocuments(filter);
    const pokemons = await query.skip(skip).limit(numericLimit);

    res.json({
      data: pokemons,
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit) || 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pokemons/:id -> un seul Pokémon par id (READ)
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pokemon = await Pokemon.findOne({ id });

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pokemons -> créer un Pokémon (CREATE) — auth requise
router.post('/', auth, async (req, res) => {
  try {
    const pokemon = await Pokemon.create(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    // Erreur de validation, doublon, etc.
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pokemons/:id -> mettre à jour un Pokémon (UPDATE) — auth requise
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const updated = await Pokemon.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/pokemons/:id -> supprimer un Pokémon (DELETE) — auth requise
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const deleted = await Pokemon.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    // 204 No Content : pas de body en réponse
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

