import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/trpcClient";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading, isError } = useQuery(
    trpc.exampleTrpc.info.queryOptions({ title: "Backpine Labs" }),
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/40 via-background to-background -z-10"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>

        <div className="w-full max-w-6xl px-6 py-12">
          <section>
            <div className="container mx-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Loading...
                  </p>
                </div>
              )}

              {isError && (
                <div className="flex flex-col items-center justify-center py-16 px-6 space-y-4">
                  <Alert
                    variant="destructive"
                    className="max-w-md mx-auto bg-destructive/10 border-destructive/30"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="ml-2">
                      Error loading content
                    </AlertTitle>
                    <AlertDescription>
                      We're having trouble loading the data. Please refresh or
                      try again later.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {data && (
                <div className="text-center relative pt-20 space-y-8">
                  {/* Custom SVG Arrow with TRPC Card Annotation */}
                  <svg
                    className="absolute w-full h-40 top-0 left-0 pointer-events-none"
                    viewBox="0 0 800 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* TRPC Info Card */}
                    <g transform="translate(340, 5)">
                      <rect
                        x="0"
                        y="0"
                        width="120"
                        height="50"
                        rx="8"
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                      />
                      <text
                        x="60"
                        y="20"
                        fontFamily="sans-serif"
                        fontSize="10"
                        fill="hsl(var(--card-foreground))"
                        textAnchor="middle"
                      >
                        This Hero section is
                      </text>
                      <text
                        x="60"
                        y="35"
                        fontFamily="sans-serif"
                        fontSize="10"
                        fill="hsl(var(--card-foreground))"
                        textAnchor="middle"
                      >
                        being provided by TRPC
                      </text>
                    </g>
                    {/* Arrow Path */}
                    <path
                      d="M400,55 L400,85"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      fill="none"
                    />
                    {/* Arrow Head */}
                    <polygon
                      points="400,85 395,75 405,75"
                      fill="hsl(var(--primary))"
                    />
                  </svg>

                  {/* Hero Title */}
                  <div className="space-y-6">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-primary to-pink-500 tracking-tight leading-none">
                      {data.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed tracking-wide">
                      {data.description}
                    </p>
                    <Badge variant="default" className="">
                      Built with shadcn/ui
                    </Badge>
                  </div>

                  {/* Cards Section */}
                  <div className="mt-16 max-w-3xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="rounded-full bg-white/95 p-2 w-16 h-16 flex items-center justify-center">
                            <img
                              src="/backpine.svg"
                              alt="Backpine"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                              Backpine System Design
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Modular services structured for fast iteration and
                              scale
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="rounded-full bg-background p-2 w-16 h-16 flex items-center justify-center">
                            <img
                              src="/tanstack.png"
                              alt="TanStack"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">TanStack</h3>
                            <p className="text-muted-foreground text-sm">
                              Best in class Routing and Data Queries
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="rounded-full bg-background p-2 w-16 h-16 flex items-center justify-center">
                            <img
                              src="/cloudflare.svg"
                              alt="Cloudflare"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                              Cloudflare
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Ship your services to the edge for free
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
