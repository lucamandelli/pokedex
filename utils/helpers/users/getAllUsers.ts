import { User } from "../../models/User";

export async function getAllUsers(userCollection: any): Promise<User[]> {
  const users = await userCollection.find({}).toArray();

  return users.map((user: any) => {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      pokedex: user.pokedex
    }
  })
}