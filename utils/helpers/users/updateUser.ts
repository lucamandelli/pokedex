import { Collection, ObjectId } from "mongodb";
import { User } from "../../models/User";
import { getUser } from "./getUser";
import { getAllUsers } from "./getAllUsers";

export async function updateUser(updatedUser: Partial<User>, usersCollection: Collection, userId: string) {
  const userData = await getUser(usersCollection, userId);

  if ('error' in userData) {
    return {
      error: userData.error,
      statusCode: userData.statusCode
    };
  }

  const { id, pokedex, ...updatedProperties } = updatedUser;

  const allUsers = await getAllUsers(usersCollection);

  const usernameAlreadyExists = allUsers.find(u => u.username === updatedUser?.username);
  const emailAlreadyExists = allUsers.find(u => u.email === updatedUser?.email);

  if (usernameAlreadyExists && emailAlreadyExists) {
    return {
      error: "username and email are already registered.",
      statusCode: 400
    };
  } else if (usernameAlreadyExists) {
    return {
      error: "username is already registered.",
      statusCode: 400
    };
  } else if (emailAlreadyExists) {
    return {
      error: "email is already registered.",
      statusCode: 400
    }
  }

  try {
    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedProperties });

    return {
      message: "User Updated Successfully",
      statusCode: 200
    };
  } catch (error) {
    return {
      error: "Database update failed.",
      statusCode: 500
    };
  }
}