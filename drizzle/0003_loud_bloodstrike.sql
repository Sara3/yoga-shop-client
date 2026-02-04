CREATE TABLE `product_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`price` text NOT NULL,
	`acp_checkout_session_id` text NOT NULL,
	`acp_order_id` text,
	`payment_method` text DEFAULT 'stripe' NOT NULL,
	`purchased_at` integer NOT NULL
);
