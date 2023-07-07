import { Pokemon } from "../../models/Pokemons";
import { ObjectId } from "mongodb";

export async function getPokemon(collection: any, idOrName: string): Promise<Pokemon | { error: string, statusCode: number }> {
  let query;

  if (ObjectId.isValid(idOrName)) {
    query = { _id: new ObjectId(idOrName) };
  } else {
    query = { name: idOrName.trim().toLowerCase() };
  }
  
  const data = await collection.findOne(query);

  if (!data) {
    return {
      error: "Pokemon not found",
      statusCode: 404
    }
  }

  return {
    id: data._id.toString(),
    name: data.name,
    photo: data.photo,
    type: data.type,
    weight: data.weight,
    abilities: data.abilities
  };
}
