/**
 * Database Schema Definition for Yoga Shop Agent
 *
 * Tables:
 * - purchases: Tracks user purchases of yoga classes
 * - cachedClasses: Caches yoga class catalog data
 * - cachedProducts: Caches yoga product catalog data
 */

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Tracks user purchases of yoga classes
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  classId: text("class_id").notNull(),
  classTitle: text("class_title").notNull(),
  price: text("price").notNull(),
  contentUrl: text("content_url").notNull(),
  txHash: text("tx_hash"),
  xPayment: text("x_payment").notNull(),
  purchasedAt: integer("purchased_at", { mode: "timestamp" }).notNull(),
});

// Caches yoga class catalog data
export const cachedClasses = sqliteTable("cached_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull().unique(),
  classes: text("classes", { mode: "json" })
    .$type<Array<{ id: string; title: string; price: string }>>()
    .notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).notNull(),
});

// Caches yoga product catalog data
export const cachedProducts = sqliteTable("cached_products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull().unique(),
  products: text("products", { mode: "json" })
    .$type<Array<{ id: string; name: string; price_display: string }>>()
    .notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).notNull(),
});

// Wallet configuration for automatic payment signing
export const walletConfig = sqliteTable("wallet_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull().unique(),
  privateKey: text("private_key").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
