import { Pokemon } from "../../models/Pokemons";

export async function getAllPokemons(userPokedex: string[], pokemonCollection: any): Promise<{ userPokemons: Pokemon[], userPokemonsLenght: number }> {
  const userPokemonsPromises: Promise<Pokemon>[] = userPokedex.map(async (pokemonId) => {
    const pokemon = await pokemonCollection.findOne({ _id: pokemonId });
    return {
      id: pokemon._id.toString(),
      userId: pokemon.userId,
      name: pokemon.name,
      photo: pokemon.photo,
      type: pokemon.type,
      weight: pokemon.weight,
      abilities: pokemon.abilities
    };
  })

  const userPokemons: Pokemon[] = await Promise.all(userPokemonsPromises);

  return { userPokemons, userPokemonsLenght: userPokemons.length };
}