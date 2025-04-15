"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { FaStar, FaThumbsUp } from 'react-icons/fa';

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [rating, setRating] = useState<number | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Session Complete
          </h1>
          <p className="text-gray-300 text-lg">
            Great job practicing your English! How was your experience?
          </p>
        </div>

        {/* Feedback Form */}
        <div className="space-y-6">
          {/* Rating */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/40">
            <h2 className="text-xl font-semibold mb-4">How would you rate this session?</h2>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className="flex flex-col items-center group"
                  onClick={() => setRating(value)}
                >
                  <FaStar 
                    className={`text-3xl ${rating === value ? 'text-yellow-400' : 'text-zinc-500'} group-hover:text-yellow-400 transition-colors`} 
                  />
                  <span className={`mt-2 text-sm ${rating === value ? 'text-yellow-400' : 'text-zinc-400'} group-hover:text-yellow-400 transition-colors`}>
                    {value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Helpful */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/40">
            <h2 className="text-xl font-semibold mb-4">Was this session helpful for your learning?</h2>
            <div className="flex justify-center space-x-8">
              <button 
                className="flex flex-col items-center group"
                onClick={() => setIsHelpful(true)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isHelpful === true ? 'bg-green-900/50' : 'bg-zinc-800'} group-hover:bg-green-900/50 transition-colors`}>
                  <FaThumbsUp className={`text-xl ${isHelpful === true ? 'text-green-400' : 'text-zinc-400'} group-hover:text-green-400 transition-colors`} />
                </div>
                <span className={`mt-2 text-sm ${isHelpful === true ? 'text-green-400' : 'text-zinc-400'} group-hover:text-green-400 transition-colors`}>
                  Yes
                </span>
              </button>
              <button 
                className="flex flex-col items-center group"
                onClick={() => setIsHelpful(false)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isHelpful === false ? 'bg-red-900/50' : 'bg-zinc-800'} group-hover:bg-red-900/50 transition-colors`}>
                  <FaThumbsUp className={`text-xl ${isHelpful === false ? 'text-red-400' : 'text-zinc-400'} group-hover:text-red-400 transition-colors rotate-180`} />
                </div>
                <span className={`mt-2 text-sm ${isHelpful === false ? 'text-red-400' : 'text-zinc-400'} group-hover:text-red-400 transition-colors`}>
                  No
                </span>
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/40">
            <h2 className="text-xl font-semibold mb-4">Any additional comments?</h2>
            <textarea 
              className="w-full bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              rows={4}
              placeholder="Share your thoughts about this practice session..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 