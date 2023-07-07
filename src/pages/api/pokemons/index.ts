import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { Pokemon } from "../../../../utils/models/Pokemons";
import { processPokemons } from "../../../../utils/helpers/pokemons/processPokemon";
import { getAllPokemons } from "../../../../utils/helpers/pokemons/getAllPokemons";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  if (req.method === 'GET') {
    const { pokemons, pokemonsLenght } = await getAllPokemons(collection);

    if (!pokemons) {
      return res.status(400).json({ message: "Error getting all Pokemons" });
    }

    return res.status(200).json({ pokemonsFetched: pokemonsLenght, pokemons });
  }

  else if (req.method === 'POST') {
    const data: Partial<Pokemon> = {
      name: req.body.name.trim().toLowerCase(),
      photo: '',
      type: req.body.type,
      weight: req.body.weight,
      abilities: req.body.abilities
    };

    const processedPokemon = await processPokemons(data, collection);

    return res.status(processedPokemon.statusCode).json(processedPokemon);
  }
  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}