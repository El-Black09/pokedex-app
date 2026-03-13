import { getPokemonPage } from "@/services/pokeapi";
import { PokemonCardData } from "@/types/pokemon";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 24;

export const usePokemonFeed = () => {
  const [items, setItems] = useState<PokemonCardData[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (nextOffset: number, isRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const page = await getPokemonPage(PAGE_SIZE, nextOffset);
        setItems((previous) =>
          isRefresh
            ? page
            : [
                ...previous,
                ...page.filter(
                  (item) => !previous.some((current) => current.id === item.id),
                ),
              ],
        );
        setOffset(nextOffset + PAGE_SIZE);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadMore = useCallback(() => {
    if (loading) {
      return;
    }

    void loadPage(offset);
  }, [loadPage, loading, offset]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(0, true);
    setRefreshing(false);
  }, [loadPage]);

  useEffect(() => {
    void loadPage(0, true);
  }, [loadPage]);

  return {
    items,
    loading,
    refreshing,
    error,
    loadMore,
    refresh,
  };
};
