ALTER TABLE `profile_medications` ADD `permanent` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `profile_medications` DROP COLUMN `dosage`;--> statement-breakpoint
ALTER TABLE `profile_medications` DROP COLUMN `frequency`;--> statement-breakpoint
ALTER TABLE `profile_medications` DROP COLUMN `start_date`;--> statement-breakpoint
ALTER TABLE `profile_medications` DROP COLUMN `end_date`;