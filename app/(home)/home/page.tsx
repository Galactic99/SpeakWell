"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPlay, 
  FaChartLine, 
  FaComments, 
  FaCheckSquare, 
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUserCircle
} from 'react-icons/fa';
import { getCurrentUser, logout } from '@/lib/actions/auth.action';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [user, setUser] = useState<{name: string, email: string, id: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const startNewSession = () => {
    const sessionId = uuidv4();
    router.push(`/session/${sessionId}`);
  };

  // Display name or "Guest" if not loaded yet
  const displayName = isLoading ? "..." : (user?.name || "Guest");
  const email = user?.email || "guest@example.com";

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Logo and User Menu */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <span className="text-purple-500 font-bold text-2xl">SpeakWell</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-zinc-800/60 hover:bg-zinc-700/70 rounded-full px-4 py-2 transition-colors"
            >
              <FaUser className="text-gray-400" />
              <span className="text-gray-300 font-medium">Account</span>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg z-10 overflow-hidden backdrop-blur-sm">
                <div className="p-3 border-b border-zinc-700 bg-zinc-900/70">
                  <div className="flex items-center space-x-3">
                    <FaUserCircle className="text-purple-400 text-2xl" />
                    <div>
                      <div className="font-medium text-white">{displayName}</div>
                      <div className="text-xs text-gray-400">{email}</div>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <FaUserCircle className="mr-3" />
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <FaCog className="mr-3" />
                    Settings
                  </Link>
                  <div className="border-t border-zinc-700 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-400 hover:bg-zinc-700 hover:text-red-300 w-full text-left"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Welcome Message */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
            Welcome, {displayName}
          </h1>
          <p className="text-xl text-gray-300">
            Enhance your English, One Step at a Time
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start a Session Card */}
            <div 
              onClick={startNewSession}
              className="bg-gradient-to-br from-purple-900/30 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-purple-800/40 hover:border-purple-500/70 transition-all hover:shadow-lg hover:shadow-purple-900/20 flex flex-col h-64 cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                <FaPlay className="text-purple-400 text-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3">Start a Session</h3>
              <p className="text-gray-400 text-sm flex-grow">
                "Your journey to fluent English starts here"
              </p>
              <div className="mt-4 text-purple-400 font-medium text-sm flex items-center">
                Begin practice <FaPlay className="ml-2 text-xs" />
              </div>
            </div>

            {/* View Progress Card */}
            <Link 
              href="/progress" 
              className="bg-gradient-to-br from-blue-900/30 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-blue-800/40 hover:border-blue-500/70 transition-all hover:shadow-lg hover:shadow-blue-900/20 flex flex-col h-64"
            >
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="text-blue-400 text-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3">View Progress</h3>
              <p className="text-gray-400 text-sm flex-grow">
                "See how far you've come"
              </p>
              <div className="mt-4 text-blue-400 font-medium text-sm flex items-center">
                Check stats <FaChartLine className="ml-2 text-xs" />
              </div>
            </Link>

            {/* Themed Conversations Card */}
            <Link 
              href="/conversations" 
              className="bg-gradient-to-br from-pink-900/30 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-pink-800/40 hover:border-pink-500/70 transition-all hover:shadow-lg hover:shadow-pink-900/20 flex flex-col h-64"
            >
              <div className="w-12 h-12 bg-pink-900/50 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-pink-400 text-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3">Themed Conversations</h3>
              <p className="text-gray-400 text-sm flex-grow">
                "Let's explore various topics"
              </p>
              <div className="mt-4 text-pink-400 font-medium text-sm flex items-center">
                Browse themes <FaComments className="ml-2 text-xs" />
              </div>
            </Link>

            {/* Feedback Card */}
            <Link 
              href="/home/feedbacks" 
              className="bg-gradient-to-br from-green-900/30 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-green-800/40 hover:border-green-500/70 transition-all hover:shadow-lg hover:shadow-green-900/20 flex flex-col h-64"
            >
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                <FaCheckSquare className="text-green-400 text-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3">Feedback</h3>
              <p className="text-gray-400 text-sm flex-grow">
                "Displays feedback on the criteria (pronunciation, grammar, fluency)"
              </p>
              <div className="mt-4 text-green-400 font-medium text-sm flex items-center">
                View feedback <FaCheckSquare className="ml-2 text-xs" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity - Optional section */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="text-gray-400 text-center py-8">
            Your recent practice sessions will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
