ALTER TABLE "user" ADD COLUMN "conformPassword" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "avtar";