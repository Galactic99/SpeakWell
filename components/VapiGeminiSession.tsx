"use client";

import React, { useState, useEffect, useRef } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaMicrophone, FaStop, FaCircle, FaRegCircle, FaRobot, FaHeadset, FaUser } from 'react-icons/fa';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

// We'll use this directly instead of as a workflow ID
const VAPI_TOKEN = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!;

interface Message {
  role: 'user' | 'ai';
  text: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export interface VapiGeminiSessionProps {
  sessionId: string;
  onSessionEnd?: (transcript: Message[]) => void;
  initialPrompt?: string;
  theme?: string;
  voiceId?: string;
}

// Helper function to safely handle messages
const getTextFromTranscript = (message: any): string | null => {
  if (message?.transcript && typeof message.transcript === 'string') {
    return message.transcript;
  }
  return null;
};

// Helper function to check browser microphone support
const checkMicrophoneSupport = async (): Promise<boolean> => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop all tracks to release the microphone
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    return false;
  }
};

const VapiGeminiSession: React.FC<VapiGeminiSessionProps> = ({
  sessionId,
  onSessionEnd,
  initialPrompt = "You are an English language coach helping a student practice conversation skills. Be friendly, encouraging, and provide gentle corrections when appropriate.",
  theme = "casual conversation",
  voiceId = "nova"
}) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingResponseRef = useRef<string | null>(null);

  // Check microphone access on component mount
  useEffect(() => {
    const checkMic = async () => {
      const hasAccess = await checkMicrophoneSupport();
      if (!hasAccess) {
        setError('Microphone access is required. Please allow microphone permissions in your browser.');
      }
    };
    
    checkMic();
  }, []);

  // Function to get Gemini AI response (we'll keep this for future use)
  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Create the prompt with context
      const prompt = `
        ${initialPrompt}
        
        The conversation theme is: ${theme}
        
        User's latest message: "${userMessage}"
        
        Respond naturally as a helpful, encouraging coach. Keep responses relatively brief and conversational.
      `;

      // Get response from Gemini
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm sorry, I'm having trouble processing that right now. Could you try again?";
    }
  };

  // Set up event listeners for Vapi
  useEffect(() => {
    // Type-safe event handlers
    const handleCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };
    
    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };
    
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };
    
    const handleMessage = async (message: any) => {
      console.log('Message received:', message);
    };
    
    const handleError = (error: any) => {
      console.error('Vapi error:', error);
      // Improved error handling for empty error objects
      let errorMessage = 'Voice session error';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage += `: ${error.message}`;
        } else if (Object.keys(error).length === 0) {
          errorMessage += ': Connection failed. Please check your microphone permissions.';
        } else {
          // Handle response-like errors
          const err = error.error || error;
          if (err && err.message) {
            errorMessage += `: ${err.message}`;
          }
        }
      }
      
      setError(errorMessage);
      setCallStatus(CallStatus.INACTIVE);
    };

    // Add event listeners with proper error handling
    try {
      if (vapi) {
        vapi.on("call-start", handleCallStart);
        vapi.on("message", handleMessage);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("error", handleError);
      } else {
        console.error('Vapi instance not available');
        setError('Voice service not available. Please try again later.');
      }
    } catch (err) {
      console.error('Error setting up Vapi listeners:', err);
      setError('Failed to initialize voice service');
    }

    // Clean up event listeners with proper error handling
    return () => {
      try {
        if (vapi) {
          vapi.off("call-start", handleCallStart);
          vapi.off("message", handleMessage);
          vapi.off("speech-start", handleSpeechStart);
          vapi.off("speech-end", handleSpeechEnd);
          vapi.off("error", handleError);
        }
      } catch (err) {
        console.error('Error removing Vapi listeners:', err);
      }
    };
  }, []);

  // Start voice session
  const startSession = async () => {
    try {
      // First check microphone access
      const hasMicAccess = await checkMicrophoneSupport();
      if (!hasMicAccess) {
        throw new Error('Microphone access denied. Please allow microphone permissions in your browser settings and try again.');
      }
      
      setError(null);
      setCallStatus(CallStatus.CONNECTING);
      
      // Initialize welcome message
      const welcomeMessage = "Hello! I'm your SpeakWell coach. How are you doing today? What would you like to talk about?";
      
      console.log("Starting Vapi call...");
      
      // Create an assistant configuration directly
      try {
        await vapi.start({
          firstMessage: welcomeMessage,
          voice: {
            provider: "vapi" as const,
            voiceId: "Paige" as const
          },
          model: {
            provider: "openai" as const,
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system" as const,
                content: `You are an English language coach helping a student practice conversation skills. 
                The practice theme is: ${theme}.
                
                ${initialPrompt}
                
                Be friendly, encouraging, and provide gentle corrections when appropriate. 
                Keep your responses conversational and brief.`
              }
            ]
          }
        });
        console.log("Vapi call started successfully");
      } catch (vapiErr) {
        console.error("Error starting vapi:", vapiErr);
        throw vapiErr;
      }
      
    } catch (err: any) {
      console.error('Failed to start session:', err);
      let errorMessage = 'Failed to start voice session';
      
      if (err) {
        if (typeof err === 'string') {
          errorMessage += `: ${err}`;
        } else if (err.message) {
          errorMessage += `: ${err.message}`;
        } else if (err.error && err.error.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err.toString && err.toString() !== '[object Object]') {
          errorMessage += `: ${err.toString()}`;
        } else {
          errorMessage += '. Please check your microphone permissions and internet connection.';
        }
      }
      
      setError(errorMessage);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // End voice session
  const endSession = () => {
    try {
      if (vapi) {
        vapi.stop();
        setCallStatus(CallStatus.FINISHED);
        
        if (onSessionEnd) {
          onSessionEnd([]);
        }
      }
    } catch (err) {
      console.error('Error stopping session:', err);
      setError('Failed to end session properly');
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // Determine if call is active
  const isCallActive = callStatus === CallStatus.ACTIVE;
  const isConnecting = callStatus === CallStatus.CONNECTING;

  return (
    <div className="flex flex-col w-full items-center justify-center">
      {/* Status Cards - Similar to intro screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 w-full max-w-4xl mx-auto">
        {/* AI Coach Card */}
        <div className={`bg-gradient-to-br from-indigo-900/40 to-black/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl border ${isSpeaking ? 'border-green-600/40 shadow-lg shadow-green-900/20' : 'border-indigo-800/40 shadow-lg shadow-indigo-900/10'} transform transition-all duration-300`}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 relative">
              {callStatus === CallStatus.CONNECTING && (
                <>
                  <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-yellow-500/30 animate-pulse"></div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <FaRegCircle className="text-yellow-300 animate-pulse text-xl md:text-2xl" />
                  </div>
                </>
              )}
              
              {callStatus === CallStatus.ACTIVE && (
                <>
                  <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'bg-green-500/20 animate-ping' : 'bg-indigo-500/20'}`}></div>
                  <div className={`absolute inset-2 rounded-full ${isSpeaking ? 'bg-green-500/30 animate-pulse' : 'bg-indigo-500/30'}`}></div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <FaRobot className={`${isSpeaking ? 'text-green-300' : 'text-indigo-400'} text-xl md:text-2xl`} />
                  </div>
                </>
              )}
              
              {(callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) && (
                <div className="bg-indigo-900/50 rounded-full flex items-center justify-center w-full h-full shadow-lg shadow-indigo-900/20">
                  <FaRobot className="text-indigo-400 text-xl md:text-2xl" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">AI Coach</h3>
              <p className={`text-sm md:text-base ${callStatus === CallStatus.CONNECTING ? 'text-yellow-300' : isSpeaking ? 'text-green-300' : 'text-gray-300'}`}>
                {callStatus === CallStatus.CONNECTING && "Connecting..."}
                {callStatus === CallStatus.ACTIVE && (isSpeaking ? "Speaking" : "Listening")}
                {callStatus === CallStatus.INACTIVE && "Ready to start"}
                {callStatus === CallStatus.FINISHED && "Session ended"}
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm md:text-base">
            {callStatus === CallStatus.ACTIVE ? (
              isSpeaking ? 
                "Your AI coach is speaking. Listen carefully to their guidance and feedback." :
                "Your AI coach is listening. Speak clearly to practice your English skills."
            ) : callStatus === CallStatus.CONNECTING ? (
              "Establishing connection with your AI speaking coach..."
            ) : callStatus === CallStatus.FINISHED ? (
              "Your practice session has ended. You can start a new session when you're ready."
            ) : (
              "Your AI speaking partner will guide the conversation, provide feedback, and help you build confidence."
            )}
          </p>
        </div>

        {/* User Card - Hidden on mobile when active */}
        <div className={`hidden md:block bg-gradient-to-br from-purple-900/40 to-black/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl border ${!isSpeaking && callStatus === CallStatus.ACTIVE ? 'border-blue-600/40 shadow-lg shadow-blue-900/20' : 'border-purple-800/40 shadow-lg shadow-purple-900/10'} transform transition-all duration-300`}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 relative">
              {callStatus === CallStatus.ACTIVE && (
                <>
                  <div className={`absolute inset-0 rounded-full ${!isSpeaking ? 'bg-blue-500/20 animate-ping' : 'bg-purple-500/20'}`}></div>
                  <div className={`absolute inset-2 rounded-full ${!isSpeaking ? 'bg-blue-500/30 animate-pulse' : 'bg-purple-500/30'}`}></div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <FaHeadset className={`${!isSpeaking ? 'text-blue-300' : 'text-purple-400'} text-xl md:text-2xl`} />
                  </div>
                </>
              )}
              
              {(callStatus !== CallStatus.ACTIVE) && (
                <div className="bg-purple-900/50 rounded-full flex items-center justify-center w-full h-full shadow-lg shadow-purple-900/20">
                  <FaHeadset className="text-purple-400 text-xl md:text-2xl" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">You</h3>
              <p className={`text-sm md:text-base ${!isSpeaking && callStatus === CallStatus.ACTIVE ? 'text-blue-300' : 'text-gray-300'}`}>
                {callStatus === CallStatus.ACTIVE && (!isSpeaking ? "Your turn to speak" : "Listening")}
                {callStatus !== CallStatus.ACTIVE && "Practice partner"}
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm md:text-base">
            {callStatus === CallStatus.ACTIVE ? (
              !isSpeaking ? 
                "It's your turn to speak. Practice your English in this safe, judgment-free environment." :
                "Listen to your AI coach. They're providing guidance to help improve your skills."
            ) : (
              "Practice your speaking skills, make mistakes, learn, and improve at your own pace."
            )}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-8">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center">
              {isConnecting ? (
                <>
                  <FaRegCircle className="animate-pulse mr-2" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <FaMicrophone className="mr-2" />
                  <span>Start Session</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ) : (
          <button
            onClick={endSession}
            className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              <FaStop className="mr-2" />
              <span>End Session</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-gradient-to-r from-red-900/40 to-black/80 backdrop-blur-lg rounded-xl border border-red-800/50 p-5 shadow-lg max-w-4xl w-full mx-auto">
          <p className="text-red-200 text-base">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VapiGeminiSession; 