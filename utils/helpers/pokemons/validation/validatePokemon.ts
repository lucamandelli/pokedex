import { Pokemon } from "../../../models/Pokemons";
import { getAllPokemons } from "../getAllPokemons";

export async function validatePokemon(pokemon: Partial<Pokemon>, userPokedex: string[], pokemonCollection: any): Promise<string | null> {
  if (!pokemon || !pokemon.name || !pokemon.type || !pokemon.weight || !pokemon.abilities) {
    return 'Data is invalid.';
  }
  const { userPokemons } = await getAllPokemons(userPokedex, pokemonCollection);

  const pokemonAlreadyExists = userPokemons.find(p => p.name === pokemon.name);

  if (pokemonAlreadyExists) {
    return 'Pokemon is already in your Pokédex.';
  }

  return null;
}
