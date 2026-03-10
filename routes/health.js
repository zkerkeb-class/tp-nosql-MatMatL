import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/health — pour CI, hébergeur, etc.
router.get('/', (req, res) => {
  const mongo = mongoose.connection.readyState === 1;
  res.json({ ok: true, mongo });
});

export default router;
