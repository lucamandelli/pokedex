import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { Pokemon } from "../../../../utils/models/Pokemons";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const data = await collection.findOne({ _id: new ObjectId(id?.toString()) });

    if (!data) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    const pokemon: Pokemon = {
      id: data._id.toString(),
      name: data.name,
      type: data.type,
      weight: data.weight,
      abilities: data.abilities
    }

    return res.status(200).json({ pokemon });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}