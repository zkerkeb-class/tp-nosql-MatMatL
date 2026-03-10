import mongoose from 'mongoose';

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('La variable d’environnement MONGODB_URI est manquante.');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB !');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error.message);
    throw error;
  }
}

export default connectDB;

