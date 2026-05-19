/**
 * Static pt-BR translations for IGDB genre IDs.
 * IDs are stable IGDB identifiers — see https://api-docs.igdb.com/#genre
 */
export const IGDB_GENRE_TRANSLATIONS = {
  2: 'Point-and-click',
  4: 'Luta',
  5: 'Tiro',
  7: 'Música',
  8: 'Plataforma',
  9: 'Puzzle',
  10: 'Corrida',
  11: 'Estratégia em tempo real (RTS)',
  12: 'RPG',
  13: 'Simulador',
  14: 'Esporte',
  15: 'Estratégia',
  16: 'Estratégia por turnos (TBS)',
  24: 'Tático',
  25: "Hack and slash/Beat 'em up",
  26: 'Quiz/Trivia',
  30: 'Pinball',
  31: 'Aventura',
  32: 'Indie',
  33: 'Arcade',
  34: 'Visual Novel',
  35: 'Jogo de cartas e tabuleiro',
  36: 'MOBA',
} as const satisfies Readonly<Record<number, string>>;

export function translateGenreName(id: number, fallbackName: string): string {
  return (IGDB_GENRE_TRANSLATIONS as Record<number, string>)[id] ?? fallbackName;
}

export function translateGenres(genres: Array<{ id: number; name: string }>): string[] {
  return genres.map((g) => translateGenreName(g.id, g.name));
}
