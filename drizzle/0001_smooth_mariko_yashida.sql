ALTER TABLE `profiles` RENAME COLUMN "name" TO "fullname";--> statement-breakpoint
DROP INDEX `profiles_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_fullname_unique` ON `profiles` (`fullname`);