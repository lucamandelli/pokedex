import { Pokemon } from "../../models/Pokemons";

export function validatePokemon(pokemon: Partial<Pokemon>): string | null {
  if (!pokemon || !pokemon.name || !pokemon.type || !pokemon.weight || !pokemon.abilities) {
    return 'Data is invalid.';
  }
  return null;
}
