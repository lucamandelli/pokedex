import { Pokemon } from "../../models/Pokemons";
import { insertPokemon } from "./insertPokemon";
import { setPokemonPhoto } from "./setPokemonPhoto";
import { validatePokemon } from "./validatePokemon";

export async function processPokemons(data: Partial<Pokemon>, collection: any) {
  const validationError = validatePokemon(data);
  if (validationError) {
    return { statusCode: 400, dataReceived: data, reason: validationError };
  }

  const photoError = await setPokemonPhoto(data);
  if (photoError) {
    return { statusCode: 400, name: data.name, reason: photoError };
  }

  const insertionError = await insertPokemon(data as Pokemon, collection);
  if (insertionError) {
    return { statusCode: 400, name: data.name, reason: insertionError };
  }

  return { statusCode: 201, message: "Pokemon created successfully", pokemon: data };
}
