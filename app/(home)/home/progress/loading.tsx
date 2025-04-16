export default function ProgressLoading() {
  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-10">
          <div className="h-12 w-72 bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-lg animate-pulse mb-3"></div>
          <div className="h-6 w-64 bg-zinc-800/60 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="space-y-8">
          {/* Performance Metrics Section Skeleton */}
          <section className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="h-7 w-48 bg-zinc-800/80 rounded-lg animate-pulse"></div>
              <div className="h-8 w-32 bg-blue-900/40 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card Skeletons */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-zinc-800/40 to-black/80 backdrop-blur-sm rounded-xl border border-zinc-700/40 p-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-28 bg-zinc-700/60 rounded-lg animate-pulse"></div>
                    <div className="w-10 h-10 bg-zinc-700/40 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-9 w-24 bg-zinc-700/60 rounded-lg animate-pulse mt-3"></div>
                  <div className="h-4 w-36 bg-zinc-700/40 rounded-lg animate-pulse mt-2"></div>
                </div>
              ))}
              
              {/* Strengths & Weaknesses Skeleton */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6 md:col-span-2 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="h-6 w-28 bg-zinc-700/60 rounded-lg animate-pulse"></div>
                      <div className="ml-auto h-6 w-36 bg-green-900/30 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-zinc-700/40 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="h-6 w-28 bg-zinc-700/60 rounded-lg animate-pulse"></div>
                      <div className="ml-auto h-6 w-36 bg-red-900/30 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-zinc-700/40 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Insights Skeleton */}
              <div className="bg-gradient-to-br from-violet-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-violet-800/40 p-6 md:col-span-2 lg:col-span-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-violet-900/40 rounded-full animate-pulse mr-3"></div>
                  <div className="h-6 w-40 bg-zinc-700/60 rounded-lg animate-pulse"></div>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-violet-900/20 space-y-2">
                  <div className="h-4 w-full bg-zinc-700/40 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-full bg-zinc-700/40 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-zinc-700/40 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Activity Calendar Skeleton */}
          <section className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="h-7 w-44 bg-zinc-800/80 rounded-lg animate-pulse"></div>
            </div>
            
            <div className="bg-zinc-800/60 rounded-xl p-6 backdrop-blur-sm border border-zinc-700">
              <div className="min-h-[260px] relative">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-4 bg-zinc-700/60 rounded animate-pulse mr-4"></div>
                    <div className="grid grid-cols-12 gap-1 w-full">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-4 bg-zinc-700/40 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-12 h-4 bg-zinc-700/60 rounded animate-pulse mr-4"></div>
                      <div className="grid grid-cols-53 gap-1 w-full">
                        {[...Array(53)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-zinc-700/40 rounded-sm animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Recommendation Section Skeleton */}
          <section className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-purple-800/40 p-8">
            <div className="flex justify-between items-start">
              <div className="max-w-2xl">
                <div className="h-8 w-64 bg-zinc-700/40 rounded-lg animate-pulse mb-3"></div>
                <div className="h-4 w-full bg-zinc-700/30 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-5/6 bg-zinc-700/30 rounded-lg animate-pulse mb-6"></div>
                <div className="h-12 w-40 bg-gradient-to-r from-blue-600/60 to-purple-600/60 rounded-xl animate-pulse"></div>
              </div>
              
              <div className="hidden lg:block w-24 h-24 bg-purple-900/30 rounded-full animate-pulse"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 