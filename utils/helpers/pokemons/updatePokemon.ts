import { Collection, ObjectId } from "mongodb";
import { Pokemon } from "../../models/Pokemons";
import { getUser } from "../users/getUser";
import { getAllPokemons } from "./getAllPokemons";

export async function updatePokemon(updatedPokemon: Partial<Pokemon>, usersCollection: Collection, pokemonCollection: Collection, userId: string, pokemonId: string) {
  const userData = await getUser(usersCollection, userId);

  if ('error' in userData) {
    return {
      error: userData.error,
      statusCode: userData.statusCode
    };
  }

  if (userData.pokedex!.length === 0) {
    return {
      error: "User has no Pokemons",
      statusCode: 404
    };
  }

  const { userPokemons } = await getAllPokemons(userData.pokedex!, pokemonCollection);

  if (!userPokemons) {
    return {
      error: "Error getting user Pokemons",
      statusCode: 400
    };
  }

  const pokemonExists = userPokemons.find(p => p.id.toString() === pokemonId);

  if (!pokemonExists) {
    return {
      error: "Pokemon not found in your Pokédex",
      statusCode: 404
    };
  }

  const { id, name, ...updatedProperties } = updatedPokemon;

  try {
    await pokemonCollection.updateOne({ _id: new ObjectId(pokemonId) }, { $set: updatedProperties });

    return {
      message: "Pokemon Updated Successfully",
      statusCode: 200
    }
  } catch (error) {
    return {
      error: "Database update failed.",
      statusCode: 500
    };
  }
}