import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Types autorisés (Partie 6.C)
const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
  'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
  'Dragon', 'Dark', 'Steel', 'Fairy',
];

const statRange = { min: 1, max: 255 };
const statMsg = 'doit être entre 1 et 255';

const nameSchema = new Schema(
  {
    english: { type: String, required: [true, 'Le nom anglais est requis'] },
    french: { type: String, required: [true, 'Le nom français est requis'] },
    japanese: { type: String },
    chinese: { type: String },
  },
  { _id: false }
);

const baseStatsSchema = new Schema(
  {
    HP: {
      type: Number,
      required: [true, 'HP est requis'],
      min: [statRange.min, `HP ${statMsg}`],
      max: [statRange.max, `HP ${statMsg}`],
    },
    Attack: {
      type: Number,
      required: [true, 'Attack est requis'],
      min: [statRange.min, `Attack ${statMsg}`],
      max: [statRange.max, `Attack ${statMsg}`],
    },
    Defense: {
      type: Number,
      required: [true, 'Defense est requis'],
      min: [statRange.min, `Defense ${statMsg}`],
      max: [statRange.max, `Defense ${statMsg}`],
    },
    SpecialAttack: {
      type: Number,
      min: [statRange.min, `SpecialAttack ${statMsg}`],
      max: [statRange.max, `SpecialAttack ${statMsg}`],
    },
    SpecialDefense: {
      type: Number,
      min: [statRange.min, `SpecialDefense ${statMsg}`],
      max: [statRange.max, `SpecialDefense ${statMsg}`],
    },
    Speed: {
      type: Number,
      min: [statRange.min, `Speed ${statMsg}`],
      max: [statRange.max, `Speed ${statMsg}`],
    },
  },
  { _id: false }
);

const pokemonSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'L\'id est requis'],
    unique: true,
    min: [1, 'L\'id doit être un entier positif'],
    validate: {
      validator: Number.isInteger,
      message: 'L\'id doit être un entier',
    },
  },
  name: { type: nameSchema, required: [true, 'Le nom est requis'] },
  type: {
    type: [String],
    required: [true, 'Au moins un type est requis'],
    enum: {
      values: POKEMON_TYPES,
      message: `Les types doivent être parmi : ${POKEMON_TYPES.join(', ')}`,
    },
  },
  base: { type: baseStatsSchema, required: [true, 'Les stats de base sont requises'] },
  image: { type: String },
});

const Pokemon = model('Pokemon', pokemonSchema);

export default Pokemon;

