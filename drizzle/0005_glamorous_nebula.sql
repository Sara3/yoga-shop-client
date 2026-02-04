DROP TABLE `product_purchases`;--> statement-breakpoint
DROP TABLE `spending_limits`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_purchases` (
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
--> statement-breakpoint
INSERT INTO `__new_purchases`("id", "owner", "class_id", "class_title", "price", "content_url", "tx_hash", "x_payment", "purchased_at") SELECT "id", "owner", "class_id", "class_title", "price", "content_url", "tx_hash", "x_payment", "purchased_at" FROM `purchases`;--> statement-breakpoint
DROP TABLE `purchases`;--> statement-breakpoint
ALTER TABLE `__new_purchases` RENAME TO `purchases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;