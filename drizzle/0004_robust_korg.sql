PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fullname` text NOT NULL,
	`gender` text NOT NULL,
	`age` integer NOT NULL,
	`diabetic` text NOT NULL,
	`hypertensive` text NOT NULL,
	`smoker` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_profiles`("id", "fullname", "gender", "age", "diabetic", "hypertensive", "smoker", "created_at", "updated_at") SELECT "id", "fullname", "gender", "age", "diabetic", "hypertensive", "smoker", "created_at", "updated_at" FROM `profiles`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
ALTER TABLE `__new_profiles` RENAME TO `profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_fullname_unique` ON `profiles` (`fullname`);