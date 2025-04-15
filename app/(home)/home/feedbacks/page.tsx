"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaChevronLeft, 
  FaChartLine, 
  FaClock, 
  FaStar, 
  FaMicrophone, 
  FaBook, 
  FaPen, 
  FaLanguage,
  FaSearch,
  FaCalendarAlt,
  FaExclamationCircle,
  FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackData, getUserFeedbacks } from '@/lib/actions/feedback.action';
import { format } from 'date-fns';

const FeedbacksPage = () => {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<string>('all');

  // Fetch feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const result = await getUserFeedbacks();
        
        if (result.success && result.data) {
          setFeedbacks(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError('Failed to load feedbacks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on search and filter criteria
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filter by search term
    const searchMatch = searchTerm === '' || 
      feedback.sessionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by score
    let scoreMatch = true;
    if (filterScore !== 'all') {
      const score = feedback.assessment.score;
      switch (filterScore) {
        case 'high':
          scoreMatch = score >= 80;
          break;
        case 'medium':
          scoreMatch = score >= 60 && score < 80;
          break;
        case 'low':
          scoreMatch = score < 60;
          break;
      }
    }
    
    return searchMatch && scoreMatch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div 
          key={item} 
          className="bg-zinc-800/60 rounded-xl p-4 animate-pulse"
        >
          <div className="h-6 bg-zinc-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <header className="flex items-center mb-8">
          <motion.button
            onClick={() => router.push('/home')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChevronLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </motion.button>
        </header>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
            Your Feedback History
          </h1>
          <p className="text-lg text-gray-300">
            Review and track your progress over time
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-5">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800/60 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search by session name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                className="block w-full px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800/60 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (Below 60)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FaChartLine className="mr-2 text-purple-400" />
            <span>Session History</span>
          </h2>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FaExclamationCircle className="text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FaSearch className="text-4xl text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {searchTerm || filterScore !== 'all' 
                  ? 'No matching feedbacks found' 
                  : 'No feedback sessions yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterScore !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Complete a practice session to get feedback'}
              </p>
              {searchTerm || filterScore !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterScore('all');
                  }}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/session/${crypto.randomUUID()}`)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Start a Session
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-5">
                {filteredFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 rounded-xl p-5 hover:border-purple-500/30 transition-colors group"
                  >
                    <Link href={`/home/feedbacks/${feedback.id}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex-1 mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium mb-2 text-white group-hover:text-purple-400 transition-colors flex items-center">
                            {feedback.sessionName}
                            <span className="ml-2 text-xs px-2 py-1 rounded-full text-white font-bold uppercase text-center shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center whitespace-nowrap"
                              style={{
                                background: `linear-gradient(to right, ${feedback.assessment.score >= 80 ? '#10b981' : feedback.assessment.score >= 60 ? '#3b82f6' : feedback.assessment.score >= 40 ? '#f59e0b' : '#ef4444'}, ${feedback.assessment.score >= 80 ? '#059669' : feedback.assessment.score >= 60 ? '#2563eb' : feedback.assessment.score >= 40 ? '#d97706' : '#dc2626'})`
                              }}
                            >
                              <FaStar className="mr-1 text-xs" /> {feedback.assessment.score}
                            </span>
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center text-xs bg-zinc-700/50 px-2 py-1 rounded-md text-gray-300">
                              <FaClock className="mr-1" /> {formatDate(feedback.createdAt)}
                            </div>
                            <div className="flex items-center text-xs bg-zinc-700/50 px-2 py-1 rounded-md text-gray-300">
                              <FaCalendarAlt className="mr-1" /> {feedback.assessment.proficiencyLevel || "Intermediate"}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <div className="flex items-center text-xs rounded-md text-gray-300">
                              <FaMicrophone className="mr-1 text-purple-400" /> {feedback.assessment.pronunciation.score}%
                            </div>
                            <div className="flex items-center text-xs rounded-md text-gray-300">
                              <FaLanguage className="mr-1 text-blue-400" /> {feedback.assessment.fluency.score}%
                            </div>
                            <div className="flex items-center text-xs rounded-md text-gray-300">
                              <FaPen className="mr-1 text-pink-400" /> {feedback.assessment.grammar.score}%
                            </div>
                            <div className="flex items-center text-xs rounded-md text-gray-300">
                              <FaBook className="mr-1 text-amber-400" /> {feedback.assessment.vocabulary.score}%
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                            <FaChevronRight />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbacksPage; 