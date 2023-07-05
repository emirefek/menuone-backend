CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE "restaurants" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
ALTER TABLE "users_to_manager" ALTER COLUMN "user_id" SET DEFAULT uuid_generate_v4();