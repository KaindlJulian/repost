export enum ContentType {
  Image,
  Gif,
  ImgurVideo,
  RedditVideo,
}

export interface Content {
  type: ContentType;
  url: string;
  caption: string;
  source?: string;
}

export interface PostableContent extends Content {
  filePath: string;
}
