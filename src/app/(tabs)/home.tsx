import { AtmosphereBackground } from "@/components/AtmosphereBackground";
import { PokemonCard } from "@/components/PokemonCard";
import { COLORS } from "@/constants/theme";
import { usePokedexContext } from "@/context/PokedexContext";
import { usePokemonFeed } from "@/hooks/usePokemonFeed";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { setSelectedPokemonName } = usePokedexContext();
  const { items, loading, refreshing, error, loadMore, refresh } =
    usePokemonFeed();

  const headerText = useMemo(
    () => `${items.length} Pokemon explores`,
    [items.length],
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AtmosphereBackground />

      <View style={styles.header}>
        <Text style={styles.title}>PokeVerse Atlas</Text>
        <Text style={styles.subtitle}>{headerText}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.column}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <PokemonCard
              pokemon={item}
              onPress={(pokemon) => {
                setSelectedPokemonName(pokemon.name);
                router.push({
                  pathname: "/(tabs)/details",
                  params: { name: pokemon.name },
                });
              }}
            />
          </View>
        )}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refresh();
            }}
            tintColor={COLORS.accent}
          />
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color={COLORS.accent} size="small" />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgBottom,
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    paddingTop: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textSoft,
    marginTop: 4,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  error: {
    color: COLORS.danger,
    fontSize: 13,
    marginHorizontal: 18,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 90,
  },
  column: {
    gap: 8,
  },
  cardWrap: {
    flex: 1,
  },
});
