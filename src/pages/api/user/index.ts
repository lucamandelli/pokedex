import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/db";
import { User } from "@/utils/models/User";
import bcrypt from 'bcrypt';
import { processUser } from "@/utils/helpers/users/processUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("users");

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (req.method === 'POST') {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData: Partial<User> = {
      name: req.body.name.toLowerCase(),
      username: req.body.username.trim().toLowerCase(),
      email: req.body.email.trim().toLowerCase(),
      password: hashedPassword,
      pokedex: []
    }

    const processedUser = await processUser(userData, collection);

    return res.status(processedUser.statusCode).json(processedUser);
  }
}