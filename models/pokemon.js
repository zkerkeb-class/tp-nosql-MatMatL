import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const nameSchema = new Schema(
  {
    english: { type: String, required: true },
    french: { type: String, required: true },
    japanese: { type: String },
    chinese: { type: String },
  },
  { _id: false }
);

const baseStatsSchema = new Schema(
  {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    SpecialAttack: { type: Number },
    SpecialDefense: { type: Number },
    Speed: { type: Number },
  },
  { _id: false }
);

const pokemonSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: nameSchema, required: true },
  type: { type: [String], required: true },
  base: { type: baseStatsSchema, required: true },
  image: { type: String }, // présent dans les données JSON
});

const Pokemon = model('Pokemon', pokemonSchema);

export default Pokemon;

