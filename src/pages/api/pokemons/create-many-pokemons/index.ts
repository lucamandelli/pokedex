import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../utils/db";
import { Pokemon } from "../../../../../utils/models/Pokemons";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  const data: Pokemon[] = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!data) {
    return res.status(400).json({ message: "Error creating a Pokemon" });
  }

  else if (req.method === 'POST') {
    const result = await collection.insertMany(data);

    if (!result) {
      return res.status(400).json({ message: "Error creating the Pokemons" });
    }

    return res.status(201).json({ message: "Pokemons created successfully", pokemon: data });
  }
}