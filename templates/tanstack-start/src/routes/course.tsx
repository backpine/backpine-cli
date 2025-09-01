import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/course")({
  component: RouteComponent,
});

function RouteComponent() {
  const courseSections = [
    {
      id: 1,
      title: "Introduction to React",
      duration: "12:34",
      completed: true,
    },
    {
      id: 2,
      title: "Setting up your environment",
      duration: "8:22",
      completed: true,
    },
    {
      id: 3,
      title: "Your first component",
      duration: "15:45",
      completed: false,
    },
    {
      id: 4,
      title: "Props and State",
      duration: "22:18",
      completed: false,
    },
    {
      id: 5,
      title: "Event Handling",
      duration: "18:07",
      completed: false,
    },
    {
      id: 6,
      title: "Conditional Rendering",
      duration: "14:33",
      completed: false,
    },
  ];

  const resources = [
    "React Official Documentation",
    "MDN Web Docs - JavaScript",
    "Course Exercise Files",
    "Community Discord Server",
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Course Sections */}
      <div className="w-80 border-r bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-3">
              {courseSections.map((section) => (
                <Card
                  key={section.id}
                  className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox checked={section.completed} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {section.title}
                        </h4>
                        <PlayCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {section.duration}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Video Info Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your first component</CardTitle>
                  <CardDescription>
                    Learn how to create and structure your first React component
                  </CardDescription>
                </div>
                <Badge variant="secondary">3 of 6</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Video Player Placeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context and Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Lesson Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In this lesson, you'll learn the fundamentals of creating
                  React components. We'll cover the basic syntax, how to
                  structure your component files, and best practices for
                  component naming and organization.
                </p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium">What you'll learn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• JSX syntax basics</li>
                    <li>• Component file structure</li>
                    <li>• Naming conventions</li>
                    <li>• Export/import patterns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
