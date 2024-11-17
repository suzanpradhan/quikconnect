CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"conformPassword" varchar NOT NULL
);
