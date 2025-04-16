"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyActivity } from '@/lib/actions/progress.action';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressLineChartProps {
  activities: DailyActivity[];
  className?: string;
}

export default function ProgressLineChart({ activities, className }: ProgressLineChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Process activity data to format it for the chart
    if (activities && activities.length > 0) {
      // Sort activities by date
      const sortedActivities = [...activities].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Format dates for better display
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      
      // Extract labels (dates) and data (scores)
      const labels = sortedActivities.map(activity => formatDate(activity.date));
      const scores = sortedActivities.map(activity => activity.averageScore);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Average Score',
            data: scores,
            borderColor: 'rgba(138, 43, 226, 1)',
            backgroundColor: 'rgba(138, 43, 226, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(138, 43, 226, 1)',
            pointBorderColor: '#fff',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(138, 43, 226, 1)',
            pointHoverBorderWidth: 2,
          },
        ],
      });
    }
  }, [activities]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          padding: 10,
          stepSize: 20,
          callback: (value: number) => `${value}`,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.parsed.y}/100`;
          },
        },
      },
    },
  };

  return (
    <div className={`w-full h-[250px] relative ${className || ''}`}>
      {isClient && chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading chart...</p>
        </div>
      )}
      
      {isClient && (!activities || activities.length < 2) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
          <p className="text-gray-400 text-center">
            {activities?.length === 1 
              ? "Complete more sessions to see your progress chart" 
              : "No sessions data available yet"}
          </p>
        </div>
      )}
    </div>
  );
} 