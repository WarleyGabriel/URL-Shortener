/* eslint-disable */
/// <reference types="jest" />
import request from "supertest";
import express from "express";
import router from "../routes/url.route";
import urlService from "../services/url.service";

jest.mock("../services/url.service");

const mockedUrlService = urlService as jest.Mocked<typeof urlService>;

describe("URL Controller", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  describe("POST /api/urls/shorten", () => {
    it("should return 400 if url is missing", async () => {
      const res = await request(app).post("/api/urls/shorten").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 201 and shortened url", async () => {
      mockedUrlService.createUrl.mockResolvedValue({
        shortnedUrl: "http://test/slug",
        originalUrl: "http://example.com",
      });
      const res = await request(app)
        .post("/api/urls/shorten")
        .send({ url: "http://example.com" });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.shortnedUrl).toBe("http://test/slug");
    });

    it("should return 500 on service error", async () => {
      mockedUrlService.createUrl.mockRejectedValue(new Error("fail"));
      const res = await request(app)
        .post("/api/urls/shorten")
        .send({ url: "http://example.com" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });

  describe("POST /api/urls/original", () => {
    it("should return 400 if shortnedUrl is missing", async () => {
      const res = await request(app).post("/api/urls/original").send({});
      expect(res.status).toBe(400);
    });

    it("should return 404 if URL not found", async () => {
      mockedUrlService.getOriginalUrlByShortenedUrl.mockResolvedValue({
        originalUrl: "",
      });
      const res = await request(app)
        .post("/api/urls/original")
        .send({ shortnedUrl: "notfound" });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("URL not found");
    });

    it("should return 200 and original URL", async () => {
      mockedUrlService.getOriginalUrlByShortenedUrl.mockResolvedValue({
        originalUrl: "http://example.com",
      });
      const res = await request(app)
        .post("/api/urls/original")
        .send({ shortnedUrl: "slug" });
      expect(res.status).toBe(200);
      expect(res.body.data.originalUrl).toBe("http://example.com");
    });

    it("should return 500 on service error", async () => {
      mockedUrlService.getOriginalUrlByShortenedUrl.mockRejectedValue(
        new Error("fail")
      );
      const res = await request(app)
        .post("/api/urls/original")
        .send({ shortnedUrl: "slug" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });

  describe("GET /api/docs", () => {
    it("should return API info", async () => {
      const res = await request(app).get("/api/docs");
      expect(res.status).toBe(200);
      expect(res.body.message).toContain(
        "TypeScript URL Shortener API is running"
      );
    });
  });

  describe("GET /:slug", () => {
    it("should redirect to original URL", async () => {
      mockedUrlService.getOriginalUrlBySlug.mockResolvedValue({
        originalUrl: "http://example.com",
      });
      const res = await request(app).get("/someSlug");
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("http://example.com");
    });

    it("should return 404 if not found", async () => {
      mockedUrlService.getOriginalUrlBySlug.mockResolvedValue({
        originalUrl: "",
      });
      const res = await request(app).get("/nope");
      expect(res.status).toBe(404);
    });

    it("should return 500 on service error", async () => {
      mockedUrlService.getOriginalUrlBySlug.mockRejectedValue(
        new Error("fail")
      );
      const res = await request(app).get("/errorSlug");
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});
