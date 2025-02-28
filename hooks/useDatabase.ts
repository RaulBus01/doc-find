// hooks/useDatabase.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/database/schema";

export function useDatabase() {
  const database = useSQLiteContext();
  return drizzle(database, { schema });
}