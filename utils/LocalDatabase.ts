import { allergies, HealthIndicatorInput, healthIndicators, medicalHistory, medications, Profile, profileAllergies, ProfileInput, profileMedications, profiles } from "@/database/schema";
import { eq, desc,and,like } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";



type drizzleDB =ExpoSQLiteDatabase<typeof import("@/database/schema")> & { $client: SQLiteDatabase; }




export const getProfiles = async (drizzleDB:drizzleDB ,userId: string) => {
    const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.auth0Id, userId as string))
            .orderBy(desc(profiles.created_at))
            .execute();
    if (result.length == 0)
      return null;
    return result;
}
export const getProfileById = async (drizzleDB:drizzleDB,profileId: number) => {
    const result = await drizzleDB
            .select()
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
    if (result.length == 0)
      return null;
    return result[0];
}

export const getProfileHealthIndicatorById = async (drizzleDB:drizzleDB,profileId: number) => {
    const result = await drizzleDB
            .select()
            .from(healthIndicators)
            .where(eq(healthIndicators.profileId, profileId))
            .execute();
    if (result.length == 0)
      return null;
    return result[0];
}


export const getProfileHealthIndicators = async (drizzleDB:drizzleDB,profiles:Profile[] ) => {
    const healthMap: Record<string, any> = {};
       for (const p of profiles) {
         const health = await drizzleDB
           .select()
           .from(healthIndicators)
           .where(eq(healthIndicators.profileId, p.id))
           .execute();
         if (health && health.length > 0) {
           healthMap[p.id] = health[0];
         }
       }
    
         return healthMap;
}

export const deleteProfile = async (drizzleDB:drizzleDB,profileId: number) => {
     await drizzleDB
            .delete(profiles)
            .where(eq(profiles.id, profileId))
            .execute();
}

export const addProfile = async (drizzleDB:drizzleDB,profileToInsert:ProfileInput,healthData:HealthIndicatorInput) => {

 await drizzleDB.transaction(async (tx)=>{
        const newProfile = await tx.insert(profiles).values(profileToInsert).returning({ id: profiles.id }).execute();

        const newProfileId = newProfile[0].id;
        await tx.insert(healthIndicators).values({
          profileId: newProfileId,
          hypertensive: healthData.hypertensive,
            diabetic: healthData.diabetic,
            smoker: healthData.smoker,
        }).execute();

      })
    return true;
        
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
export const getProfileMedications = async (drizzleDB: drizzleDB, profileId: number) => {
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
};

export const getProfileAllergies = async (drizzleDB: drizzleDB, profileId: number) => {
    const result = await drizzleDB
        .select({
            id: profileAllergies.id,
            allergyId: allergies.id,
            name: allergies.name,
            description: allergies.description,
            severity: profileAllergies.severity,
            reaction: profileAllergies.reaction
        })
        .from(profileAllergies)
        .innerJoin(allergies, eq(profileAllergies.allergyId, allergies.id))
        .where(eq(profileAllergies.profileId, profileId))
        .execute();
        
    return result;
};

export const getProfileMedicalHistory = async (drizzleDB: drizzleDB, profileId: number) => {
    const result = await drizzleDB
        .select()
        .from(medicalHistory)
        .where(eq(medicalHistory.profileId, profileId))
        .execute();
        
    return result;
};

export const deleteMedication = async (drizzleDB: drizzleDB, profileId: number, medicationId: number) => {
    const result = await drizzleDB
        .delete(profileMedications)
        .where(and(eq(profileMedications.profileId, profileId), eq(profileMedications.medicationId, medicationId)))
        .returning({ id: profileMedications.id })
    if (result.length == 0)
        return null;

    return true;
}

export const getMedications = async (drizzleDB: drizzleDB, searchTerm: string) => {
    const results = await drizzleDB
            .select()
            .from(medications)
            .where(like(medications.name, `%${searchTerm}%`))
            .limit(3)
            .all();
    return results;
}
