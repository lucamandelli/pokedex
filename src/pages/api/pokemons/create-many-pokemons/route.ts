import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../utils/db";
import { Pokemon } from "../../../../../utils/models/Pokemons";
import { processManyPokemons } from "../../../../../utils/helpers/pokemons/processManyPokemons";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const dataArray: Partial<Pokemon>[] = req.body.map((pokemon: Partial<Pokemon>) => ({
    name: pokemon.name?.trim().toLowerCase(),
    photo: '',
    type: pokemon.type,
    weight: pokemon.weight,
    abilities: pokemon.abilities
  }));

  const { createdPokemons, failedPokemons } = await processManyPokemons(dataArray, collection);

  if (createdPokemons.length === 0) {
    return res.status(400).json({ message: "Error creating all Pokemons", failedPokemons });
  }

  return res.status(201).json({
    message: `${createdPokemons.length} Pokemons created successfully`,
    createdPokemons: createdPokemons,
    failedPokemons: failedPokemons
  });
}
