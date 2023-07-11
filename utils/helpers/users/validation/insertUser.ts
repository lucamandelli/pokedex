import { User } from "../../../models/User";

export async function insertUser(user: User, usersCollection: any): Promise<string | null> {
  try {
    await usersCollection.insertOne(user);
    return null;
  } catch (error) {
    return 'Error inserting user into the database.';
  }
}