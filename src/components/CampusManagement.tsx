import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MapPin, AlertTriangle, CheckCircle, Clock, Camera, Users } from "lucide-react";
import { campusAPI } from "../utils/api";

interface CampusManagementProps {
  accessToken: string;
}

const attendanceData = {
  todayDate: new Date().toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  }),
  checkInTime: new Date().toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit" 
  }),
  status: "Present",
};

export function CampusManagement({ accessToken }: CampusManagementProps) {
  const [reportText, setReportText] = useState("");
  const [reportedIssues, setReportedIssues] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    try {
      const response = await campusAPI.getIssues();
      if (response.success) {
        setReportedIssues(response.issues);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  }

  async function handleSubmitReport() {
    if (!reportText.trim()) {
      setMessage("Please describe the issue");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await campusAPI.reportIssue(
        {
          title: reportText.substring(0, 50),
          description: reportText,
          location: "Campus Location",
          type: "Cleanliness",
          priority: "medium",
        },
        accessToken
      );

      if (response.success) {
        setMessage("Issue reported successfully!");
        setReportText("");
        fetchIssues();
      }
    } catch (error: any) {
      console.error("Error reporting issue:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMarkAttendance() {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await campusAPI.markAttendance(accessToken);
      if (response.success) {
        setMessage("Attendance marked successfully!");
        setHasCheckedIn(true);
      }
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEmergencyAlert(type: string) {
    const confirmed = confirm(`Are you sure you want to send a ${type} alert? This will notify campus security.`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await campusAPI.sendEmergency(
        {
          type,
          location: "Current Location",
          description: `${type} reported via emergency system`,
        },
        accessToken
      );

      if (response.success) {
        setMessage("Emergency alert sent! Help is on the way.");
      }
    } catch (error: any) {
      console.error("Error sending emergency alert:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Campus Management</h2>
          <p className="text-muted-foreground">
            Report issues, track attendance, and stay updated on campus activities
          </p>
        </div>
      </div>

      {message && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issue Reporting</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {/* Report Form */}
          <Card className="p-6">
            <h3 className="mb-4">Report a Campus Issue</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start gap-2">
                  <MapPin className="w-4 h-4" />
                  Set Location
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Camera className="w-4 h-4" />
                  Add Photo
                </Button>
              </div>
              
              <Textarea
                placeholder="Describe the issue in detail..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={4}
              />

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
                <Button variant="outline" onClick={() => setReportText("")}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* Reported Issues */}
          <div className="space-y-3">
            <h3>Recent Reports</h3>
            {reportedIssues.length > 0 ? (
              reportedIssues.slice(0, 10).map((issue) => (
                <Card key={issue.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{issue.title}</h4>
                        <Badge
                          variant={
                            issue.priority === "high" ? "destructive" :
                            issue.priority === "medium" ? "secondary" :
                            "outline"
                          }
                        >
                          {issue.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{issue.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(issue.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {issue.status === "resolved" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </Badge>
                    )}
                    {issue.status === "in-progress" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </Badge>
                    )}
                    {issue.status === "pending" && (
                      <Badge variant="outline" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No issues reported yet. Be the first to help improve our campus!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Attendance Overview</h3>
            
            <div className="bg-primary/5 rounded-lg p-6 mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{attendanceData.todayDate}</p>
              {hasCheckedIn ? (
                <>
                  <div className="text-primary mb-2">Status: Present</div>
                  <p className="text-sm text-muted-foreground">Checked in at {attendanceData.checkInTime}</p>
                </>
              ) : (
                <>
                  <div className="text-muted-foreground mb-2">Status: Not Checked In</div>
                  <p className="text-sm text-muted-foreground">Mark your attendance for today</p>
                </>
              )}
            </div>

            <Button 
              className="w-full gap-2"
              onClick={handleMarkAttendance}
              disabled={hasCheckedIn || isSubmitting}
            >
              <Users className="w-4 h-4" />
              {hasCheckedIn ? "Already Checked In" : "Mark Attendance"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Supports RFID and Face Recognition (simulated)
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card className="p-6 border-destructive">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="mb-2">Emergency Alert System</h3>
              <p className="text-muted-foreground">
                Use this feature only for genuine emergencies. False alerts will be penalized.
              </p>
            </div>

            <div className="grid gap-3 mb-6">
              <Button 
                variant="destructive" 
                size="lg" 
                className="gap-2"
                onClick={() => handleEmergencyAlert("Medical Emergency")}
                disabled={isSubmitting}
              >
                <AlertTriangle className="w-5 h-5" />
                Medical Emergency
              </Button>
              <Button 
                variant="destructive" 
                size="lg" 
                className="gap-2"
                onClick={() => handleEmergencyAlert("Safety Threat")}
                disabled={isSubmitting}
              >
                <AlertTriangle className="w-5 h-5" />
                Safety Threat
              </Button>
              <Button 
                variant="destructive" 
                size="lg" 
                className="gap-2"
                onClick={() => handleEmergencyAlert("Fire Hazard")}
                disabled={isSubmitting}
              >
                <AlertTriangle className="w-5 h-5" />
                Fire Hazard
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={() => handleEmergencyAlert("Other Emergency")}
                disabled={isSubmitting}
              >
                <AlertTriangle className="w-5 h-5" />
                Other Emergency
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm">
                <strong>Emergency Contacts:</strong>
              </p>
              <p className="text-sm text-muted-foreground">Campus Security: (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">Medical Center: (555) 123-4568</p>
              <p className="text-sm text-muted-foreground">Fire Department: 911</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
