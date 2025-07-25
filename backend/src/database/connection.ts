import { Pool, PoolConfig } from "pg";
import { DatabaseConfig } from "../types/database";

const config: DatabaseConfig = {
  user: process.env["DB_USER"] ?? "postgres",
  host: process.env["DB_HOST"] ?? "localhost",
  database: process.env["DB_NAME"] ?? "url_shortener",
  password: process.env["DB_PASSWORD"] ?? "postgres",
  port: parseInt(process.env["DB_PORT"] ?? "5432", 10),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const poolConfig: PoolConfig = {
  ...config,
  statement_timeout: 30000,
  query_timeout: 30000,
};

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected to database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle database client", err);
  process.exit(-1);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down database pool...");
  pool
    .end()
    .then(() => {
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error("Error during database shutdown:", error);
      process.exit(1);
    });
});

process.on("SIGTERM", () => {
  console.log("Gracefully shutting down database pool...");
  pool
    .end()
    .then(() => {
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error("Error during database shutdown:", error);
      process.exit(1);
    });
});

export default pool;
