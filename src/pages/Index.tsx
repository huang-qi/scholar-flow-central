
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-3xl shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">Scholar Flow Central</CardTitle>
          <CardDescription className="text-xl mt-2">
            Your comprehensive research management platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard 
              title="Manage Research"
              description="Organize publications, datasets, and research outputs in one place"
              icon="📚"
            />
            <FeatureCard 
              title="Track Progress"
              description="Monitor research milestones and publication status"
              icon="📈"
            />
            <FeatureCard 
              title="Collaborate"
              description="Share insights and work together with your team"
              icon="👥"
            />
            <FeatureCard 
              title="Stay Informed"
              description="Get updates on relevant literature and publications"
              icon="🔔"
            />
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-muted-foreground text-sm">
              Get started by navigating to the dashboard or exploring research outputs.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/research')}
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => {
  return (
    <div className="bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
