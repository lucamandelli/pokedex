import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { User } from "../../../../utils/models/User";
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("users");

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (req.method === 'POST') {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data: Partial<User> = {
      name: req.body.name.toLowerCase(),
      username: req.body.username.trim().toLowerCase(),
      email: req.body.email.trim().toLowerCase(),
      password: hashedPassword,
      pokedex: []
    }

    try {
      await collection.insertOne(data);

    } catch (error) {
      return res.status(400).json({ message: "Error inserting into the database." });
    }

    return res.status(201).json({ message: "User created successfully", user: data });
  }
}