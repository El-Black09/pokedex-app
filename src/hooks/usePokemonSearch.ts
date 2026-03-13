import { searchPokemonByPrefix } from "@/services/pokeapi";
import { PokemonCardData } from "@/types/pokemon";
import { useEffect, useState } from "react";

export const usePokemonSearch = (query: string) => {
  const [results, setResults] = useState<PokemonCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalized = query.trim();

    if (!normalized) {
      setResults([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await searchPokemonByPrefix(normalized);
          setResults(data);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(message);
        } finally {
          setLoading(false);
        }
      })();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading, error };
};
