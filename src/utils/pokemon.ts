export const formatPokemonName = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatMeasure = (value: number, unit: string, factor: number) =>
  `${(value / factor).toFixed(1)} ${unit}`;

export const extractIdFromUrl = (url: string) => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
};

export const sanitizeFlavorText = (text: string) =>
  text
    .replace(/[\n\f\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
