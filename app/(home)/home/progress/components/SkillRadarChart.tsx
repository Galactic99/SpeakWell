"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { ProgressMetrics } from '@/lib/actions/progress.action';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  metrics: ProgressMetrics;
  className?: string;
}

export default function SkillRadarChart({ metrics, className }: SkillRadarChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get the current and initial scores for each skill
    const currentData = [
      metrics.skillProgress.pronunciation.currentScore,
      metrics.skillProgress.fluency.currentScore,
      metrics.skillProgress.grammar.currentScore,
      metrics.skillProgress.vocabulary.currentScore,
    ];
    
    const initialData = [
      metrics.skillProgress.pronunciation.initialScore,
      metrics.skillProgress.fluency.initialScore,
      metrics.skillProgress.grammar.initialScore,
      metrics.skillProgress.vocabulary.initialScore,
    ];
    
    setChartData({
      labels: ['Pronunciation', 'Fluency', 'Grammar', 'Vocabulary'],
      datasets: [
        {
          label: 'Current',
          data: currentData,
          backgroundColor: 'rgba(138, 43, 226, 0.2)',
          borderColor: 'rgba(138, 43, 226, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(138, 43, 226, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(138, 43, 226, 1)',
          pointRadius: 4,
        },
        {
          label: 'Initial',
          data: initialData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1.5,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 3,
        },
      ],
    });
  }, [metrics]);

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          backdropColor: 'transparent',
          stepSize: 20,
          max: 100,
          min: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          boxWidth: 15,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.r}/100`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={`w-full h-[300px] relative ${className || ''}`}>
      {isClient && chartData ? (
        <Radar data={chartData} options={chartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading chart...</p>
        </div>
      )}
    </div>
  );
} 