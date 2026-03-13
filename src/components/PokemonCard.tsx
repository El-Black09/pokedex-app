import { TypePill } from "@/components/TypePill";
import { COLORS, TYPE_COLORS } from "@/constants/theme";
import { PokemonCardData } from "@/types/pokemon";
import { formatPokemonName } from "@/utils/pokemon";
import { Image } from "expo-image";
import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface PokemonCardProps {
  pokemon: PokemonCardData;
  onPress: (pokemon: PokemonCardData) => void;
}

const PokemonCardComponent = ({ pokemon, onPress }: PokemonCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const background = TYPE_COLORS[pokemon.types[0]] || COLORS.panelAlt;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress(pokemon)}
        style={[styles.card, { backgroundColor: `${background}CC` }]}
      >
        <Text style={styles.index}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{formatPokemonName(pokemon.name)}</Text>

        <Image
          source={pokemon.image}
          style={styles.image}
          contentFit="contain"
          transition={280}
        />

        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
            <TypePill key={`${pokemon.name}-${type}`} type={type} />
          ))}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const PokemonCard = memo(PokemonCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 14,
    minHeight: 215,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.17)",
    overflow: "hidden",
    marginBottom: 14,
  },
  index: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 110,
    marginTop: 8,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
});
