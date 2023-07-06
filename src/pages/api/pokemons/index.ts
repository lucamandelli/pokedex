import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { Pokemon } from "../../../../utils/models/Pokemons";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  if (req.method === 'GET') {
    const data = await collection.find().toArray();

    const pokemons: Pokemon[] = data.map(pokemon => ({
      id: pokemon._id.toString(),
      name: pokemon.name,
      type: pokemon.type,
      weight: pokemon.weight,
      abilities: pokemon.abilities
    }))

    return res.status(200).json({ pokemons });
  }

  else if (req.method === 'POST') {
    const data: Pokemon = req.body;

    if (!data) {
      return res.status(400).json({ message: "Error creating a Pokemon" });
    }

    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(400).json({ message: "Error creating a Pokemon" });
    }

    return res.status(201).json({ message: "Pokemon created successfully", pokemon: data });
  }

  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}