CREATE TABLE IF NOT EXISTS "tabs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"table_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"closed_at" timestamp with time zone,
	"orders" jsonb DEFAULT '[]'::jsonb
);
