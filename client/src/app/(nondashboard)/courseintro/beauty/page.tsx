"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FiBook,
  FiBookOpen,
  FiBox,
  FiClock,
  FiShoppingCart,
  FiWifi,
} from "react-icons/fi";
import ScrollToTop from "@/components/scroll-top";
import { SignedOut } from "@clerk/nextjs";

interface CoursesData {
  id: number;
  image: string;
  tag1: string;
  tag2: string;
  amount: number;
  lessons: number;
  students: number;
  title: string;
  desc: string;
  user: string;
  name: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Image
          src="/SASDI_WD.png"
          alt="SASDI Logo"
          width={200}
          height={200}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <>
      <section className="relative pt-32 md:pb-24 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Existing content */}
          <div className="md:flex justify-center">
            <div className="lg:w-3/5 text-center md:text-left">
              <h3 className="text-4xl font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                Elegance of Beauty Through Pure Ayurveda
              </h3>
              <div className="flex items-center justify-center md:justify-start mt-4">
                <Image
                  src="/SASDI_WD.png"
                  width={36}
                  height={36}
                  className="rounded-full shadow-md dark:shadow-gray-800"
                  alt="SASDI Logo"
                />
                <Link
                  href=""
                  className="font-semibold block ms-3 text-green-700 dark:text-green-400 hover:underline"
                >
                  by Sanathana Ayurveda Skill Development Institute
                </Link>
              </div>
            </div>
          </div>

          <div className="md:flex justify-center text-center mt-8">
            <div className="lg:w-4/5">
              <ul className="tracking-wide mb-0 inline-block space-x-6">
                <li className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <FiClock className="text-lg" />
                  <span>4 Months</span>
                </li>

                <li className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <FiWifi className="text-lg" />
                  <span>BAMS, BSMS, BUMS</span>
                </li>

                <li className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <FiBook className="text-lg" />
                  <span>60 Lessons</span>
                </li>

                <SignedOut>
                  <li className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <FiShoppingCart className="text-lg" />
                    <Link 
                    //href="/signin?isFirstTime=true"
                    href="/"
                     className="hover:underline">
                      Enroll Now
                    </Link>
                  </li>
                </SignedOut>
              </ul>
            </div>
          </div>

          <div className="md:flex justify-center mt-8">
            <div className="lg:w-full">
              <div className="relative rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
                <Image
                  src="/beauty_course.jpeg"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  alt="Ayurveda Course"
                  className="transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="md:flex justify-center mt-12">
            <div className="lg:w-full">
              <h5 className="text-3xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
                Overview
              </h5>

              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                Elegance of Beauty Through Pure Ayurveda is a specialized certificate course crafted to transform learners into confident, qualified Ayurvedic beauty physicians—far beyond the scope of conventional salon training.
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                Merging the depth of Ayurvedic diagnostics with modern advancements in beauty care, this course offers a 100% natural, medicine-based approach to treating skin, hair, and aesthetic concerns. Trainees are empowered with clinical insight, hands-on experience with high-tech equipment, and the ability to offer personalized, root-cause solutions.
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                Graduates emerge with the skill and confidence to challenge global beauty standards—delivering elegant, authentic Ayurvedic results backed by scientific precision and ethical practice.
              </p>
            </div>
          </div>

          <h3 className="text-black font-bold">For a detailed syllabus and curriculum please refere the below PDFs</h3>

          <div className="mt-8">
  <a
    href="/curriculum_beauty.pdf"
    download
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
  >
    📄 Download Curriculum PDF
  </a>
</div>


<div className="mt-8">
  <a
    href="/syllabus_beauty.pdf"
    download
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
  >
    📄 Download Syllabus PDF
  </a>
</div>

          {/* Curriculum Section */}
          <div className="md:flex justify-center mt-16">
  <div className="lg:w-full">
    <h5 className="text-3xl font-semibold mb-8 text-slate-700 dark:text-slate-200">
      Curriculum
    </h5>

    <div className="text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed text-lg">
      <h6 className="text-xl font-semibold mb-4">
        Course name: Elegance of Beauty Through Pure Ayurveda
      </h6>

      <ol className="list-decimal list-inside space-y-6">
        <li>
          <strong>Introduction</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-5">
            <li>Discussion on comparison of beauty treatments with the basic concepts of Ayurveda by Dr. Pradeep</li>
            <li>Ayurveda fundamentals</li>
            <li>Discussion of all the requirements, including the basic instruments and accessories required to start an Ayurvedic beauty clinic</li>
            <li>Correlation with beauty culture</li>
            <li>Pathological aspect</li>
          </ul>
        </li>

        <li>
          <strong>Skin care</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-5">
            <li>Anatomy of skin (modern and Ayurveda)</li>
            <li>Functions of skin</li>
            <li>Types of skin (modern and Ayurveda)</li>
            <li>Identification of Skin disease conditions</li>
            <li>Causes for skin diseases</li>
            <li>Clinical features of the skin diseases</li>
            <li>How to design internal and external treatment protocol</li>
            <li>Special factors regarding treatment</li>
            <li>Cleaning</li>
            <li>Oileation</li>
            <li>Sudation</li>
            <li>Cleansing and scrubbing</li>
            <li>Face mask</li>
            <li>Toning</li>
            <li>Moisturizing</li>
            <li>Hydration</li>
            <li>Usage of Panchakarma in skin diseases</li>
            <li>Types of Raktha Mokshana</li>
            <li>Nasya</li>
            <li>Vamana</li>
            <li>Virechana</li>
            <li>Vasthi</li>
            <li>Agni karma for beauty care</li>
            <li>Kshara karma for beauty care</li>
            <li>Practical section:</li>
            <ul className="ml-5 list-disc space-y-1">
              <li>Pre-procedures: Marma point massaging, Sneha - Sweda procedures</li>
              <li>Main procedures:
                <ul className="ml-5 list-disc space-y-1">
                  <li>Facial treatments for pigmentation</li>
                  <li>Under eye discolorations</li>
                  <li>Lip discolorations</li>
                  <li>Acne/allergic conditions</li>
                  <li>Enhancing glow</li>
                  <li>Rejuvenation (wrinkles)</li>
                </ul>
              </li>
              <li>Post procedures: Diet and regimen</li>
            </ul>
            <li>Acupuncture treatments related to the face diseases</li>
            <li>Modern equipment and tools for facial treatments (5-in-1 machine):
              <ul className="ml-5 list-disc space-y-1">
                <li>Galvanic treatment for skin diseases</li>
                <li>High frequency treatment</li>
                <li>Cauterization for warts, pigmentation and other conditions</li>
                <li>Vacuum and spray machine</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Hair care</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-5">
            <li>Anatomy and physiology of hair (modern and Ayurveda)</li>
            <li>Types of hair</li>
            <li>Identification of diseases related with hair</li>
            <li>Types of alopecia, hair discolorations, scalp diseases</li>
            <li>Causes of hair diseases</li>
            <li>Pathophysiology of hair and scalp</li>
            <li>Clinical features related to head and the hair diseases</li>
            <li>Internal and external treatments methods</li>
            <li>Practical approach of Panchakarma for hair diseases</li>
            <li>Types of Raktha Mokshana</li>
            <li>Nasya</li>
            <li>Vamana</li>
            <li>Virechana</li>
            <li>Agni karma</li>
            <li>Murdhaneeya Thaila Krama and other specific hair treatments</li>
            <li>Food and regimen for hair</li>
            <li>Practical section (Hair treatment with hair packs):</li>
            <ul className="ml-5 list-disc space-y-1">
              <li>Pre-procedures: Head massaging, Marma massaging, Sneha and Sweda karma</li>
              <li>Main procedures:
                <ul className="ml-5 list-disc space-y-1">
                  <li>Akala Palithya</li>
                  <li>Kalithya</li>
                  <li>Indralupta</li>
                  <li>Pothukabara and other scalp diseases</li>
                  <li>Head lice treatment</li>
                </ul>
              </li>
              <li>Post procedures: Diet and lifestyle changes</li>
            </ul>
            <li>Acupuncture for hair diseases</li>
          </ul>
        </li>

        <li>
          <strong>Nail care</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-5">
            <li>Anatomy and physiology of nail (modern and Ayurveda)</li>
            <li>Identification of diseases related to the nail and their causes</li>
            <li>Clinical features related to nail diseases</li>
            <li>Internal and external treatment methods</li>
            <li>Food for healthy nail</li>
            <li>Usage of Panchakarma in nail diseases</li>
            <li>Raktha Mokshana</li>
            <li>Nasya</li>
            <li>Vamana</li>
            <li>Virechana</li>
            <li>Agni karma</li>
          </ul>
        </li>
        <li><strong>Ore care</strong>
    <ul className="list-disc list-inside mt-2 space-y-1 ml-5">
      <li>Anatomy of mouth</li>
      <li>Oral diseases</li>
      <li>Causes for oral disease</li>
      <li>Treatments for oral diseases</li>
      <li>Food for oro care</li>
    </ul>
  </li>
  <li><strong>PCOD (by Dr. Pradeep)</strong></li>
  <li><strong>Thyroid impairment (by Dr. Pradeep)</strong></li>
  <li><strong>Vatha raktha kushta (by Dr. Pradeep)</strong></li>
  <li><strong>Modern equipment’s</strong></li>
      </ol>
    </div>
  </div>
</div>

        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
