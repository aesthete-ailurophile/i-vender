import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { LandingHero } from "./components/LandingHero";
import { AuthForm } from "./components/AuthForm";
import { ProjectIdeaGenerator } from "./components/ProjectIdeaGenerator";
import { MentorNetwork } from "./components/MentorNetwork";
import { ProgressTracker } from "./components/ProgressTracker";
import { CampusManagement } from "./components/CampusManagement";
import { SustainabilityHub } from "./components/SustainabilityHub";
import { AdminDashboard } from "./components/AdminDashboard";
import { Lightbulb, Users, TrendingUp, MapPin, Recycle, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "./utils/supabase/client";
import { profileAPI } from "./utils/api";
import { seedMentors } from "./utils/seedData";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  const supabase = createClient();

  // Initialize platform data on first load
  useEffect(() => {
    const hasInitialized = localStorage.getItem("polypioneers_initialized");
    if (!hasInitialized) {
      seedMentors()
        .then(() => {
          localStorage.setItem("polypioneers_initialized", "true");
          console.log("✅ Platform initialized with demo data");
        })
        .catch((err) => {
          console.log("ℹ️ Initialization skipped or already done:", err.message);
        });
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchProfile();
    }
  }, [isAuthenticated, accessToken]);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      setAccessToken(session.access_token);
      setIsAuthenticated(true);
      setShowLanding(false);
    }
  }

  async function fetchProfile() {
    try {
      const response = await profileAPI.get(accessToken);
      if (response.success) {
        setProfile(response.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    setAccessToken("");
    setShowLanding(true);
  }

  if (showLanding) {
    return <LandingHero onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <AuthForm
        onSuccess={(userData, token) => {
          setUser(userData);
          setAccessToken(token);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-primary">PolyPioneers</h1>
                <p className="text-sm text-muted-foreground">Innovation on Demand</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {profile?.name || user?.email}
                </p>
                <p className="text-primary">
                  {profile?.loyaltyPoints || 0} pts
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Mentors</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="campus" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Campus</span>
            </TabsTrigger>
            <TabsTrigger value="sustainability" className="flex items-center gap-2">
              <Recycle className="w-4 h-4" />
              <span className="hidden sm:inline">Eco</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <ProjectIdeaGenerator accessToken={accessToken} userId={user?.id} />
          </TabsContent>

          <TabsContent value="mentors">
            <MentorNetwork accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker accessToken={accessToken} userId={user?.id} />
          </TabsContent>

          <TabsContent value="campus">
            <CampusManagement accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="sustainability">
            <SustainabilityHub 
              accessToken={accessToken} 
              profile={profile}
              onUpdate={fetchProfile}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard accessToken={accessToken} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
