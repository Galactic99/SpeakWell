import React from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white py-10 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-purple-500 font-bold text-xl">SpeakWell</h3>
            <p className="text-gray-400 text-sm">
              Improve your English speaking skills with our AI-powered coach.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-purple-500"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-purple-500"
              >
                <FaFacebook size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-400 hover:text-purple-500"
              >
                <FaInstagram size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-400 hover:text-purple-500"
              >
                <FaLinkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-white">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Stay updated with our latest features and releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-gray-500 text-sm"> */}
          <h1
            className="relative z-10 bottom-0 top-20 left-1/2 -translate-x-1/2 text-[12vw] tracking-widest w-full text-center font-extrabold text-transparent 
        whitespace-nowrap pointer-events-none select-none 
        opacity-10 
        bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 
        bg-clip-text 
        [text-shadow:_0_0_2px_rgba(255,255,255,0.2)]"
          >
            SPEAKWELL
          </h1>
        {/* </div> */}
      </div>
    </footer>
  );
};

export default Footer;
