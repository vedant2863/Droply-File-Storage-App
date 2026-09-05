import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { users, files } from "./schema";
import { eq } from "drizzle-orm";

export interface SeedOptions {
  force?: boolean;
  name?: string;
  email?: string;
  password?: string;
}

export async function ensureTablesExist() {
  console.log("🛠️ Ensuring PostgreSQL tables exist...");

  // 1. Users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "password" text NOT NULL,
      "avatar_url" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `);

  // 2. Refresh tokens table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "refresh_tokens" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "token" text NOT NULL UNIQUE,
      "expires_at" timestamp NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `);

  // 3. Files & folders table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "files" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "path" text NOT NULL,
      "size" integer DEFAULT 0 NOT NULL,
      "type" text NOT NULL,
      "file_url" text,
      "thumbnail_url" text,
      "imagekit_file_id" text,
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "parent_id" uuid,
      "is_folder" boolean DEFAULT false NOT NULL,
      "is_starred" boolean DEFAULT false NOT NULL,
      "is_trash" boolean DEFAULT false NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `);

  console.log("✅ Tables verified / created.");
}

export async function seedDatabase(options: SeedOptions = {}) {
  // Always ensure tables exist first before querying
  await ensureTablesExist();

  const targetEmail = (options.email || "demo@droply.com").toLowerCase().trim();
  const targetName = options.name || "Demo User";
  const targetPassword = options.password || "password123";

  console.log(`🌱 Seeding database for user: ${targetEmail}...`);

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, targetEmail))
    .limit(1);

  let userId: string;
  let isNewUser = false;

  const hashedPassword = await bcrypt.hash(targetPassword, 10);

  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
    if (options.force) {
      await db
        .update(users)
        .set({
          name: targetName,
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
      console.log(`ℹ️ Existing user ${targetEmail} updated.`);
    } else {
      console.log(`ℹ️ User ${targetEmail} already exists: ${userId}`);
    }
  } else {
    const [newUser] = await db
      .insert(users)
      .values({
        name: targetName,
        email: targetEmail,
        password: hashedPassword,
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      })
      .returning();

    userId = newUser.id;
    isNewUser = true;
    console.log(`✅ Created user: ${targetEmail}`);
  }

  // Check if sample folders exist for this user
  const existingFolders = await db
    .select()
    .from(files)
    .where(eq(files.userId, userId))
    .limit(1);

  let createdFolders = false;

  if (existingFolders.length === 0) {
    // Create sample folders
    const [docsFolder] = await db
      .insert(files)
      .values({
        name: "Documents",
        path: "/Documents",
        size: 0,
        type: "folder",
        userId,
        isFolder: true,
      })
      .returning();

    await db.insert(files).values({
      name: "Images",
      path: "/Images",
      size: 0,
      type: "folder",
      userId,
      isFolder: true,
      isStarred: true,
    });

    await db.insert(files).values({
      name: "Projects",
      path: "/Projects",
      size: 0,
      type: "folder",
      userId,
      isFolder: true,
    });

    // Create a subfolder inside Documents
    await db.insert(files).values({
      name: "Invoices",
      path: "/Documents/Invoices",
      size: 0,
      type: "folder",
      userId,
      parentId: docsFolder.id,
      isFolder: true,
    });

    createdFolders = true;
    console.log(
      "✅ Created sample folder tree (Documents, Invoices, Images, Projects)",
    );
    console.log(
      "✅ Created sample folder tree (Documents, Invoices, Images, Projects)",
    );
  }

  return {
    success: true,
    message: isNewUser
      ? `User ${targetEmail} and initial folder hierarchy created successfully.`
      : options.force
        ? `User ${targetEmail} credentials reset and folders verified.`
        : `User ${targetEmail} already exists. Ready to log in.`,
    user: {
      id: userId,
      name: targetName,
      email: targetEmail,
    },
    credentials: {
      email: targetEmail,
      password: targetPassword,
    },
    seeded: isNewUser || createdFolders,
  };
}

// Auto-run if executed directly via CLI
if (
  process.argv[1] &&
  process.argv[1].replace(/\\/g, "/").endsWith("lib/db/seed.ts")
) {
  seedDatabase()
    .then((result) => {
      console.log("🎉 Seeding completed successfully!", result.message);
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}
