export enum ContentType {
  Image,
  Gif,
  ImgurVideo,
  RedditVideo,
}

export enum PostableContentType {
  Image,
  Video,
}

export interface Content {
  type: ContentType;
  url: string;
  caption: string;
  source?: string;
}

export interface PostableContent extends Omit<Content, 'type'> {
  type: PostableContentType;
  filePath: string;
}
