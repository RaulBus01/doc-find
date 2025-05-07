import { allergies, HealthIndicatorInput, healthIndicators, medicalHistory, medications, Profile, profileAllergies, ProfileInput, profileMedications, profiles } from "@/database/schema";
import { eq, desc, and, like } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

type drizzleDB = ExpoSQLiteDatabase<typeof import("@/database/schema")> & { $client: SQLiteDatabase; }

export const getProfiles = async (drizzleDB: drizzleDB, userId: string) => {
    try {
        const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.auth0Id, userId as string))
            .orderBy(desc(profiles.created_at))
            .execute();
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return null;
    }
}

export const getProfileById = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
        return result.length === 0 ? null : result[0];
    } catch (error) {
        console.error("Error fetching profile by ID:", error);
        return null;
    }
}

export const getProfileHealthIndicatorById = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select()
            .from(healthIndicators)
            .where(eq(healthIndicators.profileId, profileId))
            .execute();
        return result.length === 0 ? null : result[0];
    } catch (error) {
        console.error("Error fetching health indicators:", error);
        return null;
    }
}

export const getProfileHealthIndicators = async (drizzleDB: drizzleDB, profiles: Profile[]) => {
    try {
        const healthMap: Record<string, any> = {};
        for (const p of profiles) {
            try {
                const health = await drizzleDB
                    .select()
                    .from(healthIndicators)
                    .where(eq(healthIndicators.profileId, p.id))
                    .execute();
                if (health && health.length > 0) {
                    healthMap[p.id] = health[0];
                }
            } catch (innerError) {
                console.error(`Error fetching health for profile ${p.id}:`, innerError);
            }
        }
        return healthMap;
    } catch (error) {
        console.error("Error fetching health indicators for profiles:", error);
        return {};
    }
}

export const deleteProfile = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        await drizzleDB
            .delete(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
        return true;
    } catch (error) {
        console.error("Error deleting profile:", error);
        return false;
    }
}

export const addProfile = async (drizzleDB: drizzleDB, profileToInsert: ProfileInput, healthData: HealthIndicatorInput) => {
    try {
        await drizzleDB.transaction(async (tx) => {
            const newProfile = await tx.insert(profiles).values(profileToInsert).returning({ id: profiles.id }).execute();
            const newProfileId = newProfile[0].id;
            await tx.insert(healthIndicators).values({
                profileId: newProfileId,
                hypertensive: healthData.hypertensive,
                diabetic: healthData.diabetic,
                smoker: healthData.smoker,
            }).execute();
        });
        return true;
    } catch (error) {
        console.error("Error adding profile:", error);
        return false;
    }
}

export const getProfileMedications = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select({
                id: profileMedications.id,
                medicationId: medications.id,
                name: medications.name,
                description: medications.description,
                permanent: profileMedications.permanent
            })
            .from(profileMedications)
            .innerJoin(medications, eq(profileMedications.medicationId, medications.id))
            .where(eq(profileMedications.profileId, profileId))
            .execute();
        return result;
    } catch (error) {
        console.error("Error fetching medications:", error);
        return [];
    }
}
export const getCompleteProfileData = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const [profile] = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .execute();

        if (!profile) return null;

        // Get health indicators
        const healthData = await getProfileHealthIndicatorById(drizzleDB, profileId);

        // Get medications
        const medications = await getProfileMedications(drizzleDB, profileId);

        // Get allergies
        const allergies = await getProfileAllergies(drizzleDB, profileId);

        // Get medical history
        const medicalHistory = await getProfileMedicalHistory(drizzleDB, profileId);

        return {
            ...profile,
            healthData,
            medications,
            allergies,
            medicalHistory
        };
    } catch (error) {
        console.error("Error fetching complete profile:", error);
        return null;
    }
};
export const getProfileAllergies = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select({
                id: profileAllergies.id,
                allergyId: allergies.id,
                name: allergies.name,
                description: allergies.description,
                severity: profileAllergies.severity,
            })
            .from(profileAllergies)
            .innerJoin(allergies, eq(profileAllergies.allergyId, allergies.id))
            .where(eq(profileAllergies.profileId, profileId))
            .execute();
        return result;
    } catch (error) {
        console.error("Error fetching allergies:", error);
        return [];
    }
}

export const getProfileMedicalHistory = async (drizzleDB: drizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select()
            .from(medicalHistory)
            .where(eq(medicalHistory.profileId, profileId))
            .execute();
        return result;
    } catch (error) {
        console.error("Error fetching medical history:", error);
        return [];
    }
}

export const deleteMedication = async (drizzleDB: drizzleDB, profileId: number, medicationId: number) => {
    try {
        console.log("Deleting medication with ID:", medicationId, "for profile ID:", profileId);
        const result = await drizzleDB
            .delete(profileMedications)
            .where(and(eq(profileMedications.profileId, profileId), eq(profileMedications.medicationId, medicationId)))
            .returning({ id: profileMedications.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        console.error("Error deleting medication:", error);
        return null;
    }
}

export const deleteAllergy = async (drizzleDB: drizzleDB, profileId: number, allergyId: number) => {
    try {
        console.log("Deleting allergy with ID:", allergyId, "for profile ID:", profileId);
        const result = await drizzleDB
            .delete(profileAllergies)
            .where(and(eq(profileAllergies.profileId, profileId), eq(profileAllergies.allergyId, allergyId)))
            .returning({ id: profileAllergies.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        console.error("Error deleting allergy:", error);
        return null;
    }
}

export const getMedicationsSuggestions = async (drizzleDB: drizzleDB, searchTerm: string) => {
    try {
        const results = await drizzleDB
            .select()
            .from(medications)
            .where(like(medications.name, `%${searchTerm}%`))
            .limit(3)
            .all();
        return results;
    } catch (error) {
        console.error("Error getting medication suggestions:", error);
        return [];
    }
}

export const getAllergiesSuggestions = async (drizzleDB: drizzleDB, searchTerm: string) => {
    try {
        const results = await drizzleDB
            .select()
            .from(allergies)
            .where(like(allergies.name, `%${searchTerm}%`))
            .limit(3)
            .all();
        return results;
    } catch (error) {
        console.error("Error getting allergy suggestions:", error);
        return [];
    }
}

export const getExistingMedications = async (drizzleDB: drizzleDB, medicationName: string) => {
    try {
        const results = await drizzleDB
            .select()
            .from(medications)
            .where(eq(medications.name, medicationName.trim()))
            .get();
        return results;
    } catch (error) {
        console.error("Error checking existing medication:", error);
        return null;
    }
}

export const getExistingAllergies = async (drizzleDB: drizzleDB, allergyName: string) => {
    try {
        const results = await drizzleDB
            .select()
            .from(allergies)
            .where(eq(allergies.name, allergyName.trim()))
            .get();
        return results;
    } catch (error) {
        console.error("Error checking existing allergy:", error);
        return null;
    }
}

export const insertMedication = async (drizzleDB: drizzleDB, medicationName: string) => {
    try {
        const insertResult = await drizzleDB
            .insert(medications)
            .values({
                name: medicationName.trim(),
                description: ""
            })
            .returning({ id: medications.id })
            .get();
        return insertResult;
    } catch (error) {
        console.error("Error inserting medication:", error);
        return null;
    }
}

export const insertAllergy = async (drizzleDB: drizzleDB, allergyName: string) => {
    try {
        const insertResult = await drizzleDB
            .insert(allergies)
            .values({
                name: allergyName.trim(),
                description: ""
            })
            .returning({ id: allergies.id })
            .get();
        return insertResult;
    } catch (error) {
        console.error("Error inserting allergy:", error);
        return null;
    }
}