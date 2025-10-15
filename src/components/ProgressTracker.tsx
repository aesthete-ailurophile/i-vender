import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, Circle, Clock, DollarSign, Award } from "lucide-react";
import { projectsAPI } from "../utils/api";

interface ProgressTrackerProps {
  accessToken: string;
  userId: string;
}

const defaultMilestones = [
  {
    id: 1,
    title: "Project Proposal & Design",
    description: "Complete project proposal, architecture design, and get professor approval",
    status: "pending",
    refund: 900, // 18% of ₹5000
    points: 100,
    dueDate: "30 days from start",
  },
  {
    id: 2,
    title: "Prototype Development",
    description: "Build working prototype with core features",
    status: "pending",
    refund: 1000, // 20% of ₹5000
    points: 250,
    dueDate: "60 days from start",
  },
  {
    id: 3,
    title: "Testing & Documentation",
    description: "Conduct testing, gather feedback, and complete documentation",
    status: "pending",
    refund: 900, // 18% of ₹5000
    points: 200,
    dueDate: "90 days from start",
  },
  {
    id: 4,
    title: "Final Implementation",
    description: "Deploy final version with all features and improvements",
    status: "pending",
    refund: 1000, // 20% of ₹5000
    points: 300,
    dueDate: "110 days from start",
  },
  {
    id: 5,
    title: "Presentation & Defense",
    description: "Present project to evaluation committee",
    status: "pending",
    refund: 700, // 14% of ₹5000 (Total = 90%)
    points: 150,
    dueDate: "120 days from start",
  }
];

export function ProgressTracker({ accessToken, userId }: ProgressTrackerProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await projectsAPI.getAll(accessToken);
      if (response.success) {
        setProjects(response.projects);
        if (response.projects.length > 0) {
          setSelectedProject(response.projects[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function handleCompleteMilestone(milestone: any) {
    if (!selectedProject) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await projectsAPI.updateMilestone(
        selectedProject.id,
        {
          milestoneId: milestone.id,
          status: "completed",
          refund: milestone.refund,
          points: milestone.points,
        },
        accessToken
      );

      if (response.success) {
        setMessage(`Milestone completed! Earned ₹${milestone.refund} refund and ${milestone.points} points.`);
        fetchProjects();
      }
    } catch (error: any) {
      console.error("Error completing milestone:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2">Project Progress Tracker</h2>
            <p className="text-muted-foreground">
              Track your milestones and earn refunds as you progress
            </p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Circle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No Active Projects</h3>
          <p className="text-muted-foreground mb-4">
            Start by selecting a project from the Ideas tab
          </p>
        </Card>
      </div>
    );
  }

  const overallProgress = Math.round((selectedProject.refundEarned / selectedProject.totalFee) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Project Progress Tracker</h2>
          <p className="text-muted-foreground">
            Track your milestones and earn refunds as you progress
          </p>
        </div>
      </div>

      {message && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Project Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="mb-1">{selectedProject.title}</h3>
            <p className="text-sm text-muted-foreground">
              Started: {new Date(selectedProject.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {selectedProject.status}
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Overall Progress</span>
            <span className="text-sm">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Refund Earned</span>
            </div>
            <div className="text-primary">
              ₹{selectedProject.refundEarned} / ₹{Math.round(selectedProject.totalFee * 0.9)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              (90% of ₹{selectedProject.totalFee} fee)
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Points Earned</span>
            </div>
            <div className="text-primary">{selectedProject.pointsEarned} pts</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget</span>
            </div>
            <div className="text-primary">{selectedProject.budget}</div>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <div className="space-y-4">
        <h3>Milestones</h3>
        
        {defaultMilestones.map((milestone, index) => (
          <Card key={milestone.id} className="p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Circle className="w-6 h-6 text-muted-foreground" />
                </div>
                {index < defaultMilestones.length - 1 && (
                  <div className="w-0.5 h-16 mt-2 bg-muted" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="mb-1">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>

                <div className="flex items-center gap-6 mb-3 text-sm text-muted-foreground">
                  <span>Due: {milestone.dueDate}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm">Refund: ₹{milestone.refund}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm">Points: {milestone.points}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleCompleteMilestone(milestone)}
                    disabled={isLoading}
                  >
                    Complete Milestone
                  </Button>
                  <Button size="sm" variant="outline">Upload Documents</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
