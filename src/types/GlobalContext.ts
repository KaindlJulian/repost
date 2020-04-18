export type GlobalContextArray = Array<GlobalContext>;

export interface GlobalContext {
  name: string;
  igUsername: string;
  subredditNames: string[];
  schedule: string;
  tags: string[];
  explore: boolean;
}
