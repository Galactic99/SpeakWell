"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  currentPath?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isFeedbacksPath = currentPath === "/home/feedbacks";
  const isFeedbackDetailPath = currentPath?.includes("/feedbacks/");
  const isInFeedbackSection = isFeedbacksPath || isFeedbackDetailPath;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links based on path
  const getNavLinks = () => {
    if (isInFeedbackSection) {
      return [
        { href: "/home", label: "Dashboard" },
        { href: "/home/profile", label: "Profile" },
        { href: "/home/settings", label: "Settings" },
      ];
    }
    
    return [
      { href: "/welcome", label: "Home" },
      { href: "/welcome#features", label: "Features" },
      { href: "/welcome#pricing", label: "Pricing" },
    ];
  };

  const navLinks = getNavLinks();
  const logoHref = isInFeedbackSection ? "/home" : "/welcome";

  return (
    <nav className="bg-black/20 backdrop-blur-md text-white py-4 px-6 md:px-10 lg:px-20 w-full fixed top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center space-x-2">
          <span className="text-purple-500 font-bold text-2xl">SpeakWell</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-white hover:text-purple-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          {!isInFeedbackSection && (
            <Link 
              href="/sign-up" 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-purple-300"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md shadow-lg z-50 border-b border-white/10">
          <div className="flex flex-col px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-white hover:text-purple-300 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {!isInFeedbackSection && (
              <Link 
                href="/sign-up" 
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 