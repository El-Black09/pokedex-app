import { PokedexProvider } from "@/context/PokedexContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PokedexProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PokedexProvider>
  );
}
