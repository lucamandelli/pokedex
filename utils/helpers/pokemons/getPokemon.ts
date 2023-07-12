import { Pokemon } from "../../models/Pokemons";
import { Collection, ObjectId } from "mongodb";

export async function getPokemon(userPokedex: string[], pokemonsCollection: Collection, pokemonId: string): Promise<Pokemon | { error: string, statusCode: number }> {
  let query;

  if (ObjectId.isValid(pokemonId)) {
    query = { _id: new ObjectId(pokemonId) };
  } else {
    return {
      error: "Pokemon not found",
      statusCode: 404
    };
  }

  if (userPokedex.length === 0) {
    return {
      error: "User has no Pokemons",
      statusCode: 404
    }
  }

  if (!userPokedex.map(String).includes(pokemonId)) {
    return {
      error: "Pokemon not in your pokédex",
      statusCode: 404
    };
  }

  const pokemon = await pokemonsCollection.findOne(query);

  if (!pokemon) {
    return {
      error: "Error getting Pokemon",
      statusCode: 404
    }
  }

  return {
    id: pokemon._id.toString(),
    userId: pokemon.userId,
    name: pokemon.name,
    photo: pokemon.photo,
    type: pokemon.type,
    weight: pokemon.weight,
    abilities: pokemon.abilities
  };
}
