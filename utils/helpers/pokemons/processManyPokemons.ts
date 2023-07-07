import { Pokemon } from "../../models/Pokemons";
import { insertPokemon } from "./insertPokemon";
import { setPokemonPhoto } from "./setPokemonPhoto";
import { validatePokemon } from "./validatePokemon";

export async function processManyPokemons(dataArray: Partial<Pokemon>[], collection: any): Promise<{ createdPokemons: Pokemon[], failedPokemons: any[] }> {
  const createdPokemons: Pokemon[] = [];
  const failedPokemons: any[] = [];

  for (let data of dataArray) {
    const validationError = validatePokemon(data);
    if (validationError) {
      failedPokemons.push({ dataReceived: data, reason: validationError });
      continue;
    }

    const photoError = await setPokemonPhoto(data);
    if (photoError) {
      failedPokemons.push({ name: data.name, reason: photoError });
      continue;
    }

    const insertionError = await insertPokemon(data as Pokemon, collection);
    if (insertionError) {
      failedPokemons.push({ name: data.name, reason: insertionError });
      continue;
    }

    createdPokemons.push(data as Pokemon);
  }

  return { createdPokemons, failedPokemons };
}
