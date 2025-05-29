'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, ChevronRight, MessageCircleHeart } from 'lucide-react';

const themes = [
  "Travel", "Technology", "Food", "Movies", "Books", "Health", "Fitness", "Relationships", "Career", "Education",
  "Science", "History", "Music", "Art", "Sports", "Weather", "Fashion", "Finance", "Culture", "Hobbies",
  "Pets", "Environment", "Gaming", "Social Media", "Dreams", "Festivals", "Childhood", "Future", "Shopping", "Habits",
  "Daily Routine", "Public Transport", "Work Life", "Stress", "Motivation", "Friendship", "Inspiration", "Success", "Failure", "Fear",
  "Goals", "Family", "Time Travel", "Aliens", "Space", "Virtual Reality", "Nature", "Volunteering", "Happiness", "Regrets"
];

export default function Conversations() {
  const router = useRouter();

  const handleThemeClick = (theme: string) => {
    const sessionId = uuidv4();
    router.push(`/session/${sessionId}?theme=${encodeURIComponent(theme)}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
            Themed Conversations
          </h1>
          <p className="text-xl text-gray-300">
            Choose a theme and start speaking with the AI
          </p>
        </div>

        {/* Themes Section */}
        <section className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">
          <h2 className="text-xl font-bold flex items-center text-gray-100 mb-6">
            <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
            Select a Theme
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeClick(theme)}
                className="flex items-center justify-between w-full px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700 text-gray-200 hover:bg-zinc-700 hover:text-white transition-all"
              >
                <span className="truncate">{theme}</span>
                <ChevronRight className="h-4 w-4 ml-2 text-blue-400" />
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl border border-purple-800/40 p-8 shadow-lg shadow-purple-900/10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">Want a free conversation?</h2>
              <p className="text-gray-300 mb-4 max-w-xl">
                Pick any theme and dive into an interactive English chat session powered by AI.
              </p>
              <Link
                href="/home"
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-xl hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Start New Session
                <MessageCircleHeart className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
