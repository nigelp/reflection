import React from 'react';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { MeditationSession } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  sessions: MeditationSession[];
};

export default function MoodTrends({ sessions }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get sessions from last 14 days
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const recentSessions = sessions
    .filter(session => new Date(session.created_at) >= twoWeeksAgo)
    .slice(-(isMobile ? 7 : 14));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const data = {
    datasets: [
      {
        label: 'Pre-Meditation Mood',
        data: recentSessions.map((session, index) => ({
          x: index,
          y: session.pre_mood_score
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Post-Meditation Mood',
        data: recentSessions.map((session, index) => ({
          x: index,
          y: session.post_mood_score
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: -8,
        right: -8,
        top: 8,
        bottom: -8
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: isMobile ? 'Last 7 Days' : 'Last 14 Days',
          font: {
            size: isMobile ? 10 : 12
          }
        },
        min: 0,
        max: isMobile ? 5 : 12,
        offset: true,
        ticks: {
          stepSize: 1,
          callback: function(value: number) {
            const session = recentSessions[value];
            if (!session) return '';
            const date = new Date(session.created_at);
            return isMobile ? date.getDate() : formatDate(date);
          },
          font: {
            size: isMobile ? 8 : 10
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Mood Level',
          font: {
            size: isMobile ? 10 : 12
          }
        },
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value.toFixed(0);
          },
          font: {
            size: isMobile ? 8 : 10
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: isMobile ? 4 : 6,
          padding: isMobile ? 2 : 4,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: 'Mood Level Trends (1-5)',
        font: {
          size: isMobile ? 14 : 16
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
      <div className="h-[180px] sm:h-[220px]">
        <Scatter options={options} data={data} />
      </div>
    </div>
  );
}