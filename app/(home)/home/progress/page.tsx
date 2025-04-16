import { Suspense } from 'react';
import ActivityCalendar from './components/ActivityCalendar';
import ProgressStats from './components/ProgressStats';
import { getActivityCalendar, analyzeProgress, getMinSessionsForAnalytics } from '@/lib/actions/progress.action';
import { ChevronRight, FileText, BarChart, Calendar, ArrowUpRight, Info, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ProgressPage() {
  // Get the activity data for the calendar
  const { success: activitySuccess, data: activities } = await getActivityCalendar();
  
  // Get the progress analysis
  const { success: analysisSuccess, data: metrics } = await analyzeProgress();
  
  // Get minimum sessions required for analytics
  const MIN_SESSIONS_FOR_ANALYTICS = await getMinSessionsForAnalytics();
  
  // Check if user has completed enough sessions
  const hasEnoughSessions = metrics && metrics.totalSessions >= MIN_SESSIONS_FOR_ANALYTICS;
  const sessionCount = metrics?.totalSessions || 0;
  const sessionsNeeded = MIN_SESSIONS_FOR_ANALYTICS - sessionCount;
  
  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
            Progress Tracking
          </h1>
          <p className="text-xl text-gray-300">
            Track your English language journey over time
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Progress Stats Section */}
          <section className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center text-gray-100">
                <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                Performance Analytics
              </h2>
              <Link 
                href="/home/feedbacks" 
                className="flex items-center text-sm text-blue-400 hover:text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                All Sessions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <Suspense fallback={<div className="text-gray-400 py-4">Loading your performance data...</div>}>
              {analysisSuccess && metrics ? (
                <>
                  {hasEnoughSessions ? (
                    <ProgressStats metrics={metrics} />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl border border-blue-800/40 p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 p-2 bg-blue-900/30 rounded-full">
                          <Lock className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2 text-white">Complete more sessions to unlock full analytics</h3>
                          <p className="text-gray-300 mb-4">
                            You've completed <span className="text-blue-400 font-medium">{sessionCount}</span> of <span className="text-blue-400 font-medium">{MIN_SESSIONS_FOR_ANALYTICS}</span> sessions needed for advanced progress analytics. 
                            Complete <span className="text-blue-400 font-medium">{sessionsNeeded}</span> more {sessionsNeeded === 1 ? 'session' : 'sessions'} to unlock detailed progress tracking.
                          </p>
                          <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden mb-6">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${Math.min(100, (sessionCount / MIN_SESSIONS_FOR_ANALYTICS) * 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[150px] bg-zinc-800/70 rounded-lg p-4 border border-zinc-700">
                              <div className="text-gray-400 text-sm mb-1">Sessions Completed</div>
                              <div className="text-2xl font-bold">{sessionCount}</div>
                            </div>
                            <div className="flex-1 min-w-[150px] bg-zinc-800/70 rounded-lg p-4 border border-zinc-700">
                              <div className="text-gray-400 text-sm mb-1">Current Level</div>
                              <div className="text-2xl font-bold">{metrics.proficiencyLevel || "Not determined"}</div>
                            </div>
                            <div className="flex-1 min-w-[150px] bg-zinc-800/70 rounded-lg p-4 border border-zinc-700">
                              <div className="text-gray-400 text-sm mb-1">Latest Score</div>
                              <div className="text-2xl font-bold">{metrics.averageScore}<span className="text-gray-400 text-lg">/100</span></div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <Link
                              href="/home"
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                            >
                              Start a new session
                              <ArrowUpRight className="h-4 w-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-zinc-800/60 rounded-xl p-6 backdrop-blur-sm border border-zinc-700">
                  <p className="text-gray-400">
                    No metrics available yet. Complete some practice sessions to see your progress!
                  </p>
                </div>
              )}
            </Suspense>
          </section>
          
          {/* Activity Calendar Section */}
          <section className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-100">
              <Calendar className="h-5 w-5 mr-2 text-green-400" />
              Activity Calendar
            </h2>
            
            <div className="bg-zinc-800/60 rounded-xl p-6 backdrop-blur-sm border border-zinc-700">
              <Suspense fallback={<div className="text-gray-400 h-64 flex items-center justify-center">Loading your activity data...</div>}>
                {activitySuccess && activities && activities.length > 0 ? (
                  <ActivityCalendar activities={activities} />
                ) : (
                  <div className="text-gray-400 h-44 flex flex-col items-center justify-center">
                    <p className="mb-3">No activity data available yet. Start practicing to see your calendar fill up!</p>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-900 to-purple-900 rounded-full"></div>
                  </div>
                )}
              </Suspense>
            </div>
            
            {/* Info notice if calendar is shown but analytics are locked */}
            {activitySuccess && activities && activities.length > 0 && !hasEnoughSessions && (
              <div className="mt-4 flex items-start text-sm bg-zinc-800/60 rounded-lg p-4 border border-zinc-700">
                <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  Your activity calendar shows your practice sessions. Complete {sessionsNeeded} more {sessionsNeeded === 1 ? 'session' : 'sessions'} to unlock detailed analytics with personalized insights and progress trends.
                </div>
              </div>
            )}
          </section>
          
          {/* Recommendation Section */}
          <section className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-purple-800/40 p-8 shadow-lg shadow-purple-900/10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-3 text-white">Ready to improve your English?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl">
                  {hasEnoughSessions 
                    ? "Regular practice is the key to mastering English. Consistency creates improvement that builds over time, reflected in your progress metrics and activity calendar."
                    : `Complete ${sessionsNeeded} more ${sessionsNeeded === 1 ? 'session' : 'sessions'} to unlock detailed progress analytics. Consistent practice helps you improve faster and track your language learning journey.`
                  }
                </p>
                <Link
                  href="/home"
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:shadow-purple-900/20"
                >
                  Start New Session
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
              
              <div className="hidden lg:block w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-700/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 