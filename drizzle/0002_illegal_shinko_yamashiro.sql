PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile_medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`medication_id` integer NOT NULL,
	`permanent` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_profile_medications`("id", "profile_id", "medication_id", "permanent", "created_at") SELECT "id", "profile_id", "medication_id", "permanent", "created_at" FROM `profile_medications`;--> statement-breakpoint
DROP TABLE `profile_medications`;--> statement-breakpoint
ALTER TABLE `__new_profile_medications` RENAME TO `profile_medications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;