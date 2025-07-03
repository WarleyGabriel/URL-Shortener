import { UrlService } from "../services/url.service";
import { UrlRepository } from "../repositories/url.repository";

describe("UrlService", () => {
  const service: any = new UrlService();

  describe("generateSlug", () => {
    it("generates consistent slug for same URL and length 6 alphanumeric", () => {
      const slug1: string = service.generateSlug("http://example.com");
      const slug2: string = service.generateSlug("http://example.com");
      expect(slug1).toHaveLength(6);
      expect(slug1).toEqual(slug2);
      expect(/^[a-zA-Z0-9]+$/.test(slug1)).toBe(true);
    });
  });

  describe("createUrl", () => {
    it("calls repository.insertShortnedUrl and returns mapped UrlRecord", async () => {
      const fakeRepo = {
        original_url: "http://example.org",
        slug: "slug123",
        shortned_url: "http://short.ly/slug123",
      } as any;
      const insertSpy = jest
        .spyOn(UrlRepository.prototype, "insertShortnedUrl")
        .mockResolvedValue(fakeRepo);

      const result = await service.createUrl({ url: "http://example.org" });

      expect(insertSpy).toHaveBeenCalledWith({
        url: "http://example.org",
        slug: expect.any(String),
      });
      expect(result).toEqual({
        originalUrl: fakeRepo.original_url,
        shortnedUrl: fakeRepo.shortned_url,
      });
    });
  });

  describe("getOriginalUrlBySlug", () => {
    it("returns originalUrl when repository finds a record", async () => {
      const fakeRow = { original_url: "http://orig.com" } as any;
      jest
        .spyOn(UrlRepository.prototype, "getOriginalUrlBySlug")
        .mockResolvedValue(fakeRow);

      const result = await service.getOriginalUrlBySlug("myslug");
      expect(result).toEqual({ originalUrl: fakeRow.original_url });
    });

    it("returns empty originalUrl when not found", async () => {
      jest
        .spyOn(UrlRepository.prototype, "getOriginalUrlBySlug")
        .mockResolvedValue(undefined as any);

      const result = await service.getOriginalUrlBySlug("nope");
      expect(result).toEqual({ originalUrl: "" });
    });
  });

  describe("getOriginalUrlByShortenedUrl", () => {
    it("returns originalUrl when repository finds a record", async () => {
      const fakeRow = { original_url: "http://orig.com" } as any;
      jest
        .spyOn(UrlRepository.prototype, "getOriginalUrlByShortenedUrl")
        .mockResolvedValue(fakeRow);

      const result = await service.getOriginalUrlByShortenedUrl(
        "http://short.ly/x"
      );
      expect(result).toEqual({ originalUrl: fakeRow.original_url });
    });

    it("returns empty originalUrl when not found", async () => {
      jest
        .spyOn(UrlRepository.prototype, "getOriginalUrlByShortenedUrl")
        .mockResolvedValue(undefined as any);

      const result = await service.getOriginalUrlByShortenedUrl("none");
      expect(result).toEqual({ originalUrl: "" });
    });
  });
});
