import { ObjectId } from "mongodb";
import { getUser } from "../users/getUser";
import { getAllPokemons } from "./getAllPokemons";

export async function deletePokemon(usersCollection: any, pokemonCollection: any, userId: string, pokemonId: string) {
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

  try {
    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $pull: { pokedex: new ObjectId(pokemonId) } });

    await pokemonCollection.deleteOne({ _id: new ObjectId(pokemonId) });

    return {
      message: "Pokemon deleted successfully",
      statusCode: 200
    };
  } catch (error) {
    return {
      error: "Database operation failed.",
      statusCode: 500
    };
  }
}