"use client";

import React from "react";
import Link from "next/link";
import { FiMapPin, FiPhoneCall } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-udemy-black text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top Grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo & About */}
          <div>
            <Link href="/" className="text-xl font-black text-white-100">
              LMS Platform
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Discover a world of knowledge and opportunities with our online education platform. Pursue a new career.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white-100">Contact</h4>
            <div className="flex items-start gap-3 mb-3">
              <FiMapPin className="text-udemy-purple mt-1" />
              <span className="text-sm leading-relaxed">
                123 Example Street,<br />
                Your City, Your Country
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhoneCall className="text-udemy-purple" />
              <a href="tel:+15550100100" className="hover:text-white-100 transition text-sm">
                +1 555 010 0100
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white-100">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white-100 transition">Home</Link>
              </li>
              <li>
                <Link href="/aboutus" className="hover:text-white-100 transition">About Us</Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-white-100 transition">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} LMS Platform. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="hover:text-white-100 transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white-100 transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
