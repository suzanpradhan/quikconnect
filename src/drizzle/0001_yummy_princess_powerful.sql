ALTER TABLE "user" ADD COLUMN "confirmPassword" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "resetToken" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "resetTokenExpiry" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "nameUpdateAt" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phoneNumber" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "avtar" varchar;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "conformPassword";