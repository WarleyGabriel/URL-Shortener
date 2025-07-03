export interface Url {
  id: number;
  original_url: string;
  slug: string;
  shortned_url: string;
  created_at: string;
}

export interface UrlRecord {
  shortnedUrl: string;
  originalUrl: string;
}

export interface UrlOriginalRecord {
  originalUrl: string;
}
