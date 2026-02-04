CREATE TABLE `spending_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`daily_limit` integer,
	`monthly_limit` integer,
	`total_limit` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spending_limits_owner_unique` ON `spending_limits` (`owner`);