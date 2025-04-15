"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaStar, FaThumbsUp, FaCheck, FaTimes, FaMicrophone, FaBook, FaPen, FaLanguage } from 'react-icons/fa';
import { AssessmentResult } from '@/lib/gemini-assessment';

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [rating, setRating] = useState<number | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState('');
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve assessment from sessionStorage
    const storedAssessment = sessionStorage.getItem(`assessment-${sessionId}`);
    if (storedAssessment) {
      try {
        const parsedAssessment = JSON.parse(storedAssessment);
        setAssessment(parsedAssessment);
      } catch (error) {
        console.error('Error parsing assessment:', error);
      }
    }
    setLoading(false);
  }, [sessionId]);

  const handleSubmit = () => {
    // Here you would typically save feedback to a database
    console.log('Submitting feedback:', { rating, isHelpful, comments });
    alert('Thank you for your feedback!');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Session Complete
          </h1>
          <p className="text-gray-300 text-lg">
            Great job practicing your English! Here's your assessment.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {assessment && (
              <div className="space-y-8 mb-10">
                {/* Score */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black/90 backdrop-blur-lg p-8 rounded-2xl border border-indigo-800/40 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                      <h2 className="text-2xl font-bold mb-2 text-white">Your English Score</h2>
                      <p className="text-gray-300">Based on your conversation performance</p>
                    </div>
                    <div className="relative">
                      <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border-4 border-purple-500/30">
                        <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                          {assessment.score}
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 text-xs text-gray-400">out of 100</span>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-gradient-to-br from-green-900/40 to-black/90 backdrop-blur-lg p-6 rounded-2xl border border-green-800/40 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <FaCheck className="text-green-500 mr-2" /> 
                      <span>Strengths</span>
                    </h2>
                    <ul className="space-y-3">
                      {assessment.strengths.map((strength, index) => (
                        <li key={index} className="flex">
                          <span className="text-green-400 mr-2">•</span>
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-gradient-to-br from-amber-900/40 to-black/90 backdrop-blur-lg p-6 rounded-2xl border border-amber-800/40 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <FaTimes className="text-amber-500 mr-2" /> 
                      <span>Areas for Improvement</span>
                    </h2>
                    <ul className="space-y-3">
                      {assessment.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex">
                          <span className="text-amber-400 mr-2">•</span>
                          <span className="text-gray-300">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Detailed Assessment */}
                <div className="bg-gradient-to-br from-zinc-800/50 to-black/80 backdrop-blur-lg p-6 rounded-2xl border border-zinc-700/40 shadow-xl">
                  <h2 className="text-xl font-bold mb-6 text-center">Detailed Assessment</h2>
                  
                  <div className="space-y-5">
                    {/* Pronunciation */}
                    <div className="border-b border-zinc-700/40 pb-5">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaMicrophone className="text-purple-400 mr-2" />
                        <span>Pronunciation</span>
                      </h3>
                      <p className="text-gray-300">{assessment.pronunciation}</p>
                    </div>
                    
                    {/* Fluency */}
                    <div className="border-b border-zinc-700/40 pb-5">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaLanguage className="text-blue-400 mr-2" />
                        <span>Fluency</span>
                      </h3>
                      <p className="text-gray-300">{assessment.fluency}</p>
                    </div>
                    
                    {/* Grammar */}
                    <div className="border-b border-zinc-700/40 pb-5">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaPen className="text-pink-400 mr-2" />
                        <span>Grammar</span>
                      </h3>
                      <p className="text-gray-300">{assessment.grammar}</p>
                    </div>
                    
                    {/* Vocabulary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaBook className="text-amber-400 mr-2" />
                        <span>Vocabulary</span>
                      </h3>
                      <p className="text-gray-300">{assessment.vocabulary}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Assessment */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black/90 backdrop-blur-lg p-8 rounded-2xl border border-indigo-800/40 shadow-xl">
                  <h2 className="text-xl font-bold mb-4 text-center">Overall Assessment</h2>
                  <p className="text-gray-300 leading-relaxed">{assessment.overall}</p>
                </div>
              </div>
            )}

            {/* Feedback Form */}
           
          </>
        )}
      </div>
    </div>
  );
} 