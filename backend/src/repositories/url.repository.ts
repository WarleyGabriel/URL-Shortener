import { Pool } from "pg";
import pool from "../database/connection";
import { Url } from "../types/url";

export class UrlRepository {
  private readonly pool: Pool;
  private readonly baseUrl: string;

  constructor() {
    this.pool = pool;
    this.baseUrl = process.env.SHORTNER_BASE_URL ?? "";

    console.log(`Working with domain: ${this.baseUrl}`);
  }

  async insertShortnedUrl({
    url,
    slug,
  }: {
    url: string;
    slug: string;
  }): Promise<Url> {
    try {
      if (!slug) {
        throw new Error("Could not generate slug");
      }

      // Upsert: insert new or reactivate existing URL in one query
      const query = `
        INSERT INTO urls (original_url, slug, shortned_url, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (slug) DO UPDATE
          SET is_active = TRUE
        RETURNING *;
      `;

      const result = await this.pool.query(query, [
        url,
        slug,
        `${this.baseUrl}/${slug}`,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error("Error inserting shortned URL:", error);
      throw error;
    }
  }

  async getUrlBySlug(slug: string): Promise<Url> {
    try {
      const query = `SELECT slug FROM urls WHERE slug = $1 AND is_active = true`;
      const result = await this.pool.query(query, [slug]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting URL by slug:", error);
      throw error;
    }
  }

  async getOriginalUrlByShortenedUrl(shortnedUrl: string): Promise<Url> {
    try {
      const query = `SELECT original_url FROM urls WHERE shortned_url = $1 AND is_active = true`;
      const result = await this.pool.query(query, [shortnedUrl]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting original URL by shortened URL:", error);
      throw error;
    }
  }

  async getOriginalUrlBySlug(slug: string): Promise<Url> {
    try {
      const query = `SELECT original_url FROM urls WHERE slug = $1 AND is_active = true`;
      const result = await this.pool.query(query, [slug]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting original URL by slug:", error);
      throw error;
    }
  }
}
