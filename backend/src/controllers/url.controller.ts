import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import urlService from "../services/url.service";
import { ApiResponse } from "../types/api";

export class UrlController {
  async shortenUrl(
    req: Request,
    res: Response<ApiResponse<{ shortnedUrl: string; originalUrl: string }>>
  ): Promise<void> {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: "URL is required",
        });
        return;
      }

      const data = await urlService.createUrl({
        url,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          shortnedUrl: data.shortnedUrl,
          originalUrl: data.originalUrl,
        },
        message: "URL created successfully",
      });
    } catch (error) {
      this.handleControllerError(error, res);
    }
  }

  async getOriginalUrl(
    req: Request,
    res: Response<ApiResponse<{ originalUrl: string }>>
  ): Promise<void> {
    try {
      const { shortnedUrl } = req.body;

      if (!shortnedUrl) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: "ShortnedUrl URL is required",
        });
        return;
      }

      const data = await urlService.getOriginalUrlByShortenedUrl(
        shortnedUrl as string
      );

      if (data.originalUrl === "") {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: "URL not found",
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: { originalUrl: data.originalUrl },
      });
    } catch (error) {
      this.handleControllerError(error, res);
    }
  }

  async redirectToOriginalUrl(
    req: Request,
    res: Response<ApiResponse<{ originalUrl: string }>>
  ): Promise<void> {
    try {
      const { slug } = req.params;

      const data = await urlService.getOriginalUrlBySlug(slug);

      if (data.originalUrl === "") {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: "URL not found",
        });
        return;
      }

      console.log(`Redirecting from slug: ${slug} to: ${data.originalUrl}`);
      res.redirect(data.originalUrl);
    } catch (error) {
      this.handleControllerError(error, res);
    }
  }

  private handleControllerError(error: unknown, res: Response): void {
    console.error("Controller error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export default new UrlController();
