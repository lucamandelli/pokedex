import { User } from "../../models/User";
import { insertUser } from "./validation/insertUser";
import { validateUser } from "./validation/validateUser";

export async function processUser(user: Partial<User>, usersCollection: any) {
  const validationError = await validateUser(user, usersCollection);

  if (validationError) {
    return { statusCode: 400, dataReceived: user, reason: validationError };
  }

  const insertionError = await insertUser(user as User, usersCollection);

  if (insertionError) {
    return { statusCode: 400, name: user.name, reason: insertionError };
  }

  return { statusCode: 201, message: "User created successfully", user: user };
}