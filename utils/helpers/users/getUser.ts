import { Collection, ObjectId } from "mongodb";
import { User } from "../../models/User";

export async function getUser(usersCollection: Collection, userId: string): Promise<Partial<User> | { error: string, statusCode: number }> {
  let query;

  if (ObjectId.isValid(userId)) {
    query = { _id: new ObjectId(userId) };
  } else {
    return {
      error: "User not found",
      statusCode: 404
    };
  }

  const userData = await usersCollection.findOne(query);

  if (!userData) {
    return {
      error: "User not found",
      statusCode: 404
    }
  }

  return {
    id: userData._id.toString(),
    name: userData.name,
    username: userData.username,
    email: userData.email,
    pokedex: userData.pokedex
  };
}