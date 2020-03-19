import { use, bernoulli, int, float } from 'random';

/**
 * Randomizes bot actions, based on probability
 */
export class Randomizer {
  private static instance: Randomizer | undefined;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Randomizer();
    }
    return this.instance;
  }

  setSeed(seed: string) {
    use(seed);
    return this;
  }

  /**
   * Returns a boolean value. True if bernoulli trial was sucessful
   */
  evaluatePercentage(percentage: number): boolean {
    if (percentage >= 0 && percentage <= 1) {
      return Boolean(bernoulli(percentage)());
    } else {
      throw 'must be 0<=p<=1';
    }
  }

  /**
   * Returns a random number between min and max (0 and 1 by default)
   */
  float(min?: number, max?: number) {
    return float(min, max);
  }

  /**
   * Returns a random number between min and max (0 and 1 by default)
   */
  number(min?: number, max?: number): number {
    return int(min, max);
  }
}
