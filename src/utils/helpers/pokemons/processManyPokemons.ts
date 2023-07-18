import { Collection } from "mongodb";
import { Pokemon } from "../../models/Pokemons";
import { User } from "../../models/User";
import { insertPokemon } from "./validation/insertPokemon";
import { setPokemonPhoto } from "./validation/setPokemonPhoto";
import { validatePokemon } from "./validation/validatePokemon";

export async function processManyPokemons(pokemonsArray: Partial<Pokemon>[], user: Partial<User>, usersCollection: Collection, pokemonCollection: Collection): Promise<{ createdPokemons: Pokemon[], failedPokemons: any[] }> {
  const createdPokemons: Pokemon[] = [];
  const failedPokemons: any[] = [];

  for (let pokemon of pokemonsArray) {
    const validationError = await validatePokemon(pokemon, user.pokedex!, pokemonCollection);

    if (validationError) {
      failedPokemons.push({ dataReceived: pokemon, reason: validationError });
      continue;
    }

    const photoError = await setPokemonPhoto(pokemon);
    if (photoError) {
      failedPokemons.push({ name: pokemon.name, reason: photoError });
      continue;
    }

    const insertionError = await insertPokemon(pokemon as Pokemon, usersCollection, pokemonCollection);

    if (insertionError) {
      failedPokemons.push({ name: pokemon.name, reason: insertionError });
      continue;
    }

    createdPokemons.push(pokemon as Pokemon);
  }

  return { createdPokemons, failedPokemons };
}
