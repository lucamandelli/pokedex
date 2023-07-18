import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/db"
import { getPokemon } from "@/utils/helpers/pokemons/getPokemon";
import { checkIdOrName } from "@/utils/helpers/validation/checkIdOrName";
import { getUser } from "@/utils/helpers/users/getUser";
import { Pokemon } from "@/utils/models/Pokemons";
import { updatePokemon } from "@/utils/helpers/pokemons/updatePokemon";
import { deletePokemon } from "@/utils/helpers/pokemons/deletePokemon";
import { verifyAuthorization } from "@/utils/helpers/users/validation/verifyAuthorization";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isTokenValid = await verifyAuthorization(req);

  if (isTokenValid.isTokenValid === false) {
    return res.status(isTokenValid.statusCode).json({ message: isTokenValid.error });
  }
  const db = await connectToDatabase();
  const pokemonCollection = db.collection("pokemons");
  const usersCollection = db.collection("users");

  const { userId, pokemonId } = req.query;

  const checkedUserIdOrName = checkIdOrName(userId);
  const checkedPokemonIdOrName = checkIdOrName(pokemonId);

  if ('isInvalid' in checkedUserIdOrName) {
    return res.status(checkedUserIdOrName.statusCode).json({ message: checkedUserIdOrName.message });
  }

  if ('isInvalid' in checkedPokemonIdOrName) {
    return res.status(checkedPokemonIdOrName.statusCode).json({ message: checkedPokemonIdOrName.message });
  }

  if (req.method === 'GET') {
    try {
      const userData = await getUser(usersCollection, checkedUserIdOrName.checkedIdOrName);

      if ('error' in userData) {
        return res.status(userData.statusCode).json({ message: userData.error });
      }

      const pokemonData = await getPokemon(userData.pokedex!, pokemonCollection, checkedPokemonIdOrName.checkedIdOrName);

      if ('error' in pokemonData) {
        return res.status(pokemonData.statusCode).json({ message: pokemonData.error });
      }

      return res.status(200).json({ user: userData, pokemon: pokemonData });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === 'PUT') {
    const pokemonUpdate: Partial<Pokemon> = req.body;
    const processedPokemonUpdated = await updatePokemon(pokemonUpdate, usersCollection, pokemonCollection, checkedUserIdOrName.checkedIdOrName, checkedPokemonIdOrName.checkedIdOrName);

    if ('error' in processedPokemonUpdated) {
      return res.status(processedPokemonUpdated.statusCode).json({ message: processedPokemonUpdated.error });
    }

    return res.status(processedPokemonUpdated.statusCode).json({ message: processedPokemonUpdated.message });
  } else if (req.method === 'DELETE') {
    const deletedPokemon = await deletePokemon(usersCollection, pokemonCollection, checkedUserIdOrName.checkedIdOrName, checkedPokemonIdOrName.checkedIdOrName);

    if ('error' in deletedPokemon) {
      return res.status(deletedPokemon.statusCode).json({ message: deletedPokemon.error });
    }

    return res.status(deletedPokemon.statusCode).json({ message: deletedPokemon.message });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }

}