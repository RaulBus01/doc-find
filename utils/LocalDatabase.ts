import { allergies, HealthIndicatorInput, healthIndicators, medicalHistory, MedicalHistoryEntryInput, medications, Profile, profileAllergies, ProfileInput, profileMedications, profiles } from "@/database/schema";
import { eq, desc, and, like } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

type DrizzleDB = ExpoSQLiteDatabase<typeof import("@/database/schema")> & { $client: SQLiteDatabase; };

const handleDatabaseError = (operation: string, error: any) => {
    console.error(`Error ${operation}:`, error);
    return null;
};

/**
 * Profile Operations
 */
export const getProfiles = async (drizzleDB: DrizzleDB, userId: string) => {
    try {
        const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.auth0Id, userId))
            .orderBy(desc(profiles.created_at))
            .execute();
        return result.length === 0 ? null : result;
    } catch (error) {
        return handleDatabaseError("fetching profiles", error);
    }
};

export const getProfileById = async (drizzleDB: DrizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
        return result.length === 0 ? null : result[0];
    } catch (error) {
        return handleDatabaseError("fetching profile by ID", error);
    }
};

export const deleteProfile = async (drizzleDB: DrizzleDB, profileId: number) => {
    try {
        await drizzleDB
            .delete(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
        return true;
    } catch (error) {
        return handleDatabaseError("deleting profile", error) ?? false;
    }
};

export const addProfile = async (drizzleDB: DrizzleDB, profileToInsert: ProfileInput, healthData: HealthIndicatorInput) => {
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
        return handleDatabaseError("adding profile", error) ?? false;
    }
};

/**
 * Health Indicator Operations
 */
export const getProfileHealthIndicatorById = async (drizzleDB: DrizzleDB, profileId: number) => {
    try {
        const result = await drizzleDB
            .select()
            .from(healthIndicators)
            .where(eq(healthIndicators.profileId, profileId))
            .execute();
        return result.length === 0 ? null : result[0];
    } catch (error) {
        return handleDatabaseError("fetching health indicators", error);
    }
};

export const getProfileHealthIndicators = async (drizzleDB: DrizzleDB, profiles: Profile[]) => {
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
};

/**
 * Medication Operations
 */
export const getProfileMedications = async (drizzleDB: DrizzleDB, profileId: number) => {
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
            .orderBy(desc(profileMedications.created_at))
            .execute();
        return result;
    } catch (error) {
        console.error("Error fetching medications:", error);
        return [];
    }
};

export const getMedicationsSuggestions = async (drizzleDB: DrizzleDB, searchTerm: string) => {
    try {
        return await drizzleDB
            .select()
            .from(medications)
            .where(like(medications.name, `%${searchTerm}%`))
            .limit(3)
            .all();
    } catch (error) {
        console.error("Error getting medication suggestions:", error);
        return [];
    }
};

export const getExistingMedicationsByName = async (drizzleDB: DrizzleDB, medicationName: string) => {
    try {
        return await drizzleDB
            .select()
            .from(medications)
            .where(eq(medications.name, medicationName.trim()))
            .get();
    } catch (error) {
        return handleDatabaseError("checking existing medication", error);
    }
};

export const getExistingMedicationsById = async (drizzleDB: DrizzleDB, profileId: number, medicationId: number) => {
    try {
        return await drizzleDB
            .select()
            .from(profileMedications)
            .where(
                and(
                    eq(profileMedications.profileId, profileId),
                    eq(profileMedications.medicationId, medicationId)
                )
            )
            .get();
    } catch (error) {
        return handleDatabaseError("checking existing medication by ID", error);
    }
};

export const insertMedication = async (drizzleDB: DrizzleDB, medicationName: string) => {
    try {
        return await drizzleDB
            .insert(medications)
            .values({
                name: medicationName.trim(),
                description: ""
            })
            .returning({ id: medications.id })
            .get();
    } catch (error) {
        return handleDatabaseError("inserting medication", error);
    }
};

export const deleteMedication = async (drizzleDB: DrizzleDB, profileId: number, medicationId: number) => {
    try {
        console.log("Deleting medication with ID:", medicationId, "for profile ID:", profileId);
        const result = await drizzleDB
            .delete(profileMedications)
            .where(and(eq(profileMedications.profileId, profileId), eq(profileMedications.medicationId, medicationId)))
            .returning({ id: profileMedications.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        return handleDatabaseError("deleting medication", error);
    }
};

export const addProfileMedication = async (drizzleDB: DrizzleDB, profileId: number, medicationId: number, permanent: boolean) => {
    try {
        const result = await drizzleDB
            .insert(profileMedications)
            .values({
                profileId: profileId,
                medicationId: medicationId,
                permanent: permanent,
            })
            .returning({ id: profileMedications.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        return handleDatabaseError("adding profile medication", error);
    }
};

/**
 * Allergy Operations
 */
export const getProfileAllergies = async (drizzleDB: DrizzleDB, profileId: number) => {
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
            .orderBy(desc(profileAllergies.created_at))
            .execute();
        return result;
    } catch (error) {
        console.error("Error fetching allergies:", error);
        return [];
    }
};

export const getAllergiesSuggestions = async (drizzleDB: DrizzleDB, searchTerm: string) => {
    try {
        return await drizzleDB
            .select()
            .from(allergies)
            .where(like(allergies.name, `%${searchTerm}%`))
            .limit(3)
            .all();
    } catch (error) {
        console.error("Error getting allergy suggestions:", error);
        return [];
    }
};

export const getExistingAllergiesByName = async (drizzleDB: DrizzleDB, allergyName: string) => {
    try {
        return await drizzleDB
            .select()
            .from(allergies)
            .where(eq(allergies.name, allergyName.trim()))
            .get();
    } catch (error) {
        return handleDatabaseError("checking existing allergy", error);
    }
};

export const getExistingAllergiesById = async (drizzleDB: DrizzleDB, profileId: number, allergyId: number) => {
    try {
        return await drizzleDB
            .select()
            .from(profileAllergies)
            .where(
                and(
                    eq(profileAllergies.profileId, profileId),
                    eq(profileAllergies.allergyId, allergyId)
                )
            )
            .get();
    } catch (error) {
        return handleDatabaseError("checking existing allergy by ID", error);
    }
};

export const insertAllergy = async (drizzleDB: DrizzleDB, allergyName: string) => {
    try {
        return await drizzleDB
            .insert(allergies)
            .values({
                name: allergyName.trim(),
                description: ""
            })
            .returning({ id: allergies.id })
            .get();
    } catch (error) {
        return handleDatabaseError("inserting allergy", error);
    }
};

export const deleteAllergy = async (drizzleDB: DrizzleDB, profileId: number, allergyId: number) => {
    try {
        console.log("Deleting allergy with ID:", allergyId, "for profile ID:", profileId);
        const result = await drizzleDB
            .delete(profileAllergies)
            .where(and(eq(profileAllergies.profileId, profileId), eq(profileAllergies.allergyId, allergyId)))
            .returning({ id: profileAllergies.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        return handleDatabaseError("deleting allergy", error);
    }
};

/**
 * Medical History Operations
 */
export const getProfileMedicalHistoryList = async (drizzleDB: DrizzleDB, profileId: number) => {
    try {
        return await drizzleDB
            .select()
            .from(medicalHistory)
            .where(eq(medicalHistory.profileId, profileId))
            .orderBy(desc(medicalHistory.created_at))
            .execute();
    } catch (error) {
        console.error("Error fetching medical history:", error);
        return [];
    }
};

export const getProfileMedicalHistoryById = async (drizzleDB: DrizzleDB, id: number) => {
    try {
        return await drizzleDB
            .select()
            .from(medicalHistory)
            .where(eq(medicalHistory.id, id))
            .execute();

    } catch (error) {
        console.error("Error fetching medical history:", error);
        return [];
    }
};

export const deleteMedicalHistory = async (drizzleDB: DrizzleDB, entryId: number) => {
    try {
        const result = await drizzleDB
            .delete(medicalHistory)
            .where(eq(medicalHistory.id, entryId))
            .returning({ id: medicalHistory.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        return handleDatabaseError("deleting medical history", error);
    }
};

export const addProfileMedicalHistory = async (drizzleDB: DrizzleDB, formData: MedicalHistoryEntryInput) => {
    try {
        const result = await drizzleDB
            .insert(medicalHistory)
            .values({
                profileId: formData.profileId,
                condition: formData.condition.trim(),
                diagnosis_date: formData.diagnosis_date?.toString(),
                treatment: formData.treatment?.trim(),
                notes: formData.notes?.trim(),
                status: formData.status?.toLowerCase() as "ongoing" | "resolved" | "chronic",
            })
            .returning({ id: medicalHistory.id })
            .execute();
        return result.length === 0 ? null : true;
    } catch (error) {
        return handleDatabaseError("adding medical history", error);
    }
}
export const updateMedicalHistoryEntry = async (drizzleDB: DrizzleDB, formData: MedicalHistoryEntryInput) => {
  try {
    const result = await drizzleDB
      .update(medicalHistory)
      .set({
        condition: formData.condition,
        diagnosis_date: formData.diagnosis_date,
        treatment: formData.treatment,
        notes: formData.notes,
        status: formData.status,
      })
      .where(eq(medicalHistory.id, formData.id as number))
      .returning({ id: medicalHistory.id })
      .execute();
    
    return result.length > 0;
  } catch (error) {
    return handleDatabaseError("updating medical history", error);
  }
};
/**
 * Aggregated Data Operations
 */
export const getCompleteProfileData = async (drizzleDB: DrizzleDB, profileId: number) => {
    try {
        const [profile] = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .execute();

        if (!profile) return null;

        const [
            healthData,
            medications,
            allergies,
            medicalHistoryData
        ] = await Promise.all([
            getProfileHealthIndicatorById(drizzleDB, profileId),
            getProfileMedications(drizzleDB, profileId),
            getProfileAllergies(drizzleDB, profileId),
            getProfileMedicalHistoryList(drizzleDB, profileId)
        ]);

        return {
            ...profile,
            healthData,
            medications,
            allergies,
            medicalHistory: medicalHistoryData
        };
    } catch (error) {
        return handleDatabaseError("fetching complete profile", error);
    }
};