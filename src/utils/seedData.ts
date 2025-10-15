import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-36b2d027`;

/**
 * Seeds the database with initial mentor data
 * Call this once to populate mentors
 */
export async function seedMentors() {
  try {
    const response = await fetch(`${BASE_URL}/seed/mentors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to seed mentors");
    }

    const data = await response.json();
    console.log("✅ Mentors seeded successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error seeding mentors:", error);
    throw error;
  }
}

/**
 * Creates a demo user account
 * Email: demo@polypioneers.edu
 * Password: demo123
 */
export async function createDemoAccount() {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email: "demo@polypioneers.edu",
        password: "demo123",
        name: "Demo User",
        role: "student",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create demo account");
    }

    const data = await response.json();
    console.log("✅ Demo account created successfully");
    return data;
  } catch (error: any) {
    // Account might already exist
    if (error.message.includes("already")) {
      console.log("ℹ️ Demo account already exists");
      return { message: "Demo account already exists" };
    }
    console.error("❌ Error creating demo account:", error);
    throw error;
  }
}

/**
 * Initialize the platform with demo data
 * Run this once when first setting up
 */
export async function initializePlatform() {
  console.log("🚀 Initializing PolyPioneers platform...");
  
  try {
    // Seed mentors
    console.log("1️⃣ Seeding mentors...");
    await seedMentors();
    
    // Create demo account
    console.log("2️⃣ Creating demo account...");
    await createDemoAccount();
    
    console.log("✅ Platform initialized successfully!");
    console.log("\n📝 Demo credentials:");
    console.log("   Email: demo@polypioneers.edu");
    console.log("   Password: demo123");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Platform initialization failed:", error);
    throw error;
  }
}
