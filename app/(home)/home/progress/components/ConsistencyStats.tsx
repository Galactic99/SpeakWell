"use client";

import { ProgressMetrics } from '@/lib/actions/progress.action';
import { Calendar, Clock, BarChart3, Trophy } from 'lucide-react';

interface ConsistencyStatsProps {
  metrics: ProgressMetrics;
  className?: string;
}

export default function ConsistencyStats({ metrics, className }: ConsistencyStatsProps) {
  // Get the consistency score color
  const getConsistencyColor = () => {
    const score = metrics.consistencyScore;
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  // Get a message based on consistency score
  const getConsistencyMessage = () => {
    const score = metrics.consistencyScore;
    if (score >= 80) return "Excellent consistency!";
    if (score >= 60) return "Good consistency";
    if (score >= 40) return "Average consistency";
    if (score >= 20) return "Needs improvement";
    return "Inconsistent practice";
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-indigo-800/40 p-6 ${className || ''}`}>
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 bg-indigo-900/40 rounded-full flex items-center justify-center mr-3">
          <Trophy className="h-5 w-5 text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Consistency Metrics</h3>
      </div>

      <div className="flex items-center justify-center my-4">
        <div className="relative h-32 w-32">
          {/* Circular progress indicator */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke="#1F2937" 
              strokeWidth="10"
              strokeDasharray="283"
              className="opacity-25" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke="url(#consistency-gradient)" 
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * metrics.consistencyScore / 100)} 
              strokeLinecap="round"
              className="transform -rotate-90 origin-center transition-all duration-1000 ease-in-out" 
            />
            <defs>
              <linearGradient id="consistency-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score text in the center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getConsistencyColor()}`}>{metrics.consistencyScore}</span>
            <span className="text-xs text-gray-400">out of 100</span>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-300 mb-6">{getConsistencyMessage()}</p>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black/30 rounded-lg p-3 border border-indigo-900/30">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
            <span className="text-xs text-gray-400">Weekly Sessions</span>
          </div>
          <p className="text-xl font-semibold">{metrics.studyHabits.averageSessionsPerWeek.toFixed(1)}</p>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3 border border-indigo-900/30">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-indigo-400 mr-2" />
            <span className="text-xs text-gray-400">Top Day</span>
          </div>
          <p className="text-xl font-semibold">{metrics.studyHabits.mostActiveDay || "N/A"}</p>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3 border border-indigo-900/30">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-4 w-4 text-indigo-400 mr-2" />
            <span className="text-xs text-gray-400">Sessions</span>
          </div>
          <p className="text-xl font-semibold">{metrics.totalSessions}</p>
        </div>
      </div>
      
      <div className="mt-5 text-sm text-gray-300 bg-black/20 rounded-lg p-3 border border-indigo-900/20">
        <strong className="text-indigo-400">Next Level: </strong>
        {metrics.predictedTimeToNextLevel || "Keep practicing to predict your progress timeline"}
      </div>
    </div>
  );
} 