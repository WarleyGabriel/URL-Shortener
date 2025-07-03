/* eslint-disable */
/// <reference types="jest" />
import pool from "../database/connection";
import { UrlRepository } from "../repositories/url.repository";

jest.mock("../database/connection", () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    query: jest.fn(),
  },
}));

const mockPool = pool as jest.Mocked<typeof pool>;
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

describe("UrlRepository", () => {
  let repo: UrlRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SHORTNER_BASE_URL = "http://short.ly";
    (mockPool.connect as jest.Mock).mockResolvedValue(mockClient as any);
    mockPool.query.mockClear();
    repo = new UrlRepository();
  });

  describe("insertShortnedUrl", () => {
    it("throws error if slug is empty", async () => {
      await expect(
        repo.insertShortnedUrl({ url: "http://example.com", slug: "" })
      ).rejects.toThrow("Could not generate slug");
      expect(mockPool.query).not.toHaveBeenCalled();
    });

    it("inserts and returns url record", async () => {
      const slug = "abc123";
      const url = "http://example.com";
      const fakeRow = {
        original_url: url,
        slug,
        shortned_url: `${process.env.SHORTNER_BASE_URL}/${slug}`,
        is_active: true,
      };
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] });

      const result = await repo.insertShortnedUrl({ url, slug });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO urls"),
        [url, slug, fakeRow.shortned_url]
      );
      expect(result).toEqual(fakeRow);
    });
  });

  describe("getOriginalUrlBySlug", () => {
    it("returns original url when found", async () => {
      const slug = "xyz";
      const fakeRow = { original_url: "http://example.org" };
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] });
      const result = await repo.getOriginalUrlBySlug(slug);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT original_url"),
        [slug]
      );
      expect(result).toEqual(fakeRow);
    });

    it("returns undefined when not found", async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const result = await repo.getOriginalUrlBySlug("noslug");
      expect(result).toBeUndefined();
    });
  });

  describe("getOriginalUrlByShortenedUrl", () => {
    it("returns original url when found", async () => {
      const shortUrl = "http://short.ly/slug";
      const fakeRow = { original_url: "http://orig" };
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] });
      const result = await repo.getOriginalUrlByShortenedUrl(shortUrl);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT original_url"),
        [shortUrl]
      );
      expect(result).toEqual(fakeRow);
    });

    it("returns undefined when not found", async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const result = await repo.getOriginalUrlByShortenedUrl("none");
      expect(result).toBeUndefined();
    });
  });

  describe("getUrlBySlug", () => {
    it("returns slug when found", async () => {
      const slug = "myslug";
      const fakeRow = { slug };
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [fakeRow] });
      const result = await repo.getUrlBySlug(slug);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT slug"),
        [slug]
      );
      expect(result).toEqual(fakeRow);
    });

    it("returns undefined when not found", async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const result = await repo.getUrlBySlug("none");
      expect(result).toBeUndefined();
    });
  });
});
