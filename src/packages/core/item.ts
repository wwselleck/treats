export interface ContentItem {
  title: string;
  description?: string;
  link?: string;
}

export interface Scoreable {
  score: number;
}

export interface Item extends ContentItem, Scoreable {
  id: string;
}

