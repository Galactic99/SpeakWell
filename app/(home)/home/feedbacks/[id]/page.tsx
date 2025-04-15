"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFeedbackById } from '@/lib/actions/feedback.action';
import { FaChevronLeft, FaStar, FaChartLine, FaMicrophone, FaBook, FaPen, FaLanguage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Import the components from the feedback page
const SkillProgressBar = ({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) => {
  const [width, setWidth] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Trigger animation when component mounts
    const widthTimer = setTimeout(() => {
      setWidth(value);
    }, 500 + delay);
    
    // Animate the number counting up
    let start = 0;
    const increment = value / 40; // Divide by steps for smooth animation
    const timer = setInterval(() => {
      start += increment;
      if (start > value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 50);
    
    return () => {
      clearTimeout(widthTimer);
      clearInterval(timer);
    };
  }, [value, delay]);
  
  // Determine the gradient based on color
  const getGradient = () => {
    switch(color) {
      case 'red':
        return 'from-red-500 via-orange-400 to-amber-300';
      case 'orange':
        return 'from-orange-500 via-amber-400 to-yellow-300';
      case 'green':
        return 'from-emerald-500 via-green-400 to-teal-300';
      case 'blue':
        return 'from-blue-500 via-indigo-400 to-violet-300';
      case 'purple':
        return 'from-purple-500 via-fuchsia-400 to-pink-300';
      default:
        return 'from-violet-500 via-purple-400 to-indigo-300';
    }
  };
  
  // Determine color based on score
  const getScoreColor = () => {
    if (value < 40) return 'text-red-400';
    if (value < 60) return 'text-amber-400';
    if (value < 80) return 'text-teal-400';
    return 'text-emerald-400';
  };
  
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <div className="flex justify-between mb-1">
        <span className="text-gray-300 text-sm font-medium">{label}</span>
        <motion.span 
          className={`font-bold text-sm ${getScoreColor()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay * 0.1 + 0.4 }}
        >
          {displayValue}%
        </motion.span>
      </div>
      <div className="w-full h-3 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
        <motion.div 
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} relative`}
          style={{ width: `${width}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ 
            duration: 1.2, 
            delay: delay * 0.1 + 0.2,
            ease: "easeOut"
          }}
        >
          <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-30 bg-repeat-y animate-pulse"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AnimatedCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <motion.div 
      className={`bg-gradient-to-br from-zinc-900/60 to-black/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-zinc-800/40 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default function FeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params.id as string;
  
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const result = await getFeedbackById(feedbackId);
        
        if (result.success && result.data) {
          setFeedback(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
        setError('Failed to load feedback details');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedback();
  }, [feedbackId]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get star count for achievement animation
  const getStarCount = () => {
    const baseScore = feedback?.assessment?.score || 70;
    return Math.max(1, Math.ceil(baseScore / 20));
  };

  // Get color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <header className="flex items-center mb-8">
          <motion.button
            onClick={() => router.push('/home/feedbacks')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChevronLeft className="mr-2" />
            <span>Back to Feedback History</span>
          </motion.button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Feedback</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/home/feedbacks')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Return to Feedback History
            </button>
          </div>
        ) : feedback ? (
          <>
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                {feedback.sessionName}
              </h1>
              <p className="text-lg text-gray-300">
                Session from {formatDate(feedback.createdAt)}
              </p>
            </div>

            <div className="space-y-6">
              {/* Achievement Banner */}
              <motion.div
                className="bg-gradient-to-br from-purple-900/60 to-black/90 backdrop-blur-lg p-6 rounded-2xl border border-purple-800/40 shadow-xl overflow-hidden relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center justify-center md:justify-start mb-2"
                      >
                        <h2 className="text-xl font-bold text-white">Proficiency Level: {feedback.assessment.proficiencyLevel}</h2>
                      </motion.div>
                      <motion.p 
                        className="text-gray-300 text-base md:max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {feedback.assessment.overall}
                      </motion.p>
                      <motion.div 
                        className="flex space-x-1 mt-4 justify-center md:justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ scale: 0 }}
                            animate={{ scale: i < getStarCount() ? 1 : 0.7 }}
                            transition={{ delay: 0.7 + (i * 0.1), duration: 0.3, type: "spring" }}
                          >
                            <FaStar className={i < getStarCount() ? "text-yellow-400 text-lg" : "text-gray-600 text-lg"} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                    <div className="relative">
                      <motion.div 
                        className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-4 border-purple-500/30 flex items-center justify-center relative"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", duration: 0.6 }}
                      >
                        <motion.span 
                          className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", duration: 0.7 }}
                        >
                          {feedback.assessment.score}
                        </motion.span>
                      </motion.div>
                      <motion.span 
                        className="absolute bottom-2 right-2 text-xs text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        out of 100
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tab Navigation */}
              <div className="flex flex-col items-center mb-4 space-y-2">
                <div className="bg-gray-900/50 backdrop-blur-md rounded-full p-1 flex space-x-1 w-full max-w-xs mx-auto">
                  <motion.button
                    className={`py-2 px-4 rounded-full font-medium transition-all flex items-center justify-center flex-1 text-sm ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800/50'}`}
                    onClick={() => setActiveTab('overview')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChartLine className="mr-1 text-xs" />
                    Overview
                  </motion.button>
                  <motion.button
                    className={`py-2 px-4 rounded-full font-medium transition-all flex items-center justify-center flex-1 text-sm ${activeTab === 'details' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800/50'}`}
                    onClick={() => setActiveTab('details')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChartLine className="mr-1 text-xs" />
                    Details
                  </motion.button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Skills Analysis */}
                  <AnimatedCard delay={1}>
                    <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center">
                      <FaChartLine className="mr-2 text-purple-400" />
                      <span>Skills Analysis</span>
                    </h2>
                    
                    <div className="mt-4 space-y-3">
                      <SkillProgressBar 
                        label="Pronunciation" 
                        value={feedback.assessment.pronunciation.score} 
                        color="green" 
                        delay={0}
                      />
                      
                      <SkillProgressBar 
                        label="Fluency" 
                        value={feedback.assessment.fluency.score} 
                        color="purple" 
                        delay={1}
                      />
                      
                      <SkillProgressBar 
                        label="Grammar" 
                        value={feedback.assessment.grammar.score} 
                        color="blue" 
                        delay={2}
                      />
                      
                      <SkillProgressBar 
                        label="Vocabulary" 
                        value={feedback.assessment.vocabulary.score} 
                        color="orange" 
                        delay={3}
                      />
                    </div>
                  </AnimatedCard>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Strengths */}
                    <AnimatedCard delay={2} className="border-green-800/40 from-green-900/30 to-black/80">
                      <h2 className="text-lg font-bold mb-3 flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Strengths</span>
                      </h2>
                      <ul className="space-y-2">
                        {feedback.assessment.strengths.map((strength: string, index: number) => (
                          <motion.li 
                            key={index}
                            className="flex items-start p-2 rounded-lg bg-green-900/20 border border-green-700/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                          >
                            <div className="mt-0.5 mr-2 text-green-400 text-sm">•</div>
                            <span className="text-gray-300 text-sm">{strength}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatedCard>

                    {/* Weaknesses */}
                    <AnimatedCard delay={2.5} className="border-amber-800/40 from-amber-900/30 to-black/80">
                      <h2 className="text-lg font-bold mb-3 flex items-center">
                        <span className="text-amber-500 mr-2">✗</span>
                        <span>Areas for Improvement</span>
                      </h2>
                      <ul className="space-y-2">
                        {feedback.assessment.weaknesses.map((weakness: string, index: number) => (
                          <motion.li 
                            key={index}
                            className="flex items-start p-2 rounded-lg bg-amber-900/20 border border-amber-700/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                          >
                            <div className="mt-0.5 mr-2 text-amber-400 text-sm">•</div>
                            <span className="text-gray-300 text-sm">{weakness}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatedCard>
                  </div>

                  {/* Next Steps */}
                  <AnimatedCard delay={3} className="mt-6">
                    <h2 className="text-lg font-bold mb-3 flex items-center">
                      <span className="text-blue-400 mr-2">▶</span>
                      <span>Recommended Next Steps</span>
                    </h2>
                    <ul className="space-y-2">
                      {feedback.assessment.nextSteps.map((step: string, i: number) => (
                        <motion.li 
                          key={i}
                          className="flex items-start p-2 rounded-lg bg-blue-900/20 border border-blue-700/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * i }}
                        >
                          <div className="mt-0.5 mr-2 text-blue-400 text-sm">•</div>
                          <span className="text-gray-300 text-sm">{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </AnimatedCard>
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Detailed Assessment */}
                  <AnimatedCard delay={1}>
                    <h2 className="text-lg font-bold mb-4 text-center flex items-center justify-center">
                      <FaChartLine className="text-purple-400 mr-2" />
                      <span>Detailed Skills Assessment</span>
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Pronunciation */}
                      <motion.div 
                        className="border-b border-zinc-700/40 pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold flex items-center">
                            <FaMicrophone className="text-purple-400 mr-2" />
                            <span>Pronunciation</span>
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(feedback.assessment.pronunciation.score)}`}>
                            {feedback.assessment.pronunciation.score}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{feedback.assessment.pronunciation.feedback}</p>
                        
                        {/* Tips */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.assessment.pronunciation.tips.map((tip: string, i: number) => (
                              <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                      
                      {/* Fluency */}
                      <motion.div 
                        className="border-b border-zinc-700/40 pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold flex items-center">
                            <FaLanguage className="text-blue-400 mr-2" />
                            <span>Fluency</span>
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(feedback.assessment.fluency.score)}`}>
                            {feedback.assessment.fluency.score}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{feedback.assessment.fluency.feedback}</p>
                        
                        {/* Tips */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.assessment.fluency.tips.map((tip: string, i: number) => (
                              <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                      
                      {/* Grammar */}
                      <motion.div 
                        className="border-b border-zinc-700/40 pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold flex items-center">
                            <FaPen className="text-pink-400 mr-2" />
                            <span>Grammar</span>
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(feedback.assessment.grammar.score)}`}>
                            {feedback.assessment.grammar.score}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{feedback.assessment.grammar.feedback}</p>
                        
                        {/* Tips */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.assessment.grammar.tips.map((tip: string, i: number) => (
                              <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                      
                      {/* Vocabulary */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold flex items-center">
                            <FaBook className="text-amber-400 mr-2" />
                            <span>Vocabulary</span>
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(feedback.assessment.vocabulary.score)}`}>
                            {feedback.assessment.vocabulary.score}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{feedback.assessment.vocabulary.feedback}</p>
                        
                        {/* Tips */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.assessment.vocabulary.tips.map((tip: string, i: number) => (
                              <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={() => router.push('/session/' + crypto.randomUUID())}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-bold shadow-lg hover:shadow-purple-900/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start New Session
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Feedback Not Found</h2>
            <p className="text-gray-400 mb-6">The requested feedback could not be found.</p>
            <button
              onClick={() => router.push('/home/feedbacks')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Return to Feedback History
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 