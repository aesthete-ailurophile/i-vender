import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Lightbulb, Award, TrendingUp, AlertTriangle, Recycle } from "lucide-react";
import { adminAPI } from "../utils/api";

interface AdminDashboardProps {
  accessToken: string;
}

const projectData = [
  { month: "Sep", projects: 45 },
  { month: "Oct", projects: 62 },
  { month: "Nov", projects: 58 },
  { month: "Dec", projects: 71 },
  { month: "Jan", projects: 68 },
  { month: "Feb", projects: 79 }
];

const categoryData = [
  { name: "IoT & Embedded", value: 30, color: "#8b5cf6" },
  { name: "Machine Learning", value: 25, color: "#3b82f6" },
  { name: "Web Development", value: 20, color: "#10b981" },
  { name: "Robotics", value: 15, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#6b7280" }
];

const mentorshipData = [
  { month: "Sep", sessions: 120 },
  { month: "Oct", sessions: 145 },
  { month: "Nov", sessions: 138 },
  { month: "Dec", sessions: 162 },
  { month: "Jan", sessions: 171 },
  { month: "Feb", sessions: 189 }
];

const sustainabilityData = [
  { week: "Week 1", bottles: 450 },
  { week: "Week 2", bottles: 520 },
  { week: "Week 3", bottles: 480 },
  { week: "Week 4", bottles: 610 }
];

export function AdminDashboard({ accessToken }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalSessions: 0,
    totalBottlesRecycled: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await adminAPI.getStats(accessToken);
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  }

  const displayStats = [
    {
      title: "Active Students",
      value: stats.totalUsers.toString(),
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      change: "+8%",
      icon: Lightbulb,
      trend: "up"
    },
    {
      title: "Mentor Sessions",
      value: stats.totalSessions.toString(),
      change: "+15%",
      icon: Award,
      trend: "up"
    },
    {
      title: "Bottles Recycled",
      value: stats.totalBottlesRecycled.toString(),
      change: "+23%",
      icon: Recycle,
      trend: "up"
    }
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics and insights for campus innovation ecosystem
          </p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Admin View
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-primary mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Projects Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="projects" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Projects by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Top Projects This Semester</h3>
            <div className="space-y-3">
              {[
                { name: "Smart Campus Navigation", students: 4, status: "In Progress", progress: 75 },
                { name: "AI Study Group Matcher", students: 3, status: "In Progress", progress: 60 },
                { name: "Lab Equipment Booking System", students: 2, status: "Testing", progress: 90 },
                { name: "Energy Monitoring Dashboard", students: 4, status: "In Progress", progress: 45 }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="mb-1">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.students} students • {project.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary">{project.progress}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Mentorship Sessions Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mentorshipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Top Mentors</h3>
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", sessions: 156, rating: 4.9 },
                  { name: "Lisa Anderson", sessions: 145, rating: 4.6 },
                  { name: "Prof. Michael Chen", sessions: 132, rating: 4.8 },
                  { name: "Dr. Rajesh Kumar", sessions: 87, rating: 5.0 }
                ].map((mentor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="mb-1">{mentor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mentor.sessions} sessions • ⭐ {mentor.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Mentorship Impact</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-primary mb-1">94%</div>
                  <p className="text-sm text-muted-foreground">Project Success Rate</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-primary mb-1">4.7/5.0</div>
                  <p className="text-sm text-muted-foreground">Average Mentor Rating</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-primary mb-1">2.5 hrs</div>
                  <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Bottles Recycled This Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sustainabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bottles" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-primary mb-1">12,450</div>
              <p className="text-muted-foreground">Total Bottles Recycled</p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-primary mb-1">3,200 kg</div>
              <p className="text-muted-foreground">CO₂ Emissions Saved</p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-primary mb-1">62,250</div>
              <p className="text-muted-foreground">Points Distributed</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
