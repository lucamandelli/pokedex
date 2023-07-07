import { Pokemon } from "../../models/Pokemons";

export async function insertPokemon(pokemon: Pokemon, collection: any): Promise<string | null> {
  try {
    await collection.insertOne(pokemon);
    return null;
  } catch (error) {
    return 'Error inserting into the database.';
  }
}
