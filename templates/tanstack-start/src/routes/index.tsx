// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold">
              TS
            </AvatarFallback>
          </Avatar>
          <Badge variant="secondary" className="px-3 py-1">
            v1.0
          </Badge>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
          <span className="">TanStack Start</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Modern full-stack React framework. Fast, type-safe, beautiful.
        </p>

        <Separator className="my-8 max-w-xs mx-auto" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="px-8 h-12">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="px-8 h-12">
            Documentation
          </Button>
        </div>

        <Card className="max-w-md mx-auto bg-gradient-to-r from-muted to-muted/50 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ready to ship?</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Production-ready in minutes
            </CardDescription>
            <Button className="w-full">Deploy Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
