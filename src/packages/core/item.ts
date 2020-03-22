export interface ContentItem {
  title: string;
  description?: string;
  date?: Date;
  link?: string;
}

export interface Scoreable {
  score: number;
}

export interface Item extends ContentItem, Scoreable {
  id: string;
}

