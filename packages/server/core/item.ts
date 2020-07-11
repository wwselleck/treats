export interface ContentItem<InfoType = any> {
  title: string;
  description?: string;
  date?: Date;
  link?: string;
  info?: InfoType;
}

export interface Scoreable {
  score: number;
}

export interface Item<InfoType = any> extends ContentItem<InfoType>, Scoreable {
  id: string;
}

