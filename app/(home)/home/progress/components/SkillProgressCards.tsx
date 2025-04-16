"use client";

import { ProgressMetrics, SkillProgressData } from '@/lib/actions/progress.action';
import { Mic, Zap, BookOpen, Brain, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SkillProgressCardsProps {
  metrics: ProgressMetrics;
  className?: string;
}

export default function SkillProgressCards({ metrics, className }: SkillProgressCardsProps) {
  const skills = [
    {
      name: 'Pronunciation',
      key: 'pronunciation',
      icon: <Mic className="h-5 w-5 text-purple-400" />,
      color: 'from-purple-900/30 to-purple-800/20',
      borderColor: 'border-purple-800/40',
      hoverBorder: 'hover:border-purple-700/60',
      shadow: 'hover:shadow-purple-900/10',
      textColor: 'text-purple-400',
      data: metrics.skillProgress.pronunciation
    },
    {
      name: 'Fluency',
      key: 'fluency',
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      color: 'from-amber-900/30 to-amber-800/20',
      borderColor: 'border-amber-800/40',
      hoverBorder: 'hover:border-amber-700/60',
      shadow: 'hover:shadow-amber-900/10',
      textColor: 'text-yellow-400',
      data: metrics.skillProgress.fluency
    },
    {
      name: 'Grammar',
      key: 'grammar',
      icon: <BookOpen className="h-5 w-5 text-blue-400" />,
      color: 'from-blue-900/30 to-blue-800/20',
      borderColor: 'border-blue-800/40',
      hoverBorder: 'hover:border-blue-700/60',
      shadow: 'hover:shadow-blue-900/10',
      textColor: 'text-blue-400',
      data: metrics.skillProgress.grammar
    },
    {
      name: 'Vocabulary',
      key: 'vocabulary',
      icon: <Brain className="h-5 w-5 text-green-400" />,
      color: 'from-green-900/30 to-green-800/20',
      borderColor: 'border-green-800/40',
      hoverBorder: 'hover:border-green-700/60',
      shadow: 'hover:shadow-green-900/10',
      textColor: 'text-green-400',
      data: metrics.skillProgress.vocabulary
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const ProgressBar = ({ value }: { value: number }) => {
    return (
      <div className="w-full bg-zinc-800 h-2 rounded-full my-2">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${Math.min(100, value)}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className || ''}`}>
      {skills.map((skill) => (
        <div 
          key={skill.key}
          className={`bg-gradient-to-br ${skill.color} backdrop-blur-sm rounded-xl ${skill.borderColor} border p-5 transition-all ${skill.hoverBorder} hover:shadow-lg ${skill.shadow}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-black/30 rounded-lg">{skill.icon}</div>
              <div>
                <h3 className="text-lg font-medium text-white">{skill.name}</h3>
                <div className="flex items-center mt-1">
                  <div className={`flex items-center text-xs ${getTrendColor(skill.data.trend)}`}>
                    {getTrendIcon(skill.data.trend)}
                    <span className="ml-1">
                      {skill.data.improvementPercentage > 0 ? '+' : ''}
                      {skill.data.improvementPercentage}%
                    </span>
                  </div>
                  <span className="mx-2 text-zinc-600">|</span>
                  <span className="text-xs text-gray-400">Current: {skill.data.currentScore}/100</span>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {skill.data.currentScore}
              <span className="text-sm font-normal text-gray-500">/100</span>
            </div>
          </div>
          
          <ProgressBar value={skill.data.currentScore} />
          
          {skill.data.commonErrors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Common Issues:</h4>
              <ul className="space-y-1">
                {skill.data.commonErrors.slice(0, 2).map((error, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-start">
                    <span className="mr-2 text-red-400 mt-0.5">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {skill.data.recommendedExercises.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {skill.data.recommendedExercises.slice(0, 2).map((exercise, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-center">
                    <span className="mr-2 text-green-400">•</span>
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button className={`mt-4 flex items-center text-xs ${skill.textColor} hover:underline`}>
            Detailed analysis
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
} 