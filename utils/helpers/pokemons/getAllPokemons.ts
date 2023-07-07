import { Pokemon } from "../../models/Pokemons";

export async function getAllPokemons(collection: any): Promise<{ pokemons: Pokemon[], pokemonsLenght: number }> {
  const data = await collection.find().toArray();

  const pokemons: Pokemon[] = data.map((pokemon: any) => ({
    id: pokemon._id.toString(),
    name: pokemon.name,
    photo: pokemon.photo,
    type: pokemon.type,
    weight: pokemon.weight,
    abilities: pokemon.abilities
  }))

  return { pokemons, pokemonsLenght: pokemons.length };
}