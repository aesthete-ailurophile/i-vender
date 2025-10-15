import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Lightbulb, Sparkles, DollarSign, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { projectsAPI } from "../utils/api";

interface ProjectIdeaGeneratorProps {
  accessToken: string;
  userId: string;
}

const sampleIdeas = [
  {
    id: 1,
    title: "Smart Campus Navigation System",
    category: "IoT & Mobile",
    difficulty: "Intermediate",
    budget: "₹15,000-₹30,000",
    duration: "3-4 months",
    description: "Develop an AR-based indoor navigation system using beacons and smartphone sensors to help students navigate complex campus buildings.",
    technologies: ["React Native", "Bluetooth LE", "ARKit", "Firebase"],
    trending: true
  },
  {
    id: 2,
    title: "AI-Powered Study Group Matcher",
    category: "Machine Learning",
    difficulty: "Advanced",
    budget: "₹12,000-₹25,000",
    duration: "4-5 months",
    description: "Create an ML algorithm that matches students with similar learning styles and schedules to form effective study groups.",
    technologies: ["Python", "TensorFlow", "React", "MongoDB"],
    trending: true
  },
  {
    id: 3,
    title: "Automated Lab Equipment Booking",
    category: "Web Development",
    difficulty: "Beginner",
    budget: "₹8,000-₹15,000",
    duration: "2-3 months",
    description: "Build a web platform for students to reserve lab equipment with real-time availability tracking and automated reminders.",
    technologies: ["React", "Node.js", "PostgreSQL", "Express"],
    trending: false
  },
  {
    id: 4,
    title: "Campus Energy Monitoring Dashboard",
    category: "IoT & Sustainability",
    difficulty: "Intermediate",
    budget: "₹25,000-₹40,000",
    duration: "3-4 months",
    description: "Design an IoT system with sensors to monitor energy consumption across campus buildings and provide actionable insights.",
    technologies: ["Arduino", "Raspberry Pi", "InfluxDB", "Grafana"],
    trending: true
  }
];

export function ProjectIdeaGenerator({ accessToken, userId }: ProjectIdeaGeneratorProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = () => {
    setShowResults(true);
  };

  async function handleSelectProject(idea: any) {
    setMessage("");
    
    try {
      const response = await projectsAPI.create(
        {
          title: idea.title,
          category: idea.category,
          difficulty: idea.difficulty,
          budget: idea.budget,
          duration: idea.duration,
          description: idea.description,
          technologies: idea.technologies,
          totalFee: 5000, // ₹5000 initial fee
        },
        accessToken
      );

      if (response.success) {
        setMessage(`Project "${idea.title}" created successfully! Check the Progress tab to track milestones.`);
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      setMessage(`Error: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">AI-Powered Project Idea Generator</h2>
          <p className="text-muted-foreground">
            Get personalized project suggestions based on your preferences and constraints
          </p>
        </div>
      </div>

      {message && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Input Form */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="discipline">Academic Discipline</Label>
            <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
              <SelectTrigger id="discipline">
                <SelectValue placeholder="Select discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="electrical">Electrical Engineering</SelectItem>
                <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                <SelectItem value="civil">Civil Engineering</SelectItem>
                <SelectItem value="biomedical">Biomedical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Under ₹15,000</SelectItem>
                <SelectItem value="medium">₹15,000 - ₹40,000</SelectItem>
                <SelectItem value="high">₹40,000 - ₹80,000</SelectItem>
                <SelectItem value="very-high">Above ₹80,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Project Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">1-2 months</SelectItem>
                <SelectItem value="medium">3-4 months</SelectItem>
                <SelectItem value="long">5-6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Project Ideas
        </Button>
      </Card>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3>Recommended Projects for You</h3>
          </div>

          {sampleIdeas.map((idea) => (
            <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{idea.title}</h3>
                    {idea.trending && (
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{idea.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-sm">{idea.budget}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-sm">{idea.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-sm">{idea.difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Technologies:</p>
                <div className="flex flex-wrap gap-2">
                  {idea.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleSelectProject(idea)}
                >
                  Select This Project
                </Button>
                <Button variant="outline">View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
