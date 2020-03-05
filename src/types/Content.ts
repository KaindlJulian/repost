export interface Content {
  imageUrl: string;
  caption: string;
}

export interface PostableContent extends Content {
  filePath: string;
}
