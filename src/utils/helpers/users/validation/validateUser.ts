import { Collection } from "mongodb";
import { User } from "../../../models/User";
import { getAllUsers } from "../getAllUsers";

export async function validateUser(user: Partial<User>, usersCollection: Collection): Promise<string | null> {
  if (!user || !user.name || !user.email || !user.password) {
    return 'Missing required fields.';
  }
  const allUsers = await getAllUsers(usersCollection);

  const userAlreadyExists = allUsers.find(u => u.username === user.username || u.email === user.email);

  if (userAlreadyExists) {
    return 'User is already registered.';
  }

  return null;
}