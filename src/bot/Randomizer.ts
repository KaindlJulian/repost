import { use, bernoulli } from 'random';

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
   * Returns a boolean value, indicating if a gif should be posted
   */
  shouldPostGif(): boolean {
    return Boolean(bernoulli(0.25)());
  }
}
