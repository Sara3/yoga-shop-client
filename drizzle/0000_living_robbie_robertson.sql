CREATE TABLE `cached_classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`classes` text NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cached_classes_owner_unique` ON `cached_classes` (`owner`);--> statement-breakpoint
CREATE TABLE `cached_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`products` text NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cached_products_owner_unique` ON `cached_products` (`owner`);--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`class_id` text NOT NULL,
	`class_title` text NOT NULL,
	`price` text NOT NULL,
	`content_url` text NOT NULL,
	`tx_hash` text,
	`x_payment` text NOT NULL,
	`purchased_at` integer NOT NULL
);
