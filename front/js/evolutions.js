/**
 * Chaînes d'évolution Gen 1 (151 Pokémon) — préévolution / évolution
 * Chaque chaîne est un tableau d'ids dans l'ordre d'évolution.
 */
const EVOLUTION_CHAINS = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18],
  [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30, 31], [32, 33, 34],
  [35, 36], [37, 38], [39, 40], [41, 42], [43, 44, 45], [46, 47], [48, 49],
  [50, 51], [52, 53], [54, 55], [56, 57], [58, 59], [60, 61, 62], [63, 64, 65],
  [66, 67, 68], [69, 70, 71], [72, 73], [74, 75, 76], [77, 78], [79, 80],
  [81, 82], [84, 85], [86, 87], [88, 89], [90, 91], [92, 93, 94], [96, 97],
  [98, 99], [100, 101], [102, 103], [104, 105], [109, 110], [111, 112],
  [116, 117], [118, 119], [120, 121], [129, 130],   [133, 134, 135, 136], // Eevee → Vaporeon, Jolteon, Flareon
  [138, 139], [140, 141], [147, 148, 149],
];

function getEvolutionChain(pokemonId) {
  const id = parseInt(pokemonId, 10);
  for (const chain of EVOLUTION_CHAINS) {
    const idx = chain.indexOf(id);
    if (idx === -1) continue;
    const nextIds = idx < chain.length - 1 ? chain.slice(idx + 1) : [];
    return {
      chain,
      index: idx,
      prev: idx > 0 ? chain[idx - 1] : null,
      next: nextIds,
    };
  }
  return { chain: [], index: -1, prev: null, next: [] };
}
