import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../../utils/db";
import { checkIdOrName } from "../../../../../utils/helpers/validation/checkIdOrName";
import { getUser } from "../../../../../utils/helpers/users/getUser";
import { User } from "../../../../../utils/models/User";
import { updateUser } from "../../../../../utils/helpers/users/updateUser";
import { deleteUser } from "../../../../../utils/helpers/users/deleteUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  const pokemonCollection = db.collection("pokemons");

  const { userId } = req.query;

  const checkedUserIdOrName = checkIdOrName(userId);

  if ('isInvalid' in checkedUserIdOrName) {
    return res.status(checkedUserIdOrName.statusCode).json({ message: checkedUserIdOrName.message });
  }

  if (req.method === "GET") {
    try {
      const userData = await getUser(usersCollection, checkedUserIdOrName.checkedIdOrName);

      if ('error' in userData) {
        return res.status(userData.statusCode).json({ message: userData.error });
      }

      return res.status(200).json({ user: userData });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    const userUpdate: Partial<User> = req.body;
    const processedUserUpdated = await updateUser(userUpdate, usersCollection, checkedUserIdOrName.checkedIdOrName);

    if ('error' in processedUserUpdated) {
      return res.status(processedUserUpdated.statusCode).json({ message: processedUserUpdated.error });
    }

    return res.status(processedUserUpdated.statusCode).json({ message: processedUserUpdated.message });
  } else if (req.method === "DELETE") {
    const deletedUser = await deleteUser(usersCollection, pokemonCollection, checkedUserIdOrName.checkedIdOrName);

    if ('error' in deletedUser) {
      return res.status(deletedUser.statusCode).json({ message: deletedUser.error });
    }

    return res.status(deletedUser.statusCode).json({ message: deletedUser.message });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}