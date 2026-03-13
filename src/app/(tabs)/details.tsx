import { AtmosphereBackground } from "@/components/AtmosphereBackground";
import { StatBar } from "@/components/StatBar";
import { TypePill } from "@/components/TypePill";
import { COLORS } from "@/constants/theme";
import { usePokedexContext } from "@/context/PokedexContext";
import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import { formatMeasure, formatPokemonName } from "@/utils/pokemon";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const params = useLocalSearchParams<{ name?: string | string[] }>();
  const { selectedPokemonName, setSelectedPokemonName } = usePokedexContext();

  const routeName = Array.isArray(params.name) ? params.name[0] : params.name;

  const currentName = useMemo(
    () => routeName ?? selectedPokemonName,
    [routeName, selectedPokemonName],
  );

  useEffect(() => {
    if (routeName) {
      setSelectedPokemonName(routeName);
    }
  }, [routeName, setSelectedPokemonName]);

  const { details, loading, error } = usePokemonDetails(currentName || null);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AtmosphereBackground />

      {!currentName ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Aucun pokemon selectionne</Text>
          <Text style={styles.emptyText}>
            Ouvre Home ou Recherche pour choisir ton prochain champion.
          </Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.accent} size="large" />
        </View>
      ) : null}

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      {details ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.number}>
            #{String(details.id).padStart(3, "0")}
          </Text>
          <Text style={styles.title}>{formatPokemonName(details.name)}</Text>
          <Text style={styles.subtitle}>{details.flavorText}</Text>

          <Image
            source={details.image}
            style={styles.heroImage}
            contentFit="contain"
            transition={300}
          />

          <View style={styles.typeRow}>
            {details.types.map((type) => (
              <TypePill key={`details-${type}`} type={type} />
            ))}
          </View>

          <View style={styles.metricsCard}>
            <Metric
              label="Taille"
              value={formatMeasure(details.height, "m", 10)}
            />
            <Metric
              label="Poids"
              value={formatMeasure(details.weight, "kg", 10)}
            />
            <Metric label="Base XP" value={String(details.baseExperience)} />
            <Metric
              label="Habitat"
              value={formatPokemonName(details.habitat)}
            />
            <Metric
              label="Generation"
              value={formatPokemonName(details.generation)}
            />
          </View>

          <SectionTitle title="Statistiques" />
          <View style={styles.sectionPanel}>
            {details.stats.map((stat) => (
              <StatBar key={stat.name} label={stat.name} value={stat.value} />
            ))}
          </View>

          <SectionTitle title="Talents" />
          <TagList values={details.abilities} />

          <SectionTitle title="Evolution" />
          <TagList values={details.evolution} />

          <SectionTitle title="Capacites" />
          <TagList values={details.moves} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metricCell}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const TagList = ({ values }: { values: string[] }) => (
  <View style={styles.tagRow}>
    {values.map((value) => (
      <View key={value} style={styles.tagChip}>
        <Text style={styles.tagText}>{formatPokemonName(value)}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgBottom,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    color: COLORS.textSoft,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  error: {
    color: COLORS.danger,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  number: {
    color: COLORS.textSoft,
    letterSpacing: 1.2,
    fontWeight: "800",
    marginTop: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textSoft,
    marginTop: 8,
    lineHeight: 21,
  },
  heroImage: {
    width: "100%",
    height: 230,
    marginTop: 8,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  metricsCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(20, 34, 67, 0.9)",
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
  },
  metricCell: {
    width: "50%",
  },
  metricLabel: {
    color: COLORS.textSoft,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    color: COLORS.text,
    marginTop: 2,
    fontWeight: "800",
    fontSize: 15,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 18,
    marginBottom: 10,
  },
  sectionPanel: {
    backgroundColor: "rgba(18, 30, 61, 0.92)",
    borderRadius: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 12,
    gap: 9,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(32, 54, 101, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
