"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiPhoneCall } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-700 text-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top Grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo & About */}
          <div>
            <Link href="/">
              <Image src="/SASDI_WD.png" alt="SASDI Logo" width={140} height={30} />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Discover a world of knowledge and opportunities with our online education platform. Pursue a new career.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="flex items-start gap-3 mb-3">
              <FiMapPin className="text-green-400 mt-1" />
              <span className="text-sm leading-relaxed">
                300/3, Puwakgadeniya Road,<br />
                Hokandara 10230, Sri Lanka
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhoneCall className="text-green-400" />
              <a href="tel:+94764121571" className="hover:text-white transition text-sm">
                +94 76 412 1571
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/courseintro/ayurvedic" className="hover:text-white transition">The Certificate in Proficiency of Ayurveda</Link>
              </li>
              <li>
                <Link href="/courseintro/beauty" className="hover:text-white transition">Elegance of Beauty Through Pure Ayurveda</Link>
              </li>
              <li>
                <Link href="/aboutus" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-white transition">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} SASDI. Ayurvedic & Beauty Skill Development Courses.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
