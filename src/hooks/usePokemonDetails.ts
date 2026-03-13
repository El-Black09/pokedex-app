import { getPokemonDetails } from "@/services/pokeapi";
import { PokemonDetailsData } from "@/types/pokemon";
import { useEffect, useState } from "react";

export const usePokemonDetails = (name: string | null) => {
  const [details, setDetails] = useState<PokemonDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setDetails(null);
      setError(null);
      return;
    }

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPokemonDetails(name);
        setDetails(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  return { details, loading, error };
};
