import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Lightbulb, Users, Award, Recycle, TrendingUp, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Lightbulb className="w-5 h-5 text-primary" />
            <span className="text-primary">Innovation on Demand</span>
          </div>
          <h1 className="mb-6">PolyPioneers – IDEA Vending Machine</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            A cutting-edge platform fostering innovation, collaboration, and responsible campus engagement. 
            Combine problem-solving resources, alumni expertise, sustainability incentives, and campus services 
            into one unified ecosystem.
          </p>
          <Button onClick={onGetStarted} size="lg" className="mr-4">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">AI-Powered Project Ideas</h3>
            <p className="text-muted-foreground">
              Get personalized project suggestions based on your discipline, budget, and emerging technologies.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Alumni Mentorship Network</h3>
            <p className="text-muted-foreground">
              Connect with industry professionals and alumni for real-time consultancy and guidance.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Milestone-Based Rewards</h3>
            <p className="text-muted-foreground">
              Earn refunds and loyalty points as you achieve project milestones and complete tasks.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Recycle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Sustainability Incentives</h3>
            <p className="text-muted-foreground">
              Recycle plastic bottles and earn points redeemable as campus credits or cash rewards.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Real-Time Analytics</h3>
            <p className="text-muted-foreground">
              Track progress, analyze trends, and predict hottest research areas with data-driven insights.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Campus Management</h3>
            <p className="text-muted-foreground">
              Report issues, track attendance, and receive emergency alerts all in one place.
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-primary mb-2">2,500+</div>
            <p className="text-muted-foreground">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-primary mb-2">150+</div>
            <p className="text-muted-foreground">Alumni Mentors</p>
          </div>
          <div className="text-center">
            <div className="text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-primary mb-2">50K+</div>
            <p className="text-muted-foreground">Bottles Recycled</p>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-primary text-primary-foreground">
          <h2 className="mb-4">Ready to Start Your Innovation Journey?</h2>
          <p className="mb-6 opacity-90">
            Join thousands of students already using PolyPioneers to transform their ideas into reality.
          </p>
          <Button onClick={onGetStarted} variant="secondary" size="lg">
            Launch Platform
          </Button>
        </Card>
      </div>
    </div>
  );
}
