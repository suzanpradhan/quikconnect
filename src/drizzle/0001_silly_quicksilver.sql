CREATE TABLE "black-listed-token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar PRIMARY KEY NOT NULL,
	"expiry" timestamp NOT NULL,
	CONSTRAINT "black-listed-token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "chat_member" ADD COLUMN "receiverId" uuid;--> statement-breakpoint
ALTER TABLE "chat_member" ADD COLUMN "memberName" varchar;--> statement-breakpoint
ALTER TABLE "chat_member" ADD COLUMN "creatorName" varchar;--> statement-breakpoint
ALTER TABLE "chat_member" ADD CONSTRAINT "chat_member_receiverId_user_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;