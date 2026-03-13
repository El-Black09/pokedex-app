import {
  NamedApiResource,
  PokemonCardData,
  PokemonDetailsData,
  PokemonListResponse,
} from "@/types/pokemon";
import { extractIdFromUrl, sanitizeFlavorText } from "@/utils/pokemon";

const API_BASE_URL = "https://pokeapi.co/api/v2";

const allPokemonNamesCache: { value: string[] | null } = { value: null };

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`PokeAPI error (${response.status}) on ${path}`);
  }

  return response.json() as Promise<T>;
};

const toPokemonImage = (sprites: any): string =>
  sprites?.other?.["official-artwork"]?.front_default ||
  sprites?.other?.home?.front_default ||
  sprites?.front_default ||
  "";

const toPokemonCardData = (pokemon: any): PokemonCardData => ({
  id: pokemon.id,
  name: pokemon.name,
  image: toPokemonImage(pokemon.sprites),
  types: pokemon.types
    .sort((a: any, b: any) => a.slot - b.slot)
    .map((entry: any) => entry.type.name),
});

const parseEvolutionChain = (chainNode: any): string[] => {
  if (!chainNode) {
    return [];
  }

  const names = [chainNode.species?.name as string];

  for (const next of chainNode.evolves_to || []) {
    names.push(...parseEvolutionChain(next));
  }

  return names.filter(Boolean);
};

export const getPokemonPage = async (
  limit: number,
  offset: number,
): Promise<PokemonCardData[]> => {
  const list = await fetchJson<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
  );

  const detailed = await Promise.all(
    list.results.map((item) => fetchPokemonByName(item.name)),
  );

  return detailed;
};

export const fetchPokemonByName = async (
  name: string,
): Promise<PokemonCardData> => {
  const pokemon = await fetchJson<any>(`/pokemon/${name}`);
  return toPokemonCardData(pokemon);
};

export const getAllPokemonNames = async (): Promise<string[]> => {
  if (allPokemonNamesCache.value) {
    return allPokemonNamesCache.value;
  }

  const response = await fetchJson<PokemonListResponse>("/pokemon?limit=1302");
  allPokemonNamesCache.value = response.results.map((item) => item.name);
  return allPokemonNamesCache.value;
};

export const searchPokemonByPrefix = async (
  query: string,
  maxResults = 24,
): Promise<PokemonCardData[]> => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const allNames = await getAllPokemonNames();
  const matches = allNames
    .filter((name) => name.includes(normalized))
    .slice(0, maxResults);

  return Promise.all(matches.map((name) => fetchPokemonByName(name)));
};

export const getPokemonDetails = async (
  name: string,
): Promise<PokemonDetailsData> => {
  const [pokemon, species] = await Promise.all([
    fetchJson<any>(`/pokemon/${name}`),
    fetchJson<any>(`/pokemon-species/${name}`),
  ]);

  const evolutionChainPath = species.evolution_chain?.url?.replace(
    API_BASE_URL,
    "",
  );

  const evolutionResponse = evolutionChainPath
    ? await fetchJson<any>(evolutionChainPath)
    : null;

  const flavor =
    species.flavor_text_entries?.find(
      (entry: any) => entry.language.name === "en",
    )?.flavor_text || "No description available.";

  const evolution = parseEvolutionChain(evolutionResponse?.chain);

  return {
    ...toPokemonCardData(pokemon),
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience,
    abilities: pokemon.abilities.map((entry: any) => entry.ability.name),
    stats: pokemon.stats.map((entry: any) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
    moves: pokemon.moves.slice(0, 10).map((entry: any) => entry.move.name),
    flavorText: sanitizeFlavorText(flavor),
    habitat: species.habitat?.name || "unknown",
    generation: species.generation?.name || "unknown",
    evolution,
  };
};

export const getPokemonIdFromResource = (resource: NamedApiResource) =>
  extractIdFromUrl(resource.url);
