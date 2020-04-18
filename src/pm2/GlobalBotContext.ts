import { promises as fs } from 'fs';
import { GlobalContextArray, GlobalContext } from '../types';
import path from 'path';

/**
 * Helper class to store additional static values globally
 * this is to reduce the amount of inter process calls via pm2
 */
export class GlobalBotContext {
  private static instance: GlobalBotContext | undefined;
  private context: GlobalContextArray;
  private path = path.resolve(__dirname, './context');

  private constructor() {
    this.context = [];
  }

  static getInstance(): GlobalBotContext {
    if (this.instance === undefined) {
      this.instance = new GlobalBotContext();
    }
    return this.instance;
  }

  /**
   * Add bot context to array and write it to file
   */
  async addBotContext(c: GlobalContext) {
    this.context.push(c);
    this.writeContext();
  }

  async findContext(name: string) {
    await this.readContext();
    return this.context.filter((c) => c.name === name)[0];
  }

  /**
   * Returns the instagram name of a given bot
   */
  async findInstagramName(name: string) {
    await this.readContext();
    return this.context.filter((c) => c.name === name)[0].igUsername;
  }

  /**
   * Delete the instagram name entry of a given bot
   */
  async deleteBotInstagramName(name: string) {
    await this.readContext();
    const element = this.context.find((e) => e.name === name)!;
    this.context.splice(this.context.indexOf(element), 1);
    await this.writeContext();
  }

  private async writeContext() {
    await fs.writeFile(this.path, JSON.stringify(this.context));
  }

  private async readContext() {
    this.context = JSON.parse(
      (await fs.readFile(this.path)).toString()
    ) as GlobalContextArray;
  }
}
