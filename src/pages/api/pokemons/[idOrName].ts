import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { Pokemon } from "../../../../utils/models/Pokemons";
import { ObjectId } from "mongodb";
import { getPokemon } from "../../../../utils/helpers/pokemons/getPokemon";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("pokemons");

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { idOrName } = req.query;

  try {
    const idOrName = Array.isArray(req.query.idOrName)
      ? req.query.idOrName[0]
      : req.query.idOrName;

    if (!idOrName || typeof idOrName !== 'string') {
      return res.status(400).json({ message: "Invalid id or name" });
    }

    const data = await getPokemon(collection, idOrName);


    if ('error' in data) {
      return res.status(data.statusCode).json({ message: data.error });
    }

    return res.status(200).json({ pokemon: data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}