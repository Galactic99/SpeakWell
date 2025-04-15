"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaThumbsUp, FaCheck, FaTimes, FaMicrophone, FaBook, FaPen, FaLanguage, 
  FaAward, FaChartLine, FaCrown, FaGraduationCap, FaRocket, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentResult } from '@/lib/gemini-assessment';
import Aurora from '@/components/Backgrounds/Aurora/Aurora';

// Custom animated progress bar component
const SkillProgressBar = ({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
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
      className="mb-4 sm:mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <div className="flex justify-between mb-1 sm:mb-2">
        <span className="text-gray-300 text-sm sm:text-base font-medium">{label}</span>
        <motion.span 
          className={`font-bold text-sm sm:text-base ${getScoreColor()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay * 0.1 + 0.4 }}
        >
          {displayValue}%
        </motion.span>
      </div>
      <div className="w-full h-3 sm:h-4 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
        <motion.div 
          ref={progressBarRef}
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

// Component for animated display of strengths and weaknesses
const AnimatedListItem = ({ text, index, icon, color }: { text: string; index: number; icon: React.ReactNode; color: string }) => {
  return (
    <motion.li 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className={`flex items-start p-2 sm:p-3 rounded-lg bg-${color}-900/20 border border-${color}-700/30 mb-2 sm:mb-3`}
    >
      <div className={`mt-0.5 sm:mt-1 mr-2 sm:mr-3 text-${color}-400 text-sm sm:text-base`}>{icon}</div>
      <span className="text-gray-300 text-sm sm:text-base">{text}</span>
    </motion.li>
  );
};

// Animated card component with hover effects
const AnimatedCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <motion.div 
      className={`bg-gradient-to-br from-zinc-900/60 to-black/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-zinc-800/40 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -5, 0],
        transition: {
          opacity: { duration: 0.5, delay: delay * 0.1 },
          y: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
            delay: delay * 0.1 + 1
          }
        }
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

// Tooltip component 
const Tooltip = ({ children, text, show }: { children: React.ReactNode; text: string; show: boolean }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative group">
      {children}
      <AnimatePresence>
        {isClient && show && (
          <motion.div 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-xs text-white rounded shadow-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Floating Starlight particle component
const FloatingParticle = ({ index, confined = false }: { index: number, confined?: boolean }) => {
  // Use deterministic values based on index instead of Math.random()
  const getSeed = (base: number) => {
    // Create deterministic "random" numbers using the index
    return (Math.sin(index * base) + 1) / 2;
  };
  
  const size = getSeed(74.21) * 3 + 1;
  const duration = getSeed(13.37) * 10 + 15;
  const initialX = getSeed(42.24) * 100;
  const initialY = getSeed(99.99) * 100;
  const delay = getSeed(23.45) * 5;
  
  // For particles confined to the score circle
  const distance = confined ? 30 : 100;
  const centerX = confined ? 50 : initialX;
  const centerY = confined ? 50 : initialY;
  const particleSize = confined ? getSeed(55.55) * 5 + 2 : size;
  const particleOpacity = confined ? getSeed(66.66) * 0.7 + 0.3 : getSeed(77.77) * 0.5 + 0.2;
  const animationDuration = confined ? getSeed(88.88) * 3 + 2 : duration;
  
  return (
    <motion.div 
      className={`absolute rounded-full ${confined ? 'bg-purple-300' : 'bg-white'} pointer-events-none`}
      style={{
        width: particleSize,
        height: particleSize,
        left: `${centerX}%`,
        top: `${centerY}%`,
        opacity: particleOpacity,
        boxShadow: `0 0 ${particleSize * 2}px ${particleSize}px ${confined ? 'rgba(192, 132, 252, 0.4)' : 'rgba(255, 255, 255, 0.3)'}`
      }}
      animate={confined ? {
        x: [(getSeed(11.11) - 0.5) * distance, (getSeed(22.22) - 0.5) * distance],
        y: [(getSeed(33.33) - 0.5) * distance, (getSeed(44.44) - 0.5) * distance],
        opacity: [particleOpacity, 0]
      } : {
        y: [0, -20, 0],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={confined ? {
        x: {
          repeat: Infinity,
          duration: animationDuration,
          ease: "linear",
          repeatType: "reverse"
        },
        y: {
          repeat: Infinity,
          duration: animationDuration * 0.8,
          ease: "linear",
          repeatType: "reverse"
        },
        opacity: {
          duration: animationDuration,
          ease: "easeOut"
        }
      } : {
        y: {
          repeat: Infinity,
          duration,
          ease: "easeInOut",
          delay
        },
        opacity: {
          repeat: Infinity,
          duration: duration / 2,
          ease: "easeInOut",
          delay
        }
      }}
    />
  );
};

// Confetti Component
const Confetti = ({ isActive }: { isActive: boolean }) => {
  const confettiCount = 150;
  
  // Deterministic pseudo-random function
  const getPseudoRandom = (index: number, multiplier = 1, offset = 0) => {
    return (Math.sin(index * multiplier) + 1) / 2 + offset;
  };
  
  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(confettiCount)].map((_, i) => {
            const size = getPseudoRandom(i, 12.34) * 10 + 5;
            const colorIndex = Math.floor(getPseudoRandom(i, 56.78) * 6);
            const color = ['#FF5252', '#FFD740', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'][colorIndex];
            const rotationStart = getPseudoRandom(i, 91.01) * 360;
            const rotationEnd = rotationStart + getPseudoRandom(i, 23.45) * 360 + 360;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-md"
                style={{
                  width: size,
                  height: size * 0.4,
                  backgroundColor: color,
                  top: `-5%`,
                  left: `${getPseudoRandom(i, 67.89) * 100}%`,
                  position: 'absolute',
                  zIndex: 50,
                  opacity: getPseudoRandom(i, 34.56) * 0.5 + 0.5,
                }}
                initial={{ 
                  y: -20, 
                  rotate: rotationStart 
                }}
                animate={{ 
                  y: `${100 + getPseudoRandom(i, 78.90) * 20}vh`, 
                  rotate: rotationEnd,
                  x: (getPseudoRandom(i, 45.67) - 0.5) * 300
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: getPseudoRandom(i, 89.01) * 5 + 5,
                  ease: [0.1, 0.4, 0.6, 1],
                  delay: getPseudoRandom(i, 12.34) * 0.5
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const [rating, setRating] = useState<number | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState('');
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Animation references
  const scoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a default assessment to prevent hydration mismatch
  const defaultAssessment: AssessmentResult = {
    score: 70,
    proficiencyLevel: "Intermediate (B1)",
    strengths: ['Participated in English conversation practice'],
    weaknesses: ['Practice needed for improvement'],
    pronunciation: {
      score: 70,
      feedback: 'Assessment data unavailable',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Practice reading aloud', 'Listen to native speakers', 'Record yourself speaking']
    },
    fluency: {
      score: 70,
      feedback: 'Assessment data unavailable',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Practice speaking daily', 'Try to think in English', 'Join conversation groups']
    },
    grammar: {
      score: 70,
      feedback: 'Assessment data unavailable',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Review basic grammar rules', 'Practice with exercises', 'Use grammar checking tools']
    },
    vocabulary: {
      score: 70,
      feedback: 'Assessment data unavailable',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Learn new words daily', 'Use vocabulary in context', 'Read diverse materials']
    },
    overall: 'Thank you for practicing your English! Practice regularly to improve your skills.',
    nextSteps: [
      'Continue regular English practice',
      'Listen to English content daily',
      'Try to speak with native speakers',
      'Use language learning apps'
    ]
  };

  // Mark component as client-side rendered after initial mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run client-side operations after initial hydration
    if (!isClient) return;

    // Simulate a nicer loading experience
    const loadTimer = setTimeout(() => {
      setInitialLoad(false);
    }, 1800);
    
    // Retrieve assessment from sessionStorage
    const storedAssessment = sessionStorage.getItem(`assessment-${sessionId}`);
    if (storedAssessment) {
      try {
        const parsedAssessment = JSON.parse(storedAssessment);
        
        // Handle possible old format assessment
        if (parsedAssessment && typeof parsedAssessment.pronunciation === 'string') {
          // Convert old format to new format
          const convertedAssessment: AssessmentResult = {
            ...parsedAssessment,
            proficiencyLevel: parsedAssessment.proficiencyLevel || "Intermediate (B1)",
            pronunciation: {
              score: 70,
              feedback: parsedAssessment.pronunciation || 'Assessment data unavailable',
              examples: ['N/A - Technical limitations prevented detailed analysis'],
              tips: ['Practice reading aloud', 'Listen to native speakers', 'Record yourself speaking']
            },
            fluency: {
              score: 70,
              feedback: parsedAssessment.fluency || 'Assessment data unavailable',
              examples: ['N/A - Technical limitations prevented detailed analysis'],
              tips: ['Practice speaking daily', 'Try to think in English', 'Join conversation groups']
            },
            grammar: {
              score: 70,
              feedback: parsedAssessment.grammar || 'Assessment data unavailable',
              examples: ['N/A - Technical limitations prevented detailed analysis'],
              tips: ['Review basic grammar rules', 'Practice with exercises', 'Use grammar checking tools']
            },
            vocabulary: {
              score: 70,
              feedback: parsedAssessment.vocabulary || 'Assessment data unavailable',
              examples: ['N/A - Technical limitations prevented detailed analysis'],
              tips: ['Learn new words daily', 'Use vocabulary in context', 'Read diverse materials']
            },
            nextSteps: parsedAssessment.nextSteps || [
              'Continue regular English practice',
              'Listen to English content daily',
              'Try to speak with native speakers',
              'Use language learning apps'
            ]
          };
          setAssessment(convertedAssessment);
        } else {
          setAssessment(parsedAssessment);
        }
      } catch (error) {
        console.error('Error parsing assessment:', error);
        // Set default assessment if parsing fails
        setAssessment(defaultAssessment);
      }
    } else {
      // If no assessment is found in storage, provide a default one
      console.warn('No assessment found in session storage');
      setAssessment(defaultAssessment);
    }
    
    // Use a timeout to show loading state for at least 2 seconds for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, [sessionId, isClient]);
  
  // Separate effect for client-side confetti and sound
  useEffect(() => {
    // Only run on client-side after loading completes
    if (!loading && !initialLoad && isClient) {
      // Trigger confetti after a small delay to ensure the UI has transitioned
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 800);
      
      // Hide confetti after 4 seconds
      const hideConfettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 4800);
      
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(hideConfettiTimer);
      };
    }
  }, [loading, initialLoad, isClient]);

  // Effect for keyboard navigation between tabs
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab switching with arrow keys
      if (e.key === 'ArrowRight' && activeTab === 'overview') {
        setActiveTab('details');
      } else if (e.key === 'ArrowLeft' && activeTab === 'details') {
        setActiveTab('overview');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isClient]);

  const handleSubmit = () => {
    // Here you would typically save feedback to a database
    console.log('Submitting feedback:', { rating, isHelpful, comments });
    alert('Thank you for your feedback!');
  };

  // Calculate scores with slight variations for each skill
  const getPronunciationScore = () => {
    return assessment?.pronunciation?.score || 70;
  };
  
  const getFluencyScore = () => {
    return assessment?.fluency?.score || 70;
  };
  
  const getGrammarScore = () => {
    return assessment?.grammar?.score || 70;
  };
  
  const getVocabularyScore = () => {
    return assessment?.vocabulary?.score || 70;
  };

  // Get total star count for achievement animation
  const getStarCount = () => {
    const baseScore = assessment?.score || 70;
    return Math.max(1, Math.ceil(baseScore / 20));
  };

  // Get appropriate message for score level
  const getScoreMessage = () => {
    const score = assessment?.score || 70;
    if (score >= 90) return "Excellent! Your English skills are outstanding!";
    if (score >= 80) return "Great work! You're demonstrating strong English abilities!";
    if (score >= 70) return "Good job! You're making solid progress in English!";
    if (score >= 60) return "Nice effort! Keep practicing to improve your skills!";
    return "You've taken an important step in learning English!";
  };
  
  // Get color class based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Function to copy assessment summary to clipboard - only runs on client
  const copyToClipboard = () => {
    if (!assessment) return;
    
    const summary = `
SpeakWell English Assessment Summary
====================================
Overall Score: ${assessment.score}/100
Proficiency Level: ${assessment.proficiencyLevel || "Intermediate (B1)"}

SKILLS BREAKDOWN
---------------
Pronunciation: ${assessment.pronunciation.score}%
Fluency: ${assessment.fluency.score}%
Grammar: ${assessment.grammar.score}%
Vocabulary: ${assessment.vocabulary.score}%

STRENGTHS
---------
${assessment.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT
-------------------
${assessment.weaknesses.map(w => `• ${w}`).join('\n')}

DETAILED FEEDBACK
---------------
Pronunciation: ${assessment.pronunciation.feedback}
${assessment.pronunciation.tips.map(tip => `  - ${tip}`).join('\n')}

Fluency: ${assessment.fluency.feedback}
${assessment.fluency.tips.map(tip => `  - ${tip}`).join('\n')}

Grammar: ${assessment.grammar.feedback}
${assessment.grammar.tips.map(tip => `  - ${tip}`).join('\n')}

Vocabulary: ${assessment.vocabulary.feedback}
${assessment.vocabulary.tips.map(tip => `  - ${tip}`).join('\n')}

RECOMMENDED NEXT STEPS
--------------------
${assessment.nextSteps.map((step, i) => `${i+1}. ${step}`).join('\n')}

OVERALL ASSESSMENT
---------------
${assessment.overall}

This assessment was generated by SpeakWell, your AI-powered English practice partner.
`;
    
    navigator.clipboard.writeText(summary)
      .then(() => {
        alert('Assessment summary copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Could not copy to clipboard. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950/40 text-white p-2 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Only show confetti on client side */}
      {isClient && showConfetti && <Confetti isActive={showConfetti} />}

      {/* Add Aurora background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Aurora 
          colorStops={["#8B5CF6", "#C026D3", "#4F46E5"]} 
          blend={0.7}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      
      {/* Background floating particles - only rendered on client */}
      {isClient && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}
        </div>
      )}
      
      {initialLoad ? (
        <div className="flex flex-col justify-center items-center min-h-screen relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-purple-500/30 animate-pulse"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center relative z-10">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Preparing your assessment...
          </h2>
          <div className="max-w-xs sm:max-w-md text-center mt-4 px-4">
            <p className="text-sm sm:text-base text-gray-400">We're analyzing your conversation to provide personalized feedback on your English skills.</p>
          </div>
        </div>
      ) : (
        <motion.div 
          className="max-w-4xl mx-auto relative z-10 px-2 sm:px-4"
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center mb-4 sm:mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              Your Language Assessment
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              Great job practicing your English! Here's your personalized feedback.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {assessment && (
                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                  {/* Achievement Banner */}
                  <motion.div
                    className="bg-gradient-to-br from-purple-900/60 to-black/90 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl border border-purple-800/40 shadow-xl overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 sm:-mr-32 -mt-20 sm:-mt-32 animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0 text-center md:text-left">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center justify-center md:justify-start mb-2"
                          >
                            <FaAward className="text-yellow-400 mr-2 text-lg sm:text-xl" />
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">English Practice Achievement</h2>
                          </motion.div>
                          <motion.p 
                            className="text-gray-300 text-sm sm:text-base md:max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            {getScoreMessage()}
                          </motion.p>
                          <motion.div 
                            className="flex space-x-1 mt-3 sm:mt-4 justify-center md:justify-start"
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
                                <FaStar className={i < getStarCount() ? "text-yellow-400 text-lg sm:text-xl" : "text-gray-600 text-lg sm:text-xl"} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                        <div className="relative">
                          <motion.div 
                            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-4 border-purple-500/30 flex items-center justify-center relative"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", duration: 0.6 }}
                            ref={scoreRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            <AnimatePresence>
                              {isClient && isHovered && (
                                <>
                                <motion.div 
                                  className="absolute inset-0 rounded-full bg-purple-500/20"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1.1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  transition={{ duration: 0.4 }}
                                />
                                {/* Particle animations */}
                                {[...Array(8)].map((_, i) => (
                                  <FloatingParticle key={i} index={i} confined />
                                ))}
                                </>
                              )}
                            </AnimatePresence>
                            <motion.span 
                              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: "spring", duration: 0.7 }}
                            >
                              {assessment.score}
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
                  <div className="flex flex-col items-center mb-4 sm:mb-6 space-y-2">
                    <div className="bg-gray-900/50 backdrop-blur-md rounded-full p-1 flex space-x-1 w-full max-w-xs sm:max-w-md mx-auto">
                      <motion.button
                        className={`py-2 px-4 sm:px-6 rounded-full font-medium transition-all flex items-center justify-center flex-1 text-sm sm:text-base ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('overview')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaChartLine className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                        Overview
                      </motion.button>
                      <motion.button
                        className={`py-2 px-4 sm:px-6 rounded-full font-medium transition-all flex items-center justify-center flex-1 text-sm sm:text-base ${activeTab === 'details' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('details')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGraduationCap className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                        Details
                      </motion.button>
                    </div>
                    <motion.div 
                      className="text-xs text-gray-400 hidden sm:block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Use arrow keys <span className="px-1 py-0.5 bg-gray-800/80 rounded text-gray-300 mx-1">←</span> <span className="px-1 py-0.5 bg-gray-800/80 rounded text-gray-300 mx-1">→</span> to navigate tabs
                    </motion.div>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' ? (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Skills Analysis - Now with animation delays for each bar */}
                        <AnimatedCard delay={1}>
                          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center flex items-center justify-center">
                            <FaRocket className="mr-2 text-purple-400" />
                            <span>Skills Analysis</span>
                          </h2>
                          
                          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                            <SkillProgressBar 
                              label="Pronunciation" 
                              value={getPronunciationScore()} 
                              color="green" 
                              delay={0}
                            />
                            
                            <SkillProgressBar 
                              label="Fluency" 
                              value={getFluencyScore()} 
                              color="purple" 
                              delay={1}
                            />
                            
                            <SkillProgressBar 
                              label="Grammar" 
                              value={getGrammarScore()} 
                              color="blue" 
                              delay={2}
                            />
                            
                            <SkillProgressBar 
                              label="Vocabulary" 
                              value={getVocabularyScore()} 
                              color="orange" 
                              delay={3}
                            />
                          </div>
                        </AnimatedCard>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                          {/* Strengths */}
                          <AnimatedCard delay={2} className="border-green-800/40 from-green-900/30 to-black/80">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
                              <FaCheck className="text-green-500 mr-2" /> 
                              <span>Strengths</span>
                            </h2>
                            <ul className="space-y-2 sm:space-y-3">
                              {assessment.strengths.map((strength, index) => (
                                <AnimatedListItem key={index} text={strength} index={index} icon={<FaCheck />} color="green" />
                              ))}
                            </ul>
                          </AnimatedCard>

                          {/* Weaknesses */}
                          <AnimatedCard delay={2.5} className="border-amber-800/40 from-amber-900/30 to-black/80">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
                              <FaTimes className="text-amber-500 mr-2" /> 
                              <span>Areas for Improvement</span>
                            </h2>
                            <ul className="space-y-2 sm:space-y-3">
                              {assessment.weaknesses.map((weakness, index) => (
                                <AnimatedListItem key={index} text={weakness} index={index} icon={<FaTimes />} color="amber" />
                              ))}
                            </ul>
                          </AnimatedCard>
                        </div>

                        {/* Overall Assessment */}
                        <AnimatedCard delay={3} className="mt-4 sm:mt-6 border-indigo-800/40 from-indigo-900/40 to-black/90">
                          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center flex items-center justify-center">
                            <FaCrown className="text-yellow-400 mr-2" />
                            <span>Overall Assessment</span>
                          </h2>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{assessment.overall}</p>
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
                          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center flex items-center justify-center">
                            <FaGraduationCap className="text-purple-400 mr-2" />
                            <span>Detailed Skills Assessment</span>
                          </h2>
                          
                          <div className="space-y-4 sm:space-y-5">
                            {/* CEFR Proficiency Level */}
                            {assessment.proficiencyLevel && (
                              <div className="flex justify-center mb-6">
                                <motion.div
                                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                  <span className="text-white font-semibold">Proficiency Level: {assessment.proficiencyLevel}</span>
                                </motion.div>
                              </div>
                            )}
                            
                            {/* Pronunciation */}
                            <motion.div 
                              className="border-b border-zinc-700/40 pb-4 sm:pb-5"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center">
                                  <FaMicrophone className="text-purple-400 mr-2" />
                                  <span>Pronunciation</span>
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(getPronunciationScore())}`}>
                                  {getPronunciationScore()}%
                                </span>
                              </div>
                              <p className="text-sm sm:text-base text-gray-300 mb-3">{assessment.pronunciation.feedback}</p>
                              
                              {/* Examples */}
                              {assessment.pronunciation.examples.length > 0 && assessment.pronunciation.examples[0] !== 'N/A - Technical limitations prevented detailed analysis' && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Examples:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {assessment.pronunciation.examples.map((example, i) => (
                                      <li key={i} className="text-sm text-gray-300 ml-2">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Tips */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.pronunciation.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                            
                            {/* Fluency */}
                            <motion.div 
                              className="border-b border-zinc-700/40 pb-4 sm:pb-5"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center">
                                  <FaLanguage className="text-blue-400 mr-2" />
                                  <span>Fluency</span>
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(getFluencyScore())}`}>
                                  {getFluencyScore()}%
                                </span>
                              </div>
                              <p className="text-sm sm:text-base text-gray-300 mb-3">{assessment.fluency.feedback}</p>
                              
                              {/* Examples */}
                              {assessment.fluency.examples.length > 0 && assessment.fluency.examples[0] !== 'N/A - Technical limitations prevented detailed analysis' && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Examples:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {assessment.fluency.examples.map((example, i) => (
                                      <li key={i} className="text-sm text-gray-300 ml-2">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Tips */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.fluency.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                            
                            {/* Grammar */}
                            <motion.div 
                              className="border-b border-zinc-700/40 pb-4 sm:pb-5"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center">
                                  <FaPen className="text-pink-400 mr-2" />
                                  <span>Grammar</span>
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(getGrammarScore())}`}>
                                  {getGrammarScore()}%
                                </span>
                              </div>
                              <p className="text-sm sm:text-base text-gray-300 mb-3">{assessment.grammar.feedback}</p>
                              
                              {/* Examples */}
                              {assessment.grammar.examples.length > 0 && assessment.grammar.examples[0] !== 'N/A - Technical limitations prevented detailed analysis' && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Examples:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {assessment.grammar.examples.map((example, i) => (
                                      <li key={i} className="text-sm text-gray-300 ml-2">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Tips */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.grammar.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                            
                            {/* Vocabulary */}
                            <motion.div
                              className="border-b border-zinc-700/40 pb-4 sm:pb-5"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center">
                                  <FaBook className="text-amber-400 mr-2" />
                                  <span>Vocabulary</span>
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${getScoreBadgeColor(getVocabularyScore())}`}>
                                  {getVocabularyScore()}%
                                </span>
                              </div>
                              <p className="text-sm sm:text-base text-gray-300 mb-3">{assessment.vocabulary.feedback}</p>
                              
                              {/* Examples */}
                              {assessment.vocabulary.examples.length > 0 && assessment.vocabulary.examples[0] !== 'N/A - Technical limitations prevented detailed analysis' && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Examples:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {assessment.vocabulary.examples.map((example, i) => (
                                      <li key={i} className="text-sm text-gray-300 ml-2">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Tips */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Improvement Tips:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {assessment.vocabulary.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-300 ml-2">{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                            
                            {/* Next Steps */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.0, duration: 0.5 }}
                            >
                              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center">
                                <FaRocket className="text-green-400 mr-2" />
                                <span>Recommended Next Steps</span>
                              </h3>
                              <ul className="space-y-2">
                                {assessment.nextSteps.map((step, i) => (
                                  <motion.li 
                                    key={i}
                                    className="flex items-start p-2 rounded-lg bg-green-900/20 border border-green-700/30"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.0 + (0.1 * i) }}
                                  >
                                    <div className="mt-0.5 mr-2 text-green-400 text-sm">•</div>
                                    <span className="text-sm sm:text-base text-gray-300">{step}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          </div>
                        </AnimatedCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Next Steps Button */}
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-center mt-6 sm:mt-10 space-y-3 sm:space-y-0 sm:space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <Tooltip text="Copy assessment summary to clipboard" show={showShareTooltip}>
                      <motion.button
                        onClick={copyToClipboard}
                        onMouseEnter={() => setShowShareTooltip(true)}
                        onMouseLeave={() => setShowShareTooltip(false)}
                        className="group relative overflow-hidden px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm sm:text-base shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-300 w-full sm:w-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <FaThumbsUp className="mr-2" />
                          <span>Share Results</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.button>
                    </Tooltip>
                    
                    <motion.button
                      onClick={() => router.push('/home')}
                      className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base md:text-lg shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <span>Back to Dashboard</span>
                        <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
} 