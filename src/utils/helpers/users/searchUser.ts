import { Collection } from "mongodb";
import bcrypt from 'bcrypt';
import { User } from "../../models/User";


export async function searchUser(usersCollection: Collection, username: string, password: string): Promise<Partial<User> | { statusCode: number, error: string }> {
  const user = await usersCollection.findOne({ username: username });

  if (!user) {
    return {
      statusCode: 404,
      error: "User not found"
    };
  }
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return {
      statusCode: 401,
      error: "Invalid password"
    };
  }

  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email
  }
}