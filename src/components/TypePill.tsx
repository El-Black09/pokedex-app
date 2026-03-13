import { COLORS, TYPE_COLORS } from "@/constants/theme";
import { formatPokemonName } from "@/utils/pokemon";
import { StyleSheet, Text, View } from "react-native";

interface TypePillProps {
  type: string;
}

export const TypePill = ({ type }: TypePillProps) => (
  <View
    style={[
      styles.pill,
      {
        backgroundColor: TYPE_COLORS[type] || COLORS.panelAlt,
      },
    ]}
  >
    <Text style={styles.label}>{formatPokemonName(type)}</Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
