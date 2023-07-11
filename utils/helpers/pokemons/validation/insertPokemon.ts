import { ObjectId } from "mongodb";
import { Pokemon } from "../../../models/Pokemons";

export async function insertPokemon(pokemon: Pokemon, usersCollection: any, pokemonCollection: any): Promise<string | null> {
  try {
    const res = await pokemonCollection.insertOne(pokemon);
    const pokemonId = res.insertedId;

    await usersCollection.updateOne({ _id: new ObjectId(pokemon.userId) }, { $push: { pokedex: pokemonId } });

    return null;
  } catch (error) {
    return 'Error inserting pokemon into the database.';
  }
}
