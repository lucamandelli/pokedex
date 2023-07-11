import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../../../utils/db";
import { Pokemon } from "../../../../../../../utils/models/Pokemons";
import { processManyPokemons } from "../../../../../../../utils/helpers/pokemons/processManyPokemons";
import { checkIdOrName } from "../../../../../../../utils/helpers/validation/checkIdOrName";
import { getUser } from "../../../../../../../utils/helpers/users/getUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const dataArray: Partial<Pokemon>[] = req.body.map((pokemon: Partial<Pokemon>) => ({
    name: pokemon.name?.trim().toLowerCase(),
    userId: userData.id,
    photo: '',
    type: pokemon.type,
    weight: pokemon.weight,
    abilities: pokemon.abilities
  }));

  const { createdPokemons, failedPokemons } = await processManyPokemons(dataArray, userData, usersCollection, pokemonsCollection);

  if (createdPokemons.length === 0) {
    return res.status(400).json({ message: "Error creating all Pokemons", failedPokemons });
  }

  return res.status(201).json({
    userOwner: userData.id,
    message: `${createdPokemons.length} Pokemons created successfully`,
    createdPokemons: createdPokemons,
    failedPokemons: failedPokemons
  });
}
