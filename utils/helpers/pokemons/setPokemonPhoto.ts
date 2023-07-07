import { Pokemon } from "../../models/Pokemons";
import { fetchPokemonImage } from "../../handlers/fetchPokemonImage";

export async function setPokemonPhoto(pokemon: Partial<Pokemon>): Promise<string | null> {
  const photo = await fetchPokemonImage(pokemon.name!.trim().toLowerCase());
  if (photo === '') {
    return `Pokemon does not exist.`;
  }
  pokemon.photo = photo;
  return null;
}
