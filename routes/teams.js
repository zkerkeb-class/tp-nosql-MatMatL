import express from 'express';
import mongoose from 'mongoose';
import Team from '../models/team.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

const MAX_POKEMONS = 6;

// Convertit une liste d'ids numériques en ObjectIds (pour populate)
async function resolvePokemonIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const numIds = ids.map((id) => parseInt(id, 10)).filter((id) => !Number.isNaN(id));
  const docs = await Pokemon.find({ id: { $in: numIds } });
  return docs.map((p) => p._id);
}

// POST /api/teams — créer une équipe
router.post('/', async (req, res) => {
  try {
    const { name, pokemons: rawPokemons = [] } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Le nom de l\'équipe est requis' });
    }
    const pokemonIds = await resolvePokemonIds(rawPokemons);
    if (pokemonIds.length > MAX_POKEMONS) {
      return res.status(400).json({ error: 'Une équipe ne peut pas contenir plus de 6 Pokémon' });
    }
    const team = await Team.create({
      user: req.user.id,
      name: name.trim(),
      pokemons: pokemonIds,
    });
    const populated = await Team.findById(team._id).populate('pokemons');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/teams — lister mes équipes
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user.id })
      .populate('pokemons')
      .sort({ updatedAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id — détail d'une équipe (données complètes des Pokémon)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    const team = await Team.findOne({ _id: id, user: req.user.id }).populate('pokemons');
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/teams/:id — modifier une équipe
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    const team = await Team.findOne({ _id: id, user: req.user.id });
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    const { name, pokemons: rawPokemons } = req.body;
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Le nom de l\'équipe ne peut pas être vide' });
      }
      team.name = name.trim();
    }
    if (rawPokemons !== undefined) {
      const pokemonIds = await resolvePokemonIds(rawPokemons);
      if (pokemonIds.length > MAX_POKEMONS) {
        return res.status(400).json({ error: 'Une équipe ne peut pas contenir plus de 6 Pokémon' });
      }
      team.pokemons = pokemonIds;
    }
    await team.save();
    const populated = await Team.findById(team._id).populate('pokemons');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/teams/:id — supprimer une équipe
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    const deleted = await Team.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
