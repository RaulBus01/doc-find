CREATE TABLE `health_indicators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`diabetic` text NOT NULL,
	`hypertensive` text NOT NULL,
	`smoker` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `health_indicators_profile_id_unique` ON `health_indicators` (`profile_id`);--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `diabetic`;--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `hypertensive`;--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `smoker`;