import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../../utils/db";
import { getAllPokemons } from "../../../../../../utils/helpers/pokemons/getAllPokemons";
import { processPokemons } from "../../../../../../utils/helpers/pokemons/processPokemon";
import { Pokemon } from "../../../../../../utils/models/Pokemons";
import { getUser } from "../../../../../../utils/helpers/users/getUser";
import { checkIdOrName } from "../../../../../../utils/helpers/validation/checkIdOrName";
import { verifyAuthorization } from "../../../../../../utils/helpers/users/validation/verifyAuthorization";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isTokenValid = await verifyAuthorization(req);

  if (isTokenValid.isTokenValid === false) {
    return res.status(isTokenValid.statusCode).json({ message: isTokenValid.error });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  const pokemonsCollection = db.collection("pokemons");

  const { userId } = req.query;

  const checkedUserIdOrName = checkIdOrName(userId);

  if ('isInvalid' in checkedUserIdOrName) {
    return res.status(checkedUserIdOrName.statusCode).json({ message: checkedUserIdOrName.message });
  }

  const userData = await getUser(usersCollection, checkedUserIdOrName.checkedIdOrName);

  if ('error' in userData) {
    return res.status(userData.statusCode).json({ message: userData.error });
  }

  if (req.method === 'GET') {

    if (userData.pokedex!.length === 0) {
      return res.status(404).json({ message: "User has no Pokemons" });
    }
    const { userPokemons, userPokemonsLenght } = await getAllPokemons(userData.pokedex!, pokemonsCollection);

    if (!userPokemons) {
      return res.status(400).json({ message: "Error getting all Pokemons" });
    }

    return res.status(200).json({ userId: userData.id, pokemonsFetched: userPokemonsLenght, userPokemons });
  }

  else if (req.method === 'POST') {
    const pokemon: Partial<Pokemon> = {
      name: req.body.name.trim().toLowerCase(),
      userId: userData.id,
      photo: '',
      type: req.body.type,
      weight: req.body.weight,
      abilities: req.body.abilities
    };

    const processedPokemon = await processPokemons(pokemon, userData, usersCollection, pokemonsCollection);

    return res.status(processedPokemon.statusCode).json(processedPokemon);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}