import { COLORS } from "@/constants/theme";
import { formatPokemonName } from "@/utils/pokemon";
import { DimensionValue, StyleSheet, Text, View } from "react-native";

interface StatBarProps {
  label: string;
  value: number;
}

export const StatBar = ({ label, value }: StatBarProps) => {
  const width =
    `${Math.min(100, Math.max(4, (value / 180) * 100))}%` as DimensionValue;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{formatPokemonName(label)}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    width: 88,
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#1C2D57",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
  value: {
    width: 30,
    color: COLORS.text,
    fontSize: 12,
    textAlign: "right",
    fontWeight: "700",
  },
});
