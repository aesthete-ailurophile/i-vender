import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ============= AUTH ROUTES =============

// Sign up route
app.post("/make-server-36b2d027/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      loyaltyPoints: 0,
      bottlesRecycled: 0,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Error in signup route: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return { error: "No authorization token provided", user: null };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return { error: "Invalid or expired token", user: null };
  }

  return { user: data.user, error: null };
}

// ============= PROJECT ROUTES =============

// Create a new project
app.post("/make-server-36b2d027/projects", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const projectData = await c.req.json();
    const projectId = crypto.randomUUID();

    const project = {
      id: projectId,
      userId: user!.id,
      ...projectData,
      status: "active",
      progress: 0,
      refundEarned: 0,
      pointsEarned: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`project:${projectId}`, project);
    await kv.set(`user_project:${user!.id}:${projectId}`, projectId);

    return c.json({ success: true, project });
  } catch (error) {
    console.log(`Error creating project: ${error}`);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Get user's projects
app.get("/make-server-36b2d027/projects", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userProjectKeys = await kv.getByPrefix(`user_project:${user!.id}:`);
    const projectIds = userProjectKeys.map(({ value }) => value);

    const projects = await kv.mget(projectIds.map((id) => `project:${id}`));

    return c.json({ success: true, projects });
  } catch (error) {
    console.log(`Error fetching projects: ${error}`);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Update project milestone
app.post("/make-server-36b2d027/projects/:id/milestones", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const projectId = c.req.param("id");
    const { milestoneId, status, refund, points } = await c.req.json();

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    if (project.userId !== user!.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Calculate maximum refund (90% of total fee)
    const maxRefund = Math.round(project.totalFee * 0.9);
    
    // Ensure we don't exceed 90% total refund
    const newTotalRefund = project.refundEarned + refund;
    if (newTotalRefund > maxRefund) {
      return c.json({ error: "Cannot exceed 90% refund limit" }, 400);
    }

    // Update project
    project.refundEarned += refund;
    project.pointsEarned += points;
    project.updatedAt = new Date().toISOString();
    await kv.set(`project:${projectId}`, project);

    // Update user points
    const userData = await kv.get(`user:${user!.id}`);
    if (userData) {
      userData.loyaltyPoints += points;
      await kv.set(`user:${user!.id}`, userData);
    }

    return c.json({ success: true, project });
  } catch (error) {
    console.log(`Error updating milestone: ${error}`);
    return c.json({ error: "Failed to update milestone" }, 500);
  }
});

// ============= MENTOR ROUTES =============

// Get all mentors
app.get("/make-server-36b2d027/mentors", async (c) => {
  try {
    const mentors = await kv.getByPrefix("mentor:");
    return c.json({ success: true, mentors: mentors.map(({ value }) => value) });
  } catch (error) {
    console.log(`Error fetching mentors: ${error}`);
    return c.json({ error: "Failed to fetch mentors" }, 500);
  }
});

// Book mentorship session
app.post("/make-server-36b2d027/mentors/:mentorId/book", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const mentorId = c.req.param("mentorId");
    const { date, time, topic } = await c.req.json();

    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      mentorId,
      studentId: user!.id,
      date,
      time,
      topic,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`session:${sessionId}`, session);
    await kv.set(`user_session:${user!.id}:${sessionId}`, sessionId);

    return c.json({ success: true, session });
  } catch (error) {
    console.log(`Error booking session: ${error}`);
    return c.json({ error: "Failed to book session" }, 500);
  }
});

// ============= CAMPUS MANAGEMENT ROUTES =============

// Report campus issue
app.post("/make-server-36b2d027/campus/issues", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const issueData = await c.req.json();
    const issueId = crypto.randomUUID();

    const issue = {
      id: issueId,
      userId: user!.id,
      ...issueData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`issue:${issueId}`, issue);

    return c.json({ success: true, issue });
  } catch (error) {
    console.log(`Error reporting issue: ${error}`);
    return c.json({ error: "Failed to report issue" }, 500);
  }
});

// Get campus issues
app.get("/make-server-36b2d027/campus/issues", async (c) => {
  try {
    const issues = await kv.getByPrefix("issue:");
    return c.json({ success: true, issues: issues.map(({ value }) => value) });
  } catch (error) {
    console.log(`Error fetching issues: ${error}`);
    return c.json({ error: "Failed to fetch issues" }, 500);
  }
});

// Mark attendance
app.post("/make-server-36b2d027/campus/attendance", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const date = new Date().toISOString().split("T")[0];
    const attendanceId = `attendance:${user!.id}:${date}`;

    const attendance = {
      userId: user!.id,
      date,
      checkInTime: new Date().toISOString(),
      status: "present",
    };

    await kv.set(attendanceId, attendance);

    return c.json({ success: true, attendance });
  } catch (error) {
    console.log(`Error marking attendance: ${error}`);
    return c.json({ error: "Failed to mark attendance" }, 500);
  }
});

// Send emergency alert
app.post("/make-server-36b2d027/campus/emergency", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const { type, location, description } = await c.req.json();
    const alertId = crypto.randomUUID();

    const alert = {
      id: alertId,
      userId: user!.id,
      type,
      location,
      description,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`emergency:${alertId}`, alert);

    // In a real implementation, this would trigger notifications to staff
    console.log(`EMERGENCY ALERT: ${type} at ${location} - ${description}`);

    return c.json({ success: true, alert });
  } catch (error) {
    console.log(`Error sending emergency alert: ${error}`);
    return c.json({ error: "Failed to send alert" }, 500);
  }
});

// ============= SUSTAINABILITY ROUTES =============

// Record bottle recycling
app.post("/make-server-36b2d027/sustainability/recycle", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const { bottleCount = 1, qrCode } = await c.req.json();
    const pointsPerBottle = 5;
    const pointsEarned = bottleCount * pointsPerBottle;

    // Update user data
    const userData = await kv.get(`user:${user!.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    userData.bottlesRecycled += bottleCount;
    userData.loyaltyPoints += pointsEarned;
    await kv.set(`user:${user!.id}`, userData);

    // Record transaction
    const transactionId = crypto.randomUUID();
    const transaction = {
      id: transactionId,
      userId: user!.id,
      type: "recycle",
      bottles: bottleCount,
      points: pointsEarned,
      qrCode,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`transaction:${transactionId}`, transaction);

    return c.json({
      success: true,
      pointsEarned,
      totalPoints: userData.loyaltyPoints,
      totalBottles: userData.bottlesRecycled,
    });
  } catch (error) {
    console.log(`Error recording recycling: ${error}`);
    return c.json({ error: "Failed to record recycling" }, 500);
  }
});

// Redeem reward
app.post("/make-server-36b2d027/sustainability/redeem", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const { rewardId, pointsCost } = await c.req.json();

    // Get user data
    const userData = await kv.get(`user:${user!.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    if (userData.loyaltyPoints < pointsCost) {
      return c.json({ error: "Insufficient points" }, 400);
    }

    // Deduct points
    userData.loyaltyPoints -= pointsCost;
    await kv.set(`user:${user!.id}`, userData);

    // Record redemption
    const redemptionId = crypto.randomUUID();
    const redemption = {
      id: redemptionId,
      userId: user!.id,
      rewardId,
      pointsCost,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`redemption:${redemptionId}`, redemption);

    return c.json({
      success: true,
      remainingPoints: userData.loyaltyPoints,
      redemption,
    });
  } catch (error) {
    console.log(`Error redeeming reward: ${error}`);
    return c.json({ error: "Failed to redeem reward" }, 500);
  }
});

// Get leaderboard
app.get("/make-server-36b2d027/sustainability/leaderboard", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const sortedUsers = users
      .map(({ value }) => value)
      .filter((user) => user.bottlesRecycled > 0)
      .sort((a, b) => b.bottlesRecycled - a.bottlesRecycled)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        bottles: user.bottlesRecycled,
        points: user.loyaltyPoints,
      }));

    return c.json({ success: true, leaderboard: sortedUsers });
  } catch (error) {
    console.log(`Error fetching leaderboard: ${error}`);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

// ============= ANALYTICS ROUTES (Admin) =============

app.get("/make-server-36b2d027/admin/stats", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    // Get counts
    const users = await kv.getByPrefix("user:");
    const projects = await kv.getByPrefix("project:");
    const sessions = await kv.getByPrefix("session:");
    const transactions = await kv.getByPrefix("transaction:");

    const stats = {
      totalUsers: users.length,
      activeProjects: projects.filter(({ value }) => value.status === "active").length,
      totalSessions: sessions.length,
      totalBottlesRecycled: transactions
        .filter(({ value }) => value.type === "recycle")
        .reduce((sum, { value }) => sum + value.bottles, 0),
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.log(`Error fetching admin stats: ${error}`);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// ============= USER PROFILE ROUTES =============

app.get("/make-server-36b2d027/profile", async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userData = await kv.get(`user:${user!.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true, profile: userData });
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Seed initial mentors (run once)
app.post("/make-server-36b2d027/seed/mentors", async (c) => {
  try {
    const mentors = [
      {
        id: "mentor-1",
        name: "Dr. Sarah Johnson",
        role: "Senior AI Engineer",
        company: "Google",
        expertise: ["Machine Learning", "Computer Vision", "Python"],
        rating: 4.9,
        sessions: 156,
        available: true,
        bio: "10+ years in ML/AI. Specialized in deep learning and neural networks.",
      },
      {
        id: "mentor-2",
        name: "Prof. Michael Chen",
        role: "IoT Solutions Architect",
        company: "Cisco Systems",
        expertise: ["IoT", "Embedded Systems", "Cloud Computing"],
        rating: 4.8,
        sessions: 132,
        available: true,
        bio: "Expert in designing scalable IoT ecosystems for smart cities.",
      },
      {
        id: "mentor-3",
        name: "Emily Rodriguez",
        role: "Full Stack Developer",
        company: "Microsoft",
        expertise: ["React", "Node.js", "Azure", "DevOps"],
        rating: 4.7,
        sessions: 98,
        available: false,
        bio: "Passionate about web technologies and cloud architecture.",
      },
    ];

    for (const mentor of mentors) {
      await kv.set(`mentor:${mentor.id}`, mentor);
    }

    return c.json({ success: true, message: "Mentors seeded successfully" });
  } catch (error) {
    console.log(`Error seeding mentors: ${error}`);
    return c.json({ error: "Failed to seed mentors" }, 500);
  }
});

Deno.serve(app.fetch);
