import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Search, Star, MessageCircle, Video, Calendar, CheckCircle } from "lucide-react";
import { mentorsAPI } from "../utils/api";

interface MentorNetworkProps {
  accessToken: string;
}

const defaultMentors = [
  {
    id: "default-1",
    name: "Dr. Sarah Johnson",
    role: "Senior AI Engineer",
    company: "Google",
    expertise: ["Machine Learning", "Computer Vision", "Python"],
    rating: 4.9,
    sessions: 156,
    available: true,
    bio: "10+ years in ML/AI. Specialized in deep learning and neural networks."
  },
  {
    id: "default-2",
    name: "Prof. Michael Chen",
    role: "IoT Solutions Architect",
    company: "Cisco Systems",
    expertise: ["IoT", "Embedded Systems", "Cloud Computing"],
    rating: 4.8,
    sessions: 132,
    available: true,
    bio: "Expert in designing scalable IoT ecosystems for smart cities."
  },
  {
    id: "default-3",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    company: "Microsoft",
    expertise: ["React", "Node.js", "Azure", "DevOps"],
    rating: 4.7,
    sessions: 98,
    available: false,
    bio: "Passionate about web technologies and cloud architecture."
  },
  {
    id: "default-4",
    name: "Dr. Rajesh Kumar",
    role: "Robotics Engineer",
    company: "Tesla",
    expertise: ["Robotics", "Control Systems", "ROS"],
    rating: 5.0,
    sessions: 87,
    available: true,
    bio: "Former NASA robotics lead. Specializes in autonomous systems."
  },
  {
    id: "default-5",
    name: "Lisa Anderson",
    role: "Product Manager",
    company: "Amazon",
    expertise: ["Product Strategy", "Agile", "User Research"],
    rating: 4.6,
    sessions: 145,
    available: true,
    bio: "Helping students transform technical ideas into market-ready products."
  },
  {
    id: "default-6",
    name: "David Park",
    role: "Blockchain Developer",
    company: "Coinbase",
    expertise: ["Blockchain", "Smart Contracts", "Solidity"],
    rating: 4.8,
    sessions: 76,
    available: false,
    bio: "Building decentralized applications and teaching Web3 fundamentals."
  }
];

export function MentorNetwork({ accessToken }: MentorNetworkProps) {
  const [mentors, setMentors] = useState(defaultMentors);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  async function fetchMentors() {
    try {
      const response = await mentorsAPI.getAll();
      if (response.success && response.mentors && response.mentors.length > 0) {
        // Filter out any null or invalid mentor entries
        const validMentors = response.mentors.filter((m: any) => m && m.name && m.id);
        if (validMentors.length > 0) {
          setMentors(validMentors);
        }
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      // Keep using default mentors
    }
  }

  async function handleBook(mentorId: string) {
    setMessage("");
    
    try {
      const response = await mentorsAPI.book(
        mentorId,
        {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "14:00",
          topic: "Project guidance and mentorship"
        },
        accessToken
      );

      if (response.success) {
        setMessage("Session booked successfully! You'll receive a confirmation email.");
      }
    } catch (error: any) {
      console.error("Error booking session:", error);
      setMessage(`Error: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Alumni Mentor Network</h2>
          <p className="text-muted-foreground">
            Connect with industry experts and alumni for guidance on your project
          </p>
        </div>
      </div>

      {message && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, expertise, or company..." className="pl-10" />
          </div>
          <Button variant="outline">Filter by Expertise</Button>
          <Button variant="outline">Available Now</Button>
        </div>
      </Card>

      {/* Mentor Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {mentors.filter(m => m && m.name).map((mentor) => (
          <Card key={mentor.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {mentor.name?.split(' ').map(n => n[0]).join('') || 'M'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4>{mentor.name}</h4>
                    <p className="text-sm text-muted-foreground">{mentor.role}</p>
                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                  </div>
                  {mentor.available && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{mentor.bio}</p>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{mentor.rating}</span>
              </div>
              <div className="text-muted-foreground">
                {mentor.sessions} sessions
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Expertise:</p>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <MessageCircle className="w-3 h-3" />
                Chat
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Video className="w-3 h-3" />
                Call
              </Button>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={() => handleBook(mentor.id)}
              >
                <Calendar className="w-3 h-3" />
                Book
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
