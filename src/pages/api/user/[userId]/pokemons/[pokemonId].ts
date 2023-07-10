import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../../utils/db";
import { getPokemon } from "../../../../../../utils/helpers/pokemons/getPokemon";
import { checkIdOrName } from "../../../../../../utils/helpers/validation/checkIdOrName";
import { getUser } from "../../../../../../utils/helpers/users/getUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const pokemonCollection = db.collection("pokemons");
  const usersCollection = db.collection("users");

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { userId, pokemonId } = req.query;
  try {
    const checkedUserIdOrName = checkIdOrName(userId);
    const checkedPokemonIdOrName = checkIdOrName(pokemonId);

    if ('isInvalid' in checkedUserIdOrName) {
      return res.status(checkedUserIdOrName.statusCode).json({ message: checkedUserIdOrName.message });
    }

    if ('isInvalid' in checkedPokemonIdOrName) {
      return res.status(checkedPokemonIdOrName.statusCode).json({ message: checkedPokemonIdOrName.message });
    }

    const userData = await getUser(usersCollection, checkedUserIdOrName.checkedIdOrName);

    if ('error' in userData) {
      return res.status(userData.statusCode).json({ message: userData.error });
    }

    if (userData.pokedex!.length === 0) {
      return res.status(404).json({ message: "User has no Pokemons" });
    }

    const pokemonData = await getPokemon(userData.pokedex!, pokemonCollection, checkedPokemonIdOrName.checkedIdOrName);

    if ('error' in pokemonData) {
      return res.status(pokemonData.statusCode).json({ message: pokemonData.error });
    }

    return res.status(200).json({ user: userData, pokemon: pokemonData });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}