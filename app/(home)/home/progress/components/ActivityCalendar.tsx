"use client";

import { useEffect, useState, useMemo } from 'react';
import { DailyActivity } from '@/lib/actions/progress.action';

// Generate months for the header row (Jan-Dec)
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Days of week to display (Mon, Wed, Fri)
const DAYS = ["Mon", "Wed", "Fri"];

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

interface ActivityCalendarProps {
  activities: DailyActivity[];
}

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentYear] = useState(new Date().getFullYear());
  
  // Generate the activity level based on score and count
  const getActivityLevel = (score: number, count: number): ActivityLevel => {
    if (count === 0) return 0; // No activity
    
    // Based on both frequency and score
    if (count >= 3) return 4; // Very active
    if (count === 2) return score >= 85 ? 3 : 2; // Active with good or moderate score
    
    // For single sessions, base it on score
    if (score >= 85) return 3; // Good score
    if (score >= 70) return 2; // Moderate score
    return 1; // Low score
  };
  
  // Map of dates to activity level
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityLevel>();
    
    activities.forEach(activity => {
      const { date, count, averageScore } = activity;
      map.set(date, getActivityLevel(averageScore, count));
    });
    
    return map;
  }, [activities]);
  
  // Generate calendar data structure for the entire year
  const calendarData = useMemo(() => {
    const data: { date: string; level: ActivityLevel }[][] = [];
    
    // Generate all dates for the year
    const startDate = new Date(currentYear, 0, 1); // Jan 1
    const endDate = new Date(currentYear, 11, 31); // Dec 31
    
    // Create array of 7 days per week
    for (let dow = 0; dow < 7; dow++) {
      const dayRow: { date: string; level: ActivityLevel }[] = [];
      
      // Start with the first day of the week in January
      const firstDay = new Date(currentYear, 0, 1 + ((dow - new Date(currentYear, 0, 1).getDay() + 7) % 7));
      
      // Add a day for each week of the year
      for (let week = 0; week < 53; week++) {
        const currentDate = new Date(firstDay);
        currentDate.setDate(firstDay.getDate() + (week * 7));
        
        // Skip if outside the year
        if (currentDate > endDate || currentDate < startDate) {
          dayRow.push({ date: "", level: 0 });
          continue;
        }
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const level = activityMap.get(dateStr) || 0;
        
        dayRow.push({ date: dateStr, level });
      }
      
      // Only add days for Mon, Wed, Fri (indices 1, 3, 5 in week)
      if ([1, 3, 5].includes(dow)) {
        data.push(dayRow);
      }
    }
    
    return data;
  }, [currentYear, activityMap]);
  
  // Color scale for activity levels
  const getColorClass = (level: ActivityLevel): string => {
    switch (level) {
      case 0: return "bg-zinc-800/60 border-zinc-700/50";
      case 1: return "bg-green-900/70 border-green-800/50";
      case 2: return "bg-green-700/70 border-green-600/50";
      case 3: return "bg-green-500/70 border-green-400/50";
      case 4: return "bg-green-400/80 border-green-300/60";
    }
  };
  
  const getTooltipText = (date: string, count: number) => {
    if (!date) return "";
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const sessionText = count === 1 ? "session" : "sessions";
    
    // If we have activity data for this date, show details
    const activity = activities.find(a => a.date === date);
    if (activity) {
      return `${formattedDate}: ${activity.count} ${sessionText} (avg. score: ${activity.averageScore})`;
    }
    
    return `${formattedDate}: No activity`;
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max px-2">
        <div className="flex text-xs text-gray-400">
          <div className="w-12 pr-3"></div>
          <div className="flex-1 grid grid-cols-12 gap-1">
            {MONTHS.map((month, i) => (
              <div key={month} className="text-center font-medium">
                {month}
              </div>
            ))}
          </div>
        </div>
        
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="flex text-xs text-gray-400 my-1">
            <div className="w-12 pr-3 pt-1 font-medium">{day}</div>
            <div className="flex-1 grid grid-cols-53 gap-1">
              {calendarData[dayIndex]?.map((cell, i) => (
                <div
                  key={`${day}-${i}`}
                  className={`w-4 h-4 rounded-sm border ${getColorClass(cell.level)} hover:ring-1 hover:ring-blue-500 transition-all`}
                  title={getTooltipText(cell.date, activities.find(a => a.date === cell.date)?.count || 0)}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end items-center mt-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1 mx-2">
            <div className={`w-4 h-4 rounded-sm border ${getColorClass(0)}`}></div>
            <div className={`w-4 h-4 rounded-sm border ${getColorClass(1)}`}></div>
            <div className={`w-4 h-4 rounded-sm border ${getColorClass(2)}`}></div>
            <div className={`w-4 h-4 rounded-sm border ${getColorClass(3)}`}></div>
            <div className={`w-4 h-4 rounded-sm border ${getColorClass(4)}`}></div>
          </div>
          <span>More</span>
        </div>
        
        <div className="flex justify-between items-center mt-5 px-1">
          <div className="text-xs text-gray-500">
            Year: {currentYear}
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            <span className="w-3 h-3 bg-green-500/70 inline-block rounded-sm mr-1.5"></span>
            <span>Activity level based on practice frequency and scores</span>
          </div>
        </div>
      </div>
    </div>
  );
} 