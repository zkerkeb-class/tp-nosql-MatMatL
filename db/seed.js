import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Pokemon from '../models/pokemon.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pokemonsFilePath = path.join(__dirname, '..', 'data', 'pokemons.json');

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('La variable d’environnement MONGODB_URI est manquante.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB !');

    const fileContent = fs.readFileSync(pokemonsFilePath, 'utf-8');
    const pokemons = JSON.parse(fileContent);

    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    const result = await Pokemon.insertMany(pokemons);
    console.log(`${result.length} Pokémon insérés avec succès !`);
  } catch (error) {
    console.error('Erreur lors du seed :', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée.');
    process.exit(0);
  }
}

seed();

