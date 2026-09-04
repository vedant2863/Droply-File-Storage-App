import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { db } from "./index";
import { users, files } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const demoEmail = "demo@droply.com";
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, demoEmail))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      console.log("ℹ️ Demo user already exists:", existingUser[0].id);
      userId = existingUser[0].id;
    } else {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const [newUser] = await db
        .insert(users)
        .values({
          name: "Demo User",
          email: demoEmail,
          password: hashedPassword,
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        })
        .returning();

      userId = newUser.id;
      console.log(
        "✅ Created demo user:",
        demoEmail,
        "(Password: password123)",
      );

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

      const [imagesFolder] = await db
        .insert(files)
        .values({
          name: "Images",
          path: "/Images",
          size: 0,
          type: "folder",
          userId,
          isFolder: true,
          isStarred: true,
        })
        .returning();

      const [projectsFolder] = await db
        .insert(files)
        .values({
          name: "Projects",
          path: "/Projects",
          size: 0,
          type: "folder",
          userId,
          isFolder: true,
        })
        .returning();

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

      console.log(
        "✅ Created sample folder tree (Documents, Documents/Invoices, Images, Projects)",
      );
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
