import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

interface PokedexContextValue {
  selectedPokemonName: string | null;
  setSelectedPokemonName: (name: string | null) => void;
}

const PokedexContext = createContext<PokedexContextValue | undefined>(
  undefined,
);

export const PokedexProvider = ({ children }: PropsWithChildren) => {
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
    "pikachu",
  );

  const value = useMemo(
    () => ({ selectedPokemonName, setSelectedPokemonName }),
    [selectedPokemonName],
  );

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
};

export const usePokedexContext = () => {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error("usePokedexContext must be used inside PokedexProvider");
  }

  return context;
};
