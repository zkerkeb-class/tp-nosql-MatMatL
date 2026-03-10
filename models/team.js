import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const teamSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }],
  },
  { timestamps: true }
);

teamSchema.pre('save', async function () {
  if (this.pokemons && this.pokemons.length > 6) {
    throw new Error('Une équipe ne peut pas contenir plus de 6 Pokémon');
  }
});

const Team = model('Team', teamSchema);
export default Team;
