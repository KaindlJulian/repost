export enum ContentType {
  Image,
  Gif,
  Video,
}

export interface Content {
  type: ContentType;
  url: string;
  caption: string;
  source?: string;
  audio?: string;
}

export interface PostableContent extends Content {
  filePath: string;
}
