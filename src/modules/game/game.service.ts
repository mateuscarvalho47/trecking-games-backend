import type { IgdbClient } from '@/lib/igdb/client.js';
import type { IgdbGame } from '@/lib/igdb/schemas.js';

const SEARCH_TTL = 60 * 10;
const GAME_TTL = 60 * 60 * 24;

interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
}

export class GameService {
  constructor(
    private readonly igdb: IgdbClient,
    private readonly redis: RedisLike,
  ) {}

  async search(q: string): Promise<IgdbGame[]> {
    const key = `igdb:search:${q}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as IgdbGame[];

    const results = await this.igdb.searchGames(q);
    await this.redis.set(key, JSON.stringify(results), { EX: SEARCH_TTL });
    return results;
  }

  async getById(igdbId: number): Promise<IgdbGame | null> {
    const key = `igdb:game:${igdbId}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as IgdbGame;

    const game = await this.igdb.getGameById(igdbId);
    if (game) await this.redis.set(key, JSON.stringify(game), { EX: GAME_TTL });
    return game;
  }
}
