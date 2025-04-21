import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/trpcClient";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading, isError } = useQuery(
    trpc.exampleTrpc.info.queryOptions({ title: "Backpine Labs" }),
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black -z-10"></div>
      <div className="absolute top-0 right-0 w-60 h-60 bg-purple-800 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-800 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="w-full max-w-6xl px-6 py-12">
        <section>
          <div className="container mx-auto">
            {isLoading && (
              <div className="text-center py-20">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute top-0 w-full h-full rounded-full border-4 border-gray-700 opacity-30"></div>
                  <div className="absolute top-0 w-full h-full rounded-full border-t-4 border-purple-500 animate-spin"></div>
                </div>
                <p className="mt-8 text-gray-400 font-medium tracking-wide">
                  Loading...
                </p>
              </div>
            )}

            {isError && (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-red-400 font-medium text-lg mb-2">
                  Error loading content
                </p>
                <p className="text-gray-400 max-w-md mx-auto">
                  We're having trouble loading the data. Please refresh or try
                  again later.
                </p>
              </div>
            )}

            {data && (
              <div className="text-center relative pt-20">
                {" "}
                {/* Added pt-20 for padding top */}
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
                      fill="#1E1E3F"
                      stroke="#8B5CF6"
                      strokeWidth="1"
                    />
                    <text
                      x="60"
                      y="20"
                      fontFamily="sans-serif"
                      fontSize="10"
                      fill="white"
                      textAnchor="middle"
                    >
                      This Hero section is
                    </text>
                    <text
                      x="60"
                      y="35"
                      fontFamily="sans-serif"
                      fontSize="10"
                      fill="white"
                      textAnchor="middle"
                    >
                      being provided by TRPC
                    </text>
                  </g>
                  {/* Arrow Path */}
                  <path
                    d="M400,55 L400,85"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                  {/* Arrow Head */}
                  <polygon points="400,85 395,75 405,75" fill="#8B5CF6" />
                </svg>
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight leading-none">
                  {data.title}
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4 tracking-wide font-light">
                  {data.description}
                </p>
                <div className="mt-12 max-w-3xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center ">
                      <img
                        src="/backpine.svg"
                        alt="Backpine"
                        className="h-14 mb-4 bg-white rounded p-2"
                      />
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">
                        Backpine System Design
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Modular services structured for fast iteration and scale
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <img
                        src="/tanstack.png"
                        alt="TanStack"
                        className="h-14 mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">
                        TanStack
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Best in class Routing and Data Queries
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <img
                        src="/cloudflare.svg"
                        alt="Cloudflare"
                        className="h-14 mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">
                        Cloudflare
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Ship your services to the edge for free
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
