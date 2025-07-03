import { UrlRepository } from "../repositories/url.repository";
import crypto from "crypto";
import { UrlRecord, UrlOriginalRecord } from "../types/url";

export class UrlService {
  private readonly urlRepository: UrlRepository;

  constructor() {
    this.urlRepository = new UrlRepository();
  }

  // deterministically generate a slug from the URL so same URL always yields same slug
  private generateSlug(url: string, length = 6): string {
    const hash = crypto.createHash("sha256").update(url).digest("base64");
    // remove non-alphanumeric characters and truncate
    return hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, length);
  }

  async createUrl({ url }: { url: string }): Promise<UrlRecord> {
    const result = await this.urlRepository.insertShortnedUrl({
      url,
      slug: this.generateSlug(url),
    });
    return {
      shortnedUrl: result.shortned_url,
      originalUrl: result.original_url,
    };
  }

  async getOriginalUrlBySlug(slug: string): Promise<UrlOriginalRecord> {
    const result = await this.urlRepository.getOriginalUrlBySlug(slug);

    return {
      originalUrl: result?.original_url || "",
    };
  }

  async getOriginalUrlByShortenedUrl(
    shortnedUrl: string
  ): Promise<UrlOriginalRecord> {
    const result = await this.urlRepository.getOriginalUrlByShortenedUrl(
      shortnedUrl
    );

    return {
      originalUrl: result?.original_url || "",
    };
  }
}

export default new UrlService();
