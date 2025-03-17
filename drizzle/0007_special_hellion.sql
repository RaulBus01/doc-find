PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_health_indicators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`diabetic` text NOT NULL,
	`hypertensive` text NOT NULL,
	`smoker` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE set default
);
--> statement-breakpoint
INSERT INTO `__new_health_indicators`("id", "profile_id", "diabetic", "hypertensive", "smoker", "created_at", "updated_at") SELECT "id", "profile_id", "diabetic", "hypertensive", "smoker", "created_at", "updated_at" FROM `health_indicators`;--> statement-breakpoint
DROP TABLE `health_indicators`;--> statement-breakpoint
ALTER TABLE `__new_health_indicators` RENAME TO `health_indicators`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_profile_medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`medication_id` integer NOT NULL,
	`dosage` text,
	`frequency` text,
	`start_date` text,
	`end_date` text,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_profile_medications`("id", "profile_id", "medication_id", "dosage", "frequency", "start_date", "end_date", "created_at") SELECT "id", "profile_id", "medication_id", "dosage", "frequency", "start_date", "end_date", "created_at" FROM `profile_medications`;--> statement-breakpoint
DROP TABLE `profile_medications`;--> statement-breakpoint
ALTER TABLE `__new_profile_medications` RENAME TO `profile_medications`;