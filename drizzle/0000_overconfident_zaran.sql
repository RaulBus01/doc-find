CREATE TABLE `profiles` (
	`name` text NOT NULL,
	`gender` text NOT NULL,
	`age` text NOT NULL,
	`diabetic` text NOT NULL,
	`hypertensive` text NOT NULL,
	`smoker` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_name_unique` ON `profiles` (`name`);