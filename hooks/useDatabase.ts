
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/database/schema";
import { sql } from "drizzle-orm";

export function useDatabase() {
  const database = useSQLiteContext();
  const drizzleDB = drizzle(database, { schema });
  drizzleDB.run(sql`PRAGMA foreign_keys = ON;`);
  return drizzleDB;
}