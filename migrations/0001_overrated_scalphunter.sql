CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alias" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"restaurants_id" uuid NOT NULL,
	"started_at" timestamp NOT NULL,
	"days" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_manager" (
	"user_id" uuid NOT NULL,
	"restaurant_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_to_manager" ADD CONSTRAINT "users_to_manager_user_id_restaurant_id" PRIMARY KEY("user_id","restaurant_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_staff" (
	"user_id" uuid NOT NULL,
	"restaurant_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_to_staff" ADD CONSTRAINT "users_to_staff_user_id_restaurant_id" PRIMARY KEY("user_id","restaurant_id");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_manager" ADD CONSTRAINT "users_to_manager_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_manager" ADD CONSTRAINT "users_to_manager_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_staff" ADD CONSTRAINT "users_to_staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_staff" ADD CONSTRAINT "users_to_staff_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
