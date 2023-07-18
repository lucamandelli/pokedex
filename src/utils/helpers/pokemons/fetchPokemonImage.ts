import fetch from "node-fetch";

export const fetchPokemonImage = async (pokemonName: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonApiData: any = await response.json();

    if (pokemonApiData && pokemonApiData.sprites && pokemonApiData.sprites.front_default) {
      return pokemonApiData.sprites.front_default;
    } else {
      return '';
    }

  } catch (error) {
    return { message: error }
  }
}