import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { double } from 'drizzle-orm/singlestore-core';

// Profiles table
export const profiles = sqliteTable('profiles', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    auth0Id: text("auth0Id").notNull(),
    fullname: text("fullname").unique().notNull(),
    gender: text("gender").notNull(),
    age: integer("age").notNull(),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
    updated_at: integer("updated_at").notNull().default(sql`(current_timestamp)`),
});

// Medications table
export const medications = sqliteTable('medications', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
});

// Junction table for profile medications (many-to-many)
export const profileMedications = sqliteTable('profile_medications', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    profileId: integer("profile_id").references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    medicationId: integer("medication_id").notNull().references(() => medications.id, { onDelete: 'cascade' }),
    permanent: integer("permanent", { mode: "boolean" }).notNull().default(false),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
});
// Allergies table
export const allergies = sqliteTable('allergies', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
});

// Junction table for profile allergies (many-to-many)
export const profileAllergies = sqliteTable('profile_allergies', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    allergyId: integer("allergy_id").notNull().references(() => allergies.id, { onDelete: 'cascade' }),
    severity: text("severity"),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
});

// Medical history entries
export const medicalHistory = sqliteTable('medical_history', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    condition: text("condition").notNull(),
    diagnosis_date: text("diagnosis_date"),
    treatment: text("treatment"),
    notes: text("notes"),
    status: text("status").notNull().default("ongoing"),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
    updated_at: integer("updated_at").notNull().default(sql`(current_timestamp)`),
});
export const healthIndicators = sqliteTable('health_indicators', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    profileId: integer("profile_id").references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    diabetic: text("diabetic").notNull(),
    hypertensive: text("hypertensive").notNull(),
    smoker: text("smoker").notNull(),
    created_at: integer("created_at").notNull().default(sql`(current_timestamp)`),
    updated_at: integer("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const cachedMedicalPlaces = sqliteTable('cached_medical_places', {
    id: text("place_id").primaryKey(), 
    name: text("name").notNull(),
    latitude: text("latitude").notNull(),
    longitude: text("longitude").notNull(),
    vicinity: text("vicinity"), // Address 
    business_status: text("business_status"),
    rating: text("rating"),
    user_ratings_total: text("user_ratings_total"),
    place_types: text("place_types"), 
    opening_hours: text("opening_hours"), 
    place_data: text("place_data"), 
    cached_at: integer("cached_at").notNull().default(sql`(current_timestamp)`),
    expires_at: integer("expires_at").notNull(),
});

// Define relations for profileMedications
export const profileMedicationsRelations = relations(profileMedications, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileMedications.profileId],
    references: [profiles.id],
  }),
  medication: one(medications, {
    fields: [profileMedications.medicationId],
    references: [medications.id],
  }),
}));

// Also add the reverse relations on medications
export const medicationsRelations = relations(medications, ({ many }) => ({
  profileMedications: many(profileMedications),
}));

// Export types for TypeScript type safety
export type Profile = typeof profiles.$inferSelect;
export type ProfileInput = typeof profiles.$inferInsert;


export type Medication = typeof medications.$inferSelect;
export type MedicationInput = typeof medications.$inferInsert;

export type ProfileMedication = typeof profileMedications.$inferSelect;
export type ProfileMedicationInput = typeof profileMedications.$inferInsert;

export type Allergy = typeof allergies.$inferSelect;
export type AllergyInput = typeof allergies.$inferInsert;

export type ProfileAllergy = typeof profileAllergies.$inferSelect;
export type ProfileAllergyInput = typeof profileAllergies.$inferInsert;

export type MedicalHistoryEntry = typeof medicalHistory.$inferSelect;
export type MedicalHistoryEntryInput = typeof medicalHistory.$inferInsert;

export type HealthIndicator = typeof healthIndicators.$inferSelect;
export type HealthIndicatorInput = typeof healthIndicators.$inferInsert;


