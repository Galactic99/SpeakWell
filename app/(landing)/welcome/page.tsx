"use client";

import React from "react";
import Link from "next/link";
import {
  FaCheck,
  FaArrowRight,
  FaHeadphones,
  FaMicrophone,
  FaChartLine,
  FaLayerGroup,
  FaComments,
} from "react-icons/fa";
import Squares from "@/components/Backgrounds/Squares/Squares";

const WelcomePage = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <Squares
            speed={0.08}
            squareSize={140}
            direction="left"
            borderColor="rgba(139, 92, 246, 0.2)" 
            hoverFillColor="rgba(139, 92, 246, 0.3)"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/70 to-black/80 z-[2]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-600/30 to-pink-600/10 blur-3xl rounded-full z-[2]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-[3]">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl mt-8 md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              Welcome to SpeakWell
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
              Your AI-powered English speaking coach. Practice, improve, and
              master your English speaking skills with real-time feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center"
              >
                Get Started Free <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/features"
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-8 py-3 rounded-lg font-medium text-lg"
              >
                Explore Features
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> No credit card
                required
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Free 7-day trial
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Cancel anytime
              </div>
            </div>
          </div>

          {/* Mock UI Preview */}
          <div className="mt-16 relative">
            <div className="w-full max-w-5xl mx-auto bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-zinc-400 text-sm">
                  SpeakWell - Practice Session
                </div>
                <div className="w-16"></div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col h-64 bg-zinc-950 rounded-lg p-4">
                    <div className="text-lg font-medium mb-3 text-white">
                      Speaking Practice
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                        <FaMicrophone size={36} />
                      </div>
                    </div>
                    <div className="text-center text-gray-400 mt-4">
                      Tap to start speaking
                    </div>
                  </div>
                  <div className="flex flex-col h-64 bg-zinc-950 rounded-lg p-4">
                    <div className="text-lg font-medium mb-3 text-white">
                      Feedback & Analysis
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                      <div className="w-full bg-zinc-900 rounded-lg p-3">
                        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Pronunciation</span>
                          <span>85%</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-lg p-3">
                        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full w-3/4"></div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Fluency</span>
                          <span>75%</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-lg p-3">
                        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full w-4/5"></div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Grammar</span>
                          <span>80%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full z-0"></div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-16 bg-zinc-950 relative overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <Squares
            speed={0.15}
            squareSize={100}
            direction="right"
            borderColor="rgba(139, 92, 246, 0.3)" 
            hoverFillColor="rgba(139, 92, 246, 0.4)"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950/80 z-[2]"></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-[3]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SpeakWell?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform offers comprehensive tools to improve your
              English speaking skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <FaHeadphones className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Feedback</h3>
              <p className="text-gray-300">
                Receive instant, detailed feedback on your pronunciation,
                grammar, and fluency.
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <FaMicrophone className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Practice Scenarios</h3>
              <p className="text-gray-300">
                Practice with real-life scenarios, from casual conversations to
                professional presentations.
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <FaChartLine className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
              <p className="text-gray-300">
                Track your improvement over time with detailed analytics and
                progress reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <Squares
            speed={0.1}
            squareSize={60}
            direction="diagonal"
            borderColor="rgba(219, 39, 119, 0.3)" 
            hoverFillColor="rgba(219, 39, 119, 0.4)"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/60 to-black/70 z-[2]"></div>
        <div className="absolute top-40 left-0 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full z-[2]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-[3]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Key Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore the comprehensive tools SpeakWell offers to enhance your
              English speaking abilities
            </p>
          </div>

          {/* Container for sticky features */}
          <div className="relative h-[2000px] z-[4]">
            {/* Progress Tracking Feature */}
            <div className="sticky top-0 h-screen flex items-center py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full bg-black/70 backdrop-blur-md p-8 rounded-2xl border border-zinc-700/60">
                <div className="order-2 md:order-1">
                  <div className="inline-block px-4 py-2 bg-purple-900/40 rounded-full text-purple-300 font-medium text-sm mb-4">
                    Smart Analytics
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-6">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    Track your improvement over time with our comprehensive
                    analytics system. Identify your strengths and areas that
                    need improvement.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Detailed performance metrics for pronunciation, grammar,
                        fluency, and vocabulary
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Weekly and monthly progress reports to track your
                        improvement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Personalized recommendations based on your performance
                        data
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Achievement badges and milestones to keep you motivated
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
                  <div className="p-4 bg-zinc-950 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-medium">Your Progress</h4>
                      <div className="text-sm text-purple-400">
                        Last 30 Days
                      </div>
                    </div>
                    <div className="h-48 w-full bg-zinc-900 rounded-lg mb-6 relative overflow-hidden">
                      {/* Mocked chart data */}
                      <div className="absolute bottom-0 left-0 right-0 h-full w-full">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 border-t border-purple-500 border-dashed"></div>
                        <div className="absolute bottom-[30%] left-0 right-0 border-t border-zinc-700 border-dashed"></div>
                        <div className="absolute bottom-[60%] left-0 right-0 border-t border-zinc-700 border-dashed"></div>
                        <div className="absolute bottom-[90%] left-0 right-0 border-t border-zinc-700 border-dashed"></div>

                        <svg
                          viewBox="0 0 100 40"
                          className="absolute bottom-0 left-0 w-full h-full"
                        >
                          <path
                            d="M0,40 L5,35 L10,36 L15,30 L20,32 L25,28 L30,25 L35,26 L40,22 L45,20 L50,18 L55,16 L60,14 L65,15 L70,13 L75,10 L80,12 L85,9 L90,7 L95,5 L100,3"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-950 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Pronunciation
                        </div>
                        <div className="flex items-end">
                          <span className="text-xl font-bold text-white">
                            78%
                          </span>
                          <span className="text-xs text-green-500 ml-2">
                            +12%
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Fluency
                        </div>
                        <div className="flex items-end">
                          <span className="text-xl font-bold text-white">
                            65%
                          </span>
                          <span className="text-xs text-green-500 ml-2">
                            +8%
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Vocabulary
                        </div>
                        <div className="flex items-end">
                          <span className="text-xl font-bold text-white">
                            82%
                          </span>
                          <span className="text-xs text-green-500 ml-2">
                            +15%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Difficulty Levels Feature */}
            <div className="sticky top-0 h-screen flex items-center py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full bg-black/70 backdrop-blur-md p-8 rounded-2xl border border-zinc-700/60">
                <div className="order-2">
                  <div className="inline-block px-4 py-2 bg-purple-900/40 rounded-full text-purple-300 font-medium text-sm mb-4">
                    Adaptive Learning
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-6">
                    Difficulty Levels
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    Start at your comfort level and progressively challenge
                    yourself with our adaptive difficulty system.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Five difficulty levels from Beginner to Advanced to
                        Professional
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Automatic skill assessment to recommend the right level
                        for you
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Progressive challenges that adapt to your improving
                        skills
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Targeted exercises for areas that need improvement
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl overflow-hidden">
                  <div className="flex flex-col space-y-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 p-4 rounded-lg border border-green-500/30 relative">
                      <div className="absolute top-2 right-2 bg-green-500/30 text-green-300 text-xs px-2 py-1 rounded-full">
                        Beginner
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2 mt-4">
                        Basic Conversations
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        Simple everyday phrases and introductory conversations
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        </div>
                        <span className="text-green-400 text-xs">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 p-4 rounded-lg border border-blue-500/30 relative">
                      <div className="absolute top-2 right-2 bg-blue-500/30 text-blue-300 text-xs px-2 py-1 rounded-full">
                        Intermediate
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2 mt-4">
                        Daily Interactions
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        More complex conversations for work and social settings
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        </div>
                        <span className="text-blue-400 text-xs">
                          In Progress
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 relative opacity-80">
                      <div className="absolute top-2 right-2 bg-zinc-700 text-zinc-400 text-xs px-2 py-1 rounded-full">
                        Advanced
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2 mt-4">
                        Professional Communication
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        Complex topics for business, academic, and professional
                        contexts
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        </div>
                        <span className="text-zinc-500 text-xs">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Themed Conversations Feature */}
            <div className="sticky top-0 h-screen flex items-center py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full bg-black/70 backdrop-blur-md p-8 rounded-2xl border border-zinc-700/60">
                <div className="order-2 md:order-1">
                  <div className="inline-block px-4 py-2 bg-purple-900/40 rounded-full text-purple-300 font-medium text-sm mb-4">
                    Real-world Practice
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-6">
                    Themed Conversations
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    Practice English in realistic scenarios with our diverse
                    collection of themed conversations.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Over 50 different conversation themes, from casual to
                        professional
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Industry-specific vocabulary for business, healthcare,
                        technology, and more
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Cultural context explanations to help you navigate
                        social situations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">
                        Role-playing scenarios with our AI to practice real
                        conversations
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl overflow-hidden">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-900/20 to-transparent p-4 rounded-lg border border-purple-900/30 flex flex-col justify-between h-40">
                      <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                        <FaComments className="text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Travel Conversations
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          Airport, hotel, directions & sightseeing
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-900/20 to-transparent p-4 rounded-lg border border-pink-900/30 flex flex-col justify-between h-40">
                      <div className="w-10 h-10 bg-pink-900/30 rounded-lg flex items-center justify-center mb-2">
                        <FaComments className="text-pink-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Business Meetings
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          Presentations, negotiations & job interviews
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-4 rounded-lg border border-blue-900/30 flex flex-col justify-between h-40">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                        <FaComments className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Social Events
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          Parties, networking & small talk
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/20 to-transparent p-4 rounded-lg border border-green-900/30 flex flex-col justify-between h-40">
                      <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
                        <FaComments className="text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Daily Life</h4>
                        <p className="text-gray-400 text-xs mt-1">
                          Shopping, dining & casual conversations
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 bg-zinc-800 p-4 rounded-lg text-center">
                      <span className="text-gray-400 text-sm">
                        + 46 more conversation themes available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <Squares
            speed={0.1}
            squareSize={80}
            direction="left"
            borderColor="rgba(139, 92, 246, 0.2)" 
            hoverFillColor="rgba(139, 92, 246, 0.3)"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-[2]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/20 blur-3xl rounded-full z-[2]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-[3]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works best for your English learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:border-purple-500/50">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <p className="text-gray-400 mb-6">Perfect for beginners</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">10 practice sessions / month</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Basic pronunciation feedback</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">5 conversation themes</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Progress tracking</span>
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-purple-900/20 to-black/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden shadow-lg relative z-10 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs px-4 py-1 rounded-bl-lg font-medium">
                Most Popular
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">For serious learners</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Unlimited practice sessions</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Advanced pronunciation & grammar feedback</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">25 conversation themes</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Detailed analytics & reports</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Personalized improvement plan</span>
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:border-purple-500/50">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-gray-400 mb-6">Maximum results</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">All 50+ conversation themes</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">1-on-1 virtual coaching sessions</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Custom conversation scenarios</span>
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400">
              All plans include a 7-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <Squares
            speed={0.12}
            squareSize={90}
            direction="up"
            borderColor="rgba(219, 39, 119, 0.25)" 
            hoverFillColor="rgba(219, 39, 119, 0.35)"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/70 to-black/80 z-[2]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-600/30 to-pink-600/20 blur-3xl rounded-full z-[2]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-[3]">
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-950/90 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-zinc-700 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to improve your English?
                </h2>
                <p className="text-gray-300 mb-4 md:mb-0 max-w-xl">
                  Join thousands of users who have improved their speaking
                  skills with SpeakWell.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-medium text-lg whitespace-nowrap flex items-center"
                >
                  Get Started <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
