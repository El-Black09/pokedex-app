import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export const AtmosphereBackground = () => (
  <View pointerEvents="none">
    <View style={styles.base} />
    <View style={styles.orbOne} />
    <View style={styles.orbTwo} />
    <View style={styles.orbThree} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.bgTop,
  },
  orbOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -100,
    left: -80,
    backgroundColor: "rgba(255, 209, 102, 0.24)",
  },
  orbTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: 110,
    right: -60,
    backgroundColor: "rgba(106, 226, 142, 0.23)",
  },
  orbThree: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    bottom: -70,
    left: 50,
    backgroundColor: "rgba(99, 144, 240, 0.25)",
  },
});
