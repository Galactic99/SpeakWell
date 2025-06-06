"use client";
import { useSearchParams } from 'next/navigation';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaUser, FaRobot, FaHeadset, FaChevronRight } from 'react-icons/fa';
import VapiGeminiSession from '@/components/VapiGeminiSession';
import { assessEnglishSkills, AssessmentResult } from '@/lib/gemini-assessment';
import { saveFeedback } from '@/lib/actions/feedback.action';

// Interface for transcript messages
interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSessionEnd = async (messages: Message[]) => {
    console.log('Session ended with transcript:', messages);
    setSessionStarted(false);
    setIsLoading(true);
    
    try {
      // Check if we actually have messages to assess
      if (!messages || messages.length === 0) {
        console.warn('No conversation transcript available, using mock data');
        // Continue with assessment process, the assessment function will handle this
      }
      
      // Format the transcript for assessment
      const formattedTranscript = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI Coach'}: ${msg.text}`)
        .join('\n\n');
      
      // Get assessment from Gemini
      // Note: assessEnglishSkills now handles errors internally and returns a default assessment
      const assessment = await assessEnglishSkills(formattedTranscript);
      
      // Store assessment in sessionStorage for the feedback page to access
      sessionStorage.setItem(`assessment-${sessionId}`, JSON.stringify(assessment));
      
      // Save assessment to Firestore
      const result = await saveFeedback(sessionId, assessment, formattedTranscript);
      
      if (!result.success) {
        console.error('Error saving feedback:', result.message);
      } else {
        console.log('Feedback saved successfully with ID:', result.feedbackId);
      }
      
      // Redirect to feedback page after 2 seconds
      setTimeout(() => {
        router.push(`/session/${sessionId}/feedback`);
      }, 2000);
    } catch (error) {
      // This should never happen now since assessEnglishSkills handles errors internally,
      // but just in case there's some other unexpected error
      console.error('Error processing session end:', error);
      
      // Use the default assessment from our assessment module
      const defaultAssessment = {
        score: 75,
        strengths: ['Participated in English conversation practice'],
        weaknesses: ['Assessment could not be completed due to technical issues'],
        pronunciation: 'Assessment not available',
        fluency: 'Assessment not available',
        grammar: 'Assessment not available',
        vocabulary: 'Assessment not available',
        overall: 'You participated in the English practice session. Unfortunately, we encountered an issue processing your detailed assessment. Keep practicing regularly to improve your skills.'
      };
      
      sessionStorage.setItem(`assessment-${sessionId}`, JSON.stringify(defaultAssessment));
      
      // Redirect to feedback page after 2 seconds
      setTimeout(() => {
        router.push(`/session/${sessionId}/feedback`);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") || "English conversation practice";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-8">
      {isLoading ? (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <h2 className="text-2xl font-bold text-white">Analyzing your conversation...</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              We're preparing your English language assessment. You'll be redirected to your results in a moment.
            </p>
          </div>
        </div>
      ) : !sessionStarted ? (
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              Let's start practicing
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Your AI conversation partner is ready to help you improve your English speaking skills.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 max-w-4xl mx-auto">
            {/* AI Coach Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-black/90 backdrop-blur-lg p-8 rounded-2xl border border-indigo-800/40 shadow-xl shadow-indigo-900/10 transform transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-800/30 transition-all">
                <FaRobot className="text-indigo-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI Coach</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Your AI speaking partner will guide the conversation, provide real-time feedback, and help you build confidence in your English skills.
              </p>
            </div>

            {/* User Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-black/90 backdrop-blur-lg p-8 rounded-2xl border border-purple-800/40 shadow-xl shadow-purple-900/10 transform transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-900/20 group-hover:shadow-purple-800/30 transition-all">
                <FaHeadset className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">You</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Practice your speaking skills in a safe, judgment-free environment. Make mistakes, learn, and improve at your own pace.
              </p>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-10">
            <button 
              onClick={() => setSessionStarted(true)}
              className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                Start Conversation
                <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full px-4 py-8 md:py-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-zinc-900/80 to-black/80 backdrop-blur-lg rounded-2xl border border-zinc-800/60 shadow-xl shadow-purple-900/5 p-6 md:p-8">
            <VapiGeminiSession 
              sessionId={sessionId} 
              onSessionEnd={handleSessionEnd}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
} 