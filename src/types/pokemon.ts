export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonDetailsData extends PokemonCardData {
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
  stats: PokemonStat[];
  moves: string[];
  flavorText: string;
  habitat: string;
  generation: string;
  evolution: string[];
}
