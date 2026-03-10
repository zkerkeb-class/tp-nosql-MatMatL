// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import statsRouter from './routes/stats.js';
import teamsRouter from './routes/teams.js';
import connectDB from './db/connect.js';


const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.use(express.json());

// Front (dossier front/ servi à la racine)
app.use(express.static('front'));

// Routes auth (Partie 5)
app.use('/api/auth', authRouter);

// Routes Pokémon
app.use('/api/pokemons', pokemonsRouter);

// Favoris (Partie 6.A) — authentification requise
app.use('/api/favorites', favoritesRouter);

// Statistiques (Partie 6.B)
app.use('/api/stats', statsRouter);

// Équipes (Partie 6.D) — authentification requise
app.use('/api/teams', teamsRouter);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur :', error.message);
    process.exit(1);
  }
};

start();
