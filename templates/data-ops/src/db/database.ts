import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";

let db: PlanetScaleDatabase;

export function initDatabase(connection: {
  host: string;
  username: string;
  password: string;
}) {
  db = drizzle({ connection });
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
