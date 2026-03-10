import express from 'express';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

// GET /api/stats — statistiques avancées (agrégation MongoDB, Partie 6.B)
router.get('/', async (req, res) => {
  try {
    const total = await Pokemon.countDocuments({});

    // Nombre de Pokémon par type ($unwind pour un type par ligne, puis $group)
    const countByType = await Pokemon.aggregate([
      { $unwind: '$type' },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]);

    // Moyenne des HP par type
    const avgHpByType = await Pokemon.aggregate([
      { $unwind: '$type' },
      { $group: { _id: '$type', avgHp: { $avg: '$base.HP' } } },
      { $sort: { avgHp: -1 } },
      { $project: { type: '$_id', avgHp: { $round: ['$avgHp', 2] }, _id: 0 } },
    ]);

    // Pokémon avec le plus d'attaque
    const [maxAttackResult] = await Pokemon.aggregate([
      { $sort: { 'base.Attack': -1 } },
      { $limit: 1 },
      { $project: { __v: 0 } },
    ]);

    // Pokémon avec le plus de HP
    const [maxHpResult] = await Pokemon.aggregate([
      { $sort: { 'base.HP': -1 } },
      { $limit: 1 },
      { $project: { __v: 0 } },
    ]);

    res.json({
      total,
      countByType,
      avgHpByType,
      maxAttack: maxAttackResult || null,
      maxHp: maxHpResult || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
