import express from 'express';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes favoris sont protégées
router.use(auth);

// GET /api/favorites — lister mes Pokémon favoris
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.favorites?.length) {
      return res.json([]);
    }
    const pokemons = await Pokemon.find({ id: { $in: user.favorites } });
    // Garder l'ordre du tableau favorites
    const orderMap = new Map(user.favorites.map((id, i) => [id, i]));
    pokemons.sort((a, b) => orderMap.get(a.id) - orderMap.get(b.id));
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/favorites/:pokemonId — ajouter un favori (sans doublon)
router.post('/:pokemonId', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId, 10);
    if (Number.isNaN(pokemonId)) {
      return res.status(400).json({ error: 'ID de Pokémon invalide' });
    }
    const exists = await Pokemon.findOne({ id: pokemonId });
    if (!exists) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { favorites: pokemonId },
    });
    res.status(201).json({ message: 'Favori ajouté', pokemonId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/favorites/:pokemonId — retirer un favori
router.delete('/:pokemonId', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId, 10);
    if (Number.isNaN(pokemonId)) {
      return res.status(400).json({ error: 'ID de Pokémon invalide' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: pokemonId } },
      { new: true }
    );
    res.status(200).json({ message: 'Favori retiré', pokemonId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
