import { Router, Request, Response } from "express";
import UrlController from "../controllers/url.controller";

const router = Router();

router.post("/api/urls/shorten", (req: Request, res: Response) =>
  UrlController.shortenUrl(req, res)
);

router.post("/api/urls/original", (req: Request, res: Response) =>
  UrlController.getOriginalUrl(req, res)
);

router.get("/api/docs", (_req: Request, res: Response) => {
  const response = {
    message: "TypeScript URL Shortener API is running!",
    version: "1.0.0",
    language: "TypeScript",
    endpoints: {
      "POST /api/urls/shorten": "Shorten a URL",
      "POST /api/urls/original": "Get original URL from shortned URL",
      "GET /:slug": "Redirect to original URL",
    },
  };

  res.json(response);
});

router.get("/:slug", (req: Request, res: Response) =>
  UrlController.redirectToOriginalUrl(req, res)
);

export default router;
