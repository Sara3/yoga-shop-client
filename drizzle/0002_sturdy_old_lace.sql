PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`class_id` text NOT NULL,
	`class_title` text NOT NULL,
	`price` text NOT NULL,
	`content_url` text NOT NULL,
	`tx_hash` text,
	`x_payment` text,
	`payment_method` text DEFAULT 'blockchain' NOT NULL,
	`stripe_session_id` text,
	`stripe_payment_intent_id` text,
	`purchased_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_purchases`("id", "owner", "class_id", "class_title", "price", "content_url", "tx_hash", "x_payment", "payment_method", "stripe_session_id", "stripe_payment_intent_id", "purchased_at") SELECT "id", "owner", "class_id", "class_title", "price", "content_url", "tx_hash", "x_payment", "payment_method", "stripe_session_id", "stripe_payment_intent_id", "purchased_at" FROM `purchases`;--> statement-breakpoint
DROP TABLE `purchases`;--> statement-breakpoint
ALTER TABLE `__new_purchases` RENAME TO `purchases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;