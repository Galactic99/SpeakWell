"use client";

import React, { useState } from "react";
import Aurora from "./Backgrounds/Aurora/Aurora";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Orb from "./Backgrounds/Orb/Orb";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left side - hidden on mobile */}
          <div className="col-span-1 hidden md:flex relative flex-col items-center justify-center text-white p-6 md:p-10">
            <div className="absolute inset-0">
              <Aurora
                colorStops={["#8A3FFC", "#C77DFF", "#622EB5"]}
                blend={0.6}
                amplitude={1.0}
                speed={0.5}
              />
            </div>
            <div className="z-10 text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">SpeakWell</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Get Started with Us</h2>
              <p className="mb-10">
                Fill in the details and register your account.
              </p>

              <div className="w-full h-64 relative">
                <Orb
                  hoverIntensity={0.5}
                  rotateOnHover={true}
                  hue={0}
                  forceHoverState={false}
                />
              </div>
            </div>
          </div>

          {/* Right side - full width on mobile */}
          <div className="col-span-1 md:col-span-1 bg-black p-6 md:p-10 flex flex-col justify-center">
            {/* Mobile-only logo and header */}
            <div className="flex flex-col items-center mb-8 md:hidden">
              <span className="text-2xl font-bold text-white mb-2">SpeakWell</span>
              <h2 className="text-3xl text-white font-bold">Create Account</h2>
            </div>
            
            {/* Desktop-only header */}
            <div className="hidden md:block">
              <h2 className="text-3xl text-white font-bold mb-2">
                Sign Up Account
              </h2>
              <p className="text-gray-400 mb-8">
                Enter your personal data to create your account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-white rounded-lg p-3 transition hover:bg-gray-900">
                <FaGoogle className="text-lg" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-white rounded-lg p-3 transition hover:bg-gray-900">
                <FaGithub className="text-lg" />
                <span>Github</span>
              </button>
            </div>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-white mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="eg. John"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-white mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="eg. Francisco"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="eg. johnfrans@gmail.com"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Must be at least 8 characters.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-medium rounded-lg p-3 transition hover:bg-gray-200"
              >
                Sign Up
              </button>
            </form>

            <p className="text-gray-400 text-center mt-6">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-white underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
