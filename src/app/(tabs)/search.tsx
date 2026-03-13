import { AtmosphereBackground } from "@/components/AtmosphereBackground";
import { PokemonCard } from "@/components/PokemonCard";
import { COLORS } from "@/constants/theme";
import { usePokedexContext } from "@/context/PokedexContext";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUICK_HINTS = ["pikachu", "charizard", "gengar", "mewtwo"];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { setSelectedPokemonName } = usePokedexContext();
  const { results, loading, error } = usePokemonSearch(query);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AtmosphereBackground />

      <View style={styles.header}>
        <Text style={styles.title}>Radar Pokemon</Text>
        <Text style={styles.subtitle}>
          Cherche par nom et ouvre instantanement la fiche complete.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ex: lucario"
          placeholderTextColor="#8797C2"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {!query.trim() ? (
        <View style={styles.hintsWrap}>
          <Text style={styles.hintsTitle}>Suggestions rapides</Text>
          <View style={styles.hintsRow}>
            {QUICK_HINTS.map((hint) => (
              <Pressable
                key={hint}
                style={styles.hintChip}
                onPress={() => setQuery(hint)}
              >
                <Text style={styles.hintText}>{hint}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator color={COLORS.accent} size="large" />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
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
        )}
        ListEmptyComponent={
          query.trim() && !loading ? (
            <Text style={styles.empty}>
              Aucun pokemon ne correspond a cette recherche.
            </Text>
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
    paddingBottom: 10,
    paddingTop: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 33,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSoft,
    marginTop: 6,
    lineHeight: 20,
  },
  searchBox: {
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(12, 23, 54, 0.9)",
  },
  input: {
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  hintsWrap: {
    marginHorizontal: 18,
    marginBottom: 12,
  },
  hintsTitle: {
    color: COLORS.textSoft,
    fontSize: 13,
    marginBottom: 8,
  },
  hintsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hintChip: {
    backgroundColor: "#223A70",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  hintText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  error: {
    color: COLORS.danger,
    marginHorizontal: 18,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 95,
  },
  empty: {
    color: COLORS.textSoft,
    marginTop: 26,
    textAlign: "center",
  },
});
