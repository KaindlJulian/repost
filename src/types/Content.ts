export enum ContentType {
  Image,
  Gif,
  Video,
}

export interface Content {
  type: ContentType;
  url: string;
  caption: string;
}

export interface PostableContent extends Content {
  filePath: string;
}
