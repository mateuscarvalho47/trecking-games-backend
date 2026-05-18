import { HowLongToBeatService } from 'howlongtobeat-ts';
import type { HltbTimes } from '@/lib/hltb/schemas.js';

const CACHE_TTL = 60 * 60 * 24;
const NULL_CACHE_TTL = 60 * 60;
const MIN_SIMILARITY = 0.6;

interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
}

interface Logger {
  warn: (obj: unknown, msg?: string) => void;
}

export class HltbClient {
  private readonly service = new HowLongToBeatService(MIN_SIMILARITY);

  constructor(
    private readonly redis: RedisLike,
    private readonly timeoutMs: number = 5000,
    private readonly logger?: Logger,
  ) {}

  async findByName(name: string): Promise<HltbTimes | null> {
    const key = `hltb:name:${name.toLowerCase().trim()}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as HltbTimes | null;

    const times = await this.fetchTimes(name);
    await this.redis.set(key, JSON.stringify(times), {
      EX: times ? CACHE_TTL : NULL_CACHE_TTL,
    });
    return times;
  }

  private async fetchTimes(name: string): Promise<HltbTimes | null> {
    try {
      const result = await this.withTimeout(this.service.search(name));
      if (!result.success || result.data.length === 0) return null;

      const best = result.data[0];
      const main = secondsToHours(best.mainTime);
      const mainExtra = secondsToHours(best.mainExtraTime);
      const completionist = secondsToHours(best.completionistTime);

      if (main == null && mainExtra == null && completionist == null) return null;

      return {
        mainHours: main,
        mainExtraHours: mainExtra,
        completionistHours: completionist,
      };
    } catch (err) {
      this.logger?.warn({ err, name }, 'HLTB lookup failed');
      return null;
    }
  }

  private withTimeout<T>(promise: Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('HLTB request timed out')), this.timeoutMs);
      promise.then(
        (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        },
      );
    });
  }
}

function secondsToHours(seconds: number | undefined): number | null {
  if (!seconds || seconds <= 0) return null;
  return Math.round((seconds / 3600) * 10) / 10;
}
