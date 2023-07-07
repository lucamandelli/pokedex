import { Pokemon } from "../../models/Pokemons";

export async function validatePokemon(pokemon: Partial<Pokemon>, collection: any): Promise<string | null> {
  if (!pokemon || !pokemon.name || !pokemon.type || !pokemon.weight || !pokemon.abilities) {
    return 'Data is invalid.';
  }

  const pokemonAlreadyExists = await collection.findOne({ name: pokemon.name });

  if (pokemonAlreadyExists) {
    return 'Pokemon is already in your Pokédex.';
  }

  return null;
}
