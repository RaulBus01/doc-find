import { profiles } from "@/database/schema";
import { ProfileForm } from "@/interface/Interface";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export const addProfile = async (db: ExpoSQLiteDatabase, profile: ProfileForm) => {
    await db.insert(profiles).values({
          fullname: profile.name,
          gender: profile.gender,
          age: profile.age,
          diabetic: profile.diabetic,
          smoker: profile.smoker,
          hypertensive: profile.hypertensive,
          created_at: Date.now(),
          updated_at: Date.now(),
        } as typeof profiles.$inferInsert).execute()

}

export const getProfiles = async (db: ExpoSQLiteDatabase) => {
    return await db.select().from(profiles).execute();
}