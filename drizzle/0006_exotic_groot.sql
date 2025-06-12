PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile_allergies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`allergy_id` integer NOT NULL,
	`severity` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`allergy_id`) REFERENCES `allergies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_profile_allergies`("id", "profile_id", "allergy_id", "severity", "created_at") SELECT "id", "profile_id", "allergy_id", "severity", "created_at" FROM `profile_allergies`;--> statement-breakpoint
DROP TABLE `profile_allergies`;--> statement-breakpoint
ALTER TABLE `__new_profile_allergies` RENAME TO `profile_allergies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;