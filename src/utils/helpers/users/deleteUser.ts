import { Collection, ObjectId } from "mongodb";
import { getUser } from "./getUser";

export async function deleteUser(usersCollection: Collection, pokemonsCollection: Collection, userId: string) {
  const userData = await getUser(usersCollection, userId);

  if ('error' in userData) {
    return {
      error: userData.error,
      statusCode: userData.statusCode
    };
  }

  try {
    if (userData.pokedex!.length !== 0) {
      await Promise.all(userData.pokedex!.map(async (id) => await pokemonsCollection.deleteOne({ _id: new ObjectId(id) })));
    }

    await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    return {
      message: "User deleted successfully",
      statusCode: 200
    };
  } catch (error) {
    return {
      error: "Database operation failed.",
      statusCode: 500
    };
  }
}