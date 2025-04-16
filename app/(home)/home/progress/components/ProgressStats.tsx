"use client";

import { ProgressMetrics } from '@/lib/actions/progress.action';
import { BadgeCheck, TrendingUp, TrendingDown, Clock, Target, Award, Mic, Zap, BookOpen, Brain, BarChart2, LineChart, PieChart, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import SkillRadarChart from './SkillRadarChart';
import ProgressLineChart from './ProgressLineChart';
import SkillProgressCards from './SkillProgressCards';
import ConsistencyStats from './ConsistencyStats';

interface ProgressStatsProps {
  metrics: ProgressMetrics;
}

export default function ProgressStats({ metrics }: ProgressStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'charts'>('overview');
  
  const getTrendIcon = () => {
    switch (metrics.progressTrend) {
      case 'improving':
        return <TrendingUp className="h-6 w-6 text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-6 w-6 text-red-400" />;
      default:
        return <Clock className="h-6 w-6 text-blue-400" />;
    }
  };

  const getProgressColor = () => {
    if (metrics.progressPercentage > 0) return 'text-green-400';
    if (metrics.progressPercentage < 0) return 'text-red-400';
    return 'text-blue-400';
  };
  
  const getSkillIcon = (skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('pronunciation')) return <Mic className="h-4 w-4 mr-1 text-purple-400" />;
    if (lowerSkill.includes('fluency')) return <Zap className="h-4 w-4 mr-1 text-yellow-400" />;
    if (lowerSkill.includes('grammar')) return <BookOpen className="h-4 w-4 mr-1 text-blue-400" />;
    if (lowerSkill.includes('vocabulary')) return <Brain className="h-4 w-4 mr-1 text-green-400" />;
    return null;
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="flex mb-6 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-zinc-700/50'
          }`}
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'details'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-zinc-700/50'
          }`}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Skill Details
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'charts'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-zinc-700/50'
          }`}
        >
          <PieChart className="h-4 w-4 mr-2" />
          Charts
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Sessions Card */}
            <div className="bg-gradient-to-br from-purple-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-purple-800/40 p-6 transition-all hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-900/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">Sessions</h3>
                <div className="w-10 h-10 bg-purple-900/40 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-3">{metrics.totalSessions}</p>
              <p className="text-sm text-gray-400 mt-1">Total practice sessions</p>
            </div>

            {/* Progress Trend Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-blue-800/40 p-6 transition-all hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-900/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">Progress</h3>
                <div className="w-10 h-10 bg-blue-900/40 rounded-full flex items-center justify-center">
                  {getTrendIcon()}
                </div>
              </div>
              <p className={`text-3xl font-bold mt-3 ${getProgressColor()}`}>
                {metrics.progressPercentage > 0 ? '+' : ''}
                {metrics.progressPercentage}%
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {metrics.progressTrend === 'improving'
                  ? 'Improving steadily'
                  : metrics.progressTrend === 'declining'
                  ? 'Needs attention'
                  : metrics.progressTrend === 'steady'
                  ? 'Maintaining level'
                  : 'Not enough data yet'}
              </p>
            </div>

            {/* Proficiency Level Card */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-indigo-800/40 p-6 transition-all hover:border-indigo-600/50 hover:shadow-lg hover:shadow-indigo-900/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">Proficiency</h3>
                <div className="w-10 h-10 bg-indigo-900/40 rounded-full flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-3">{metrics.proficiencyLevel}</p>
              <p className="text-sm text-gray-400 mt-1">Current level</p>
            </div>

            {/* Average Score Card */}
            <div className="bg-gradient-to-br from-amber-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-amber-800/40 p-6 transition-all hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-900/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">Average Score</h3>
                <div className="w-10 h-10 bg-amber-900/40 rounded-full flex items-center justify-center">
                  <span className="text-amber-400 text-xl font-bold">★</span>
                </div>
              </div>
              <p className="text-3xl font-bold mt-3">{metrics.averageScore}<span className="text-gray-400 text-xl">/100</span></p>
              <p className="text-sm text-gray-400 mt-1">Across all sessions</p>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-blue-400" />
              Score Progress Over Time
            </h3>
            <ProgressLineChart activities={metrics.activityByDay} />
          </div>

          {/* Strengths & Weaknesses */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6 md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-200">Strengths</h3>
                  <div className="ml-auto flex items-center bg-green-900/30 text-green-400 text-xs px-3 py-1 rounded-full">
                    {getSkillIcon(metrics.mostImprovedArea)}
                    Most improved: {metrics.mostImprovedArea}
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {metrics.recentStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start bg-zinc-800/60 rounded-lg p-2">
                      <span className="mr-2 text-green-400 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                  {metrics.recentStrengths.length === 0 && (
                    <li className="text-gray-400 italic bg-zinc-800/60 rounded-lg p-2">No data available yet</li>
                  )}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-200">Areas to Focus</h3>
                  <div className="ml-auto flex items-center bg-red-900/30 text-red-400 text-xs px-3 py-1 rounded-full">
                    {getSkillIcon(metrics.areaNeededFocus)}
                    Focus on: {metrics.areaNeededFocus}
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {metrics.recentWeaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start bg-zinc-800/60 rounded-lg p-2">
                      <span className="mr-2 text-red-400 mt-0.5">•</span>
                      {weakness}
                    </li>
                  ))}
                  {metrics.recentWeaknesses.length === 0 && (
                    <li className="text-gray-400 italic bg-zinc-800/60 rounded-lg p-2">No data available yet</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-violet-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-violet-800/40 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-violet-900/40 rounded-full flex items-center justify-center mr-3">
                <Target className="h-4 w-4 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Progress Insights</h3>
            </div>
            <p className="text-gray-300 bg-black/20 rounded-lg p-4 border border-violet-900/20">{metrics.insightSummary}</p>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <SkillProgressCards metrics={metrics} />
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Skills Comparison</h3>
              <SkillRadarChart metrics={metrics} />
            </div>
            
            {/* Consistency Stats */}
            <ConsistencyStats metrics={metrics} />
          </div>
          
          {/* Learning Insights */}
          {metrics.learningInsights.length > 0 && (
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Learning Insights</h3>
              <div className="space-y-4">
                {metrics.learningInsights.map((insight, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{insight.title}</h4>
                      <span className={`
                        text-xs px-3 py-1 rounded-full 
                        ${insight.impact === 'high' ? 'bg-red-900/30 text-red-400' : 
                          insight.impact === 'medium' ? 'bg-yellow-900/30 text-yellow-400' : 
                          'bg-blue-900/30 text-blue-400'}
                      `}>
                        {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommendations */}
          <div className="bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm rounded-xl border border-green-800/40 p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Recommended Focus Areas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-2">Short-term Focus</h4>
                <ul className="space-y-2">
                  {metrics.recommendedFocus.shortTerm.map((item, index) => (
                    <li key={index} className="text-sm text-gray-300 bg-black/30 rounded-lg p-3 border border-green-900/20">
                      {item}
                    </li>
                  ))}
                  {metrics.recommendedFocus.shortTerm.length === 0 && (
                    <li className="text-gray-400 italic bg-black/30 rounded-lg p-3">Complete more sessions for personalized recommendations</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-2">Long-term Focus</h4>
                <ul className="space-y-2">
                  {metrics.recommendedFocus.longTerm.map((item, index) => (
                    <li key={index} className="text-sm text-gray-300 bg-black/30 rounded-lg p-3 border border-green-900/20">
                      {item}
                    </li>
                  ))}
                  {metrics.recommendedFocus.longTerm.length === 0 && (
                    <li className="text-gray-400 italic bg-black/30 rounded-lg p-3">Complete more sessions for personalized recommendations</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 