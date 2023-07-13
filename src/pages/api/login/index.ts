import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../utils/db";
import { searchUser } from "../../../../utils/helpers/users/searchUser";
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;
  const insertedUser = await searchUser(usersCollection, username, password);

  if ('error' in insertedUser) {
    return res.status(insertedUser.statusCode).json({ message: insertedUser.error });
  }

  const token = jwt.sign({ id: insertedUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return res.status(200).json({ message: "User logged in successfully", token })
}