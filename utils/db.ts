import { MongoClient, Db } from "mongodb";

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  const db = await client.db();
  cachedDb = db;
  return db;
}
