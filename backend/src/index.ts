import express, { Application } from "express";
import router from "./routes/url.route";

const app: Application = express();
const port: number = parseInt(process.env["SHORTNER_PORT"] ?? "4000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const server = app.listen(port, "0.0.0.0", (): void => {
  console.log(`URL Shortener API server is running on port ${port}`);
  console.log(`Visit http://localhost:${port}/api/docs for API documentation`);
});

process.on("SIGTERM", (): void => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
});

process.on("SIGINT", (): void => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
});

export default app;
