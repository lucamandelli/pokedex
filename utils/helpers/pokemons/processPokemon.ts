import { Collection } from "mongodb";
import { Pokemon } from "../../models/Pokemons";
import { User } from "../../models/User";
import { insertPokemon } from "./validation/insertPokemon";
import { setPokemonPhoto } from "./validation/setPokemonPhoto";
import { validatePokemon } from "./validation/validatePokemon";

export async function processPokemons(pokemon: Partial<Pokemon>, user: Partial<User>, usersCollection: Collection, pokemonCollection: Collection) {
  const validationError = await validatePokemon(pokemon, user.pokedex!, pokemonCollection);

  if (validationError) {
    return { statusCode: 400, dataReceived: pokemon, reason: validationError };
  }

  const photoError = await setPokemonPhoto(pokemon);
  if (photoError) {
    return { statusCode: 400, name: pokemon.name, reason: photoError };
  }

  const insertionError = await insertPokemon(pokemon as Pokemon, usersCollection, pokemonCollection);

  if (insertionError) {
    return { statusCode: 400, name: pokemon.name, reason: insertionError };
  }

  return { statusCode: 201, message: "Pokemon created successfully", userIdOwner: pokemon.userId, pokemon: pokemon };
}
