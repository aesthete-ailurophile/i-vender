import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Recycle, Leaf, Award, TrendingUp, Gift, DollarSign, CheckCircle } from "lucide-react";
import { sustainabilityAPI } from "../utils/api";

interface SustainabilityHubProps {
  accessToken: string;
  profile: any;
  onUpdate: () => void;
}

const rewards = [
  {
    id: "reward-1",
    title: "Campus Cafeteria Voucher",
    points: 200,
    value: "₹400",
  },
  {
    id: "reward-2",
    title: "Library Late Fee Waiver",
    points: 150,
    value: "₹800",
  },
  {
    id: "reward-3",
    title: "Free Printing Credits",
    points: 100,
    value: "50 pages",
  },
  {
    id: "reward-4",
    title: "Bookstore Discount",
    points: 500,
    value: "15% off",
  },
  {
    id: "reward-5",
    title: "Parking Pass (1 week)",
    points: 300,
    value: "₹1,500",
  },
  {
    id: "reward-6",
    title: "Cash Redemption",
    points: 1000,
    value: "₹2,000",
  }
];

export function SustainabilityHub({ accessToken, profile, onUpdate }: SustainabilityHubProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isRecycling, setIsRecycling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const response = await sustainabilityAPI.getLeaderboard();
      if (response.success) {
        setLeaderboard(response.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  async function handleRecycle() {
    setIsRecycling(true);
    setMessage("");

    try {
      const response = await sustainabilityAPI.recycle(
        { bottleCount: 1 },
        accessToken
      );

      if (response.success) {
        setMessage(`Success! Earned ${response.pointsEarned} points. Total: ${response.totalPoints} pts`);
        onUpdate(); // Refresh profile
        fetchLeaderboard(); // Refresh leaderboard
      }
    } catch (error: any) {
      console.error("Error recycling:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsRecycling(false);
    }
  }

  async function handleRedeem(reward: any) {
    if (!profile || profile.loyaltyPoints < reward.points) {
      setMessage("Insufficient points for this reward");
      return;
    }

    try {
      const response = await sustainabilityAPI.redeem(
        { rewardId: reward.id, pointsCost: reward.points },
        accessToken
      );

      if (response.success) {
        setMessage(`Success! Redeemed ${reward.title}. Remaining: ${response.remainingPoints} pts`);
        onUpdate(); // Refresh profile
      }
    } catch (error: any) {
      console.error("Error redeeming reward:", error);
      setMessage(`Error: ${error.message}`);
    }
  }

  const bottlesRecycled = profile?.bottlesRecycled || 0;
  const loyaltyPoints = profile?.loyaltyPoints || 0;
  const carbonSaved = (bottlesRecycled * 0.27).toFixed(1); // ~0.27kg CO2 per bottle
  
  // Calculate rank based on bottles
  let rank = "Beginner";
  let nextRank = "Eco Warrior";
  let progressToNextRank = (bottlesRecycled / 50) * 100;

  if (bottlesRecycled >= 100) {
    rank = "Green Champion";
    nextRank = "Eco Legend";
    progressToNextRank = ((bottlesRecycled - 100) / 150) * 100;
  } else if (bottlesRecycled >= 50) {
    rank = "Eco Warrior";
    nextRank = "Green Champion";
    progressToNextRank = ((bottlesRecycled - 50) / 50) * 100;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Sustainability Hub</h2>
          <p className="text-muted-foreground">
            Recycle, earn rewards, and make a positive environmental impact
          </p>
        </div>
      </div>

      {message && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {rank}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.min(progressToNextRank, 100).toFixed(0)}% to {nextRank}
            </p>
          </div>
          <div className="text-right">
            <div className="text-primary">{loyaltyPoints} pts</div>
            <p className="text-sm text-muted-foreground">Available Points</p>
          </div>
        </div>

        <Progress value={Math.min(progressToNextRank, 100)} className="mb-6 h-2" />

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-primary mb-1">{bottlesRecycled}</div>
            <p className="text-sm text-muted-foreground">Bottles Recycled</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-primary mb-1">{carbonSaved} kg</div>
            <p className="text-sm text-muted-foreground">CO₂ Saved</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-primary mb-1">
              {profile?.name && leaderboard.length > 0 
                ? (() => {
                    const rank = leaderboard.findIndex(u => u?.name === profile?.name);
                    return rank >= 0 ? rank + 1 : "-";
                  })()
                : "-"
              }
            </div>
            <p className="text-sm text-muted-foreground">Campus Rank</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Recycle Now</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Insert your plastic bottle into the vending machine drawer to earn points
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="gap-2" 
            size="lg" 
            onClick={handleRecycle}
            disabled={isRecycling}
          >
            <Recycle className="w-5 h-5" />
            {isRecycling ? "Processing..." : "Insert Bottle"}
          </Button>
          <Button variant="outline" className="gap-2" size="lg">
            <Gift className="w-5 h-5" />
            Find Vending Machine
          </Button>
        </div>
      </Card>

      {/* Rewards Store */}
      <div className="space-y-4">
        <h3>Redeem Rewards</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const canAfford = loyaltyPoints >= reward.points;
            return (
              <Card key={reward.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{reward.title}</h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Value: {reward.value}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{reward.points} pts</span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!canAfford}
                    variant={canAfford ? "default" : "outline"}
                    onClick={() => handleRedeem(reward)}
                  >
                    {canAfford ? "Redeem" : "Locked"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Card className="p-6">
        <h3 className="mb-4">Campus Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.length > 0 ? (
            leaderboard.filter(entry => entry && entry.name).map((entry) => {
              const isCurrentUser = entry.name === profile?.name;
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      entry.rank === 2 ? "bg-gray-100 text-gray-700" :
                      entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      #{entry.rank}
                    </div>
                    <div>
                      <p className={isCurrentUser ? "text-primary" : ""}>
                        {entry.name} {isCurrentUser && "(You)"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.bottles || 0} bottles recycled
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary">{entry.points || 0} pts</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Be the first to recycle and join the leaderboard!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
