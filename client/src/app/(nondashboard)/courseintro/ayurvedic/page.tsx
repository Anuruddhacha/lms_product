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
          <div className="md:flex justify-center">
            <div className="lg:w-3/5 text-center md:text-left">
              <h3 className="text-4xl font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                The Certificate in Proficiency of Ayurveda
              </h3>
              <div className="flex items-center justify-center md:justify-start mt-4">
                <Image
                  src="/SASDI_WD.png"
                  width={36}
                  height={36}
                  className="rounded-full shadow-md dark:shadow-gray-800"
                  alt="SASDI Logo"
                />
                <Link href="" className="font-semibold block ms-3 text-green-700 dark:text-green-400 hover:underline">
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
                  <span>12 Months</span>
                </li>

                <li className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <FiWifi className="text-lg" />
                  <span>BAMS, BUMS, BSMS</span>
                </li>

                <li className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <FiBook className="text-lg" />
                  <span>160 Lessons</span>
                </li>

                <SignedOut>
                  <li className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <FiShoppingCart className="text-lg" />
                    <Link
                      //href="/signin?isFirstTime=true"
                      href="/"
                      className="hover:underline"
                    >
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
                  src="/ayurveda_course.jpeg"
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
      The Certificate in Proficiency of Ayurveda is a comprehensive program designed to empower aspiring Ayurvedic professionals with a deep understanding of modern medical principles, classical Ayurvedic wisdom, and indigenous traditional practices. This course is meticulously structured to create a new generation of Ayurveda doctors who are not only rooted in ancient healing science but also equipped with a futuristic mindset and critical diagnostic acumen.
    </p>

    <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-lg">
      Graduates of this program will possess the skill, knowledge, and intellectual maturity to evaluate ailments through both traditional and contemporary perspectives. They will be trained to deliver precise diagnoses, prescribe authentic Ayurvedic medicines, and guide patients with sound lifestyle and dietary counsel.
    </p>

    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
      This course aims to cultivate professionals who are scientifically competent, ethically grounded, and socially responsible—ready to respond to the evolving health challenges of our time.
    </p>
  </div>
</div>

<h3 className="text-black font-bold mt-3">For a detailed syllabus and curriculum please refere the below PDFs</h3>

<div className="mt-8">
  <a
    href="/curriculum_ayurveda.pdf"
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
    href="/syllabus_ayurveda.pdf"
    download
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
  >
    📄 Download Syllabus PDF
  </a>
</div>



<div className="md:flex justify-center mt-12">
  <div className="lg:w-full">
  <h5 className="text-3xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
    Curriculum
  </h5>

  <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
    <ol className="list-decimal list-inside space-y-6">
      <li>
        Basic Lessons
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Medical documents</li>
          <li>Doctor-patient relationship</li>
          <li>How to start and provide best healthcare service through Ayurveda private practice</li>
        </ul>
      </li>

      <li>
        Ayurveda Fundamentals
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Panchamaha bùtha and Pancha-panchaka concept with practical aspect</li>
          <li>Tridosha - Tridathu theory</li>
          <li>Sapthadathu</li>
          <li>Srothas & Srotho Dushti</li>
          <li>Agni kosta and Àma</li>
          <li>Saptha padàrtha</li>
          <li>Trimala</li>
          <li>Ojas</li>
        </ul>
      </li>

      <li>
        Therapeutic Fundamentals
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Nidàna mùladarma roga</li>
          <li>Astavida parīksha</li>
          <li>Pancha nidàna</li>
          <li>Shad kriyàkàla</li>
          <li>Chikithsà bēda</li>
          <li>Dashavida parikshà</li>
          <li>Pramàna</li>
          <li>Medical terminology</li>
          <li>Basic Pathology</li>
          <li>Case discussions</li>
        </ul>
      </li>

      <li>
        Nidàna Chikithsà
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Vàtha Ròga</li>
          <li>Snèha karma</li>
          <li>Swèdha karma</li>
          <li>Wasthi Karma</li>
          <li>Keraliya Panchakarma</li>
          <li>Àma vàtha</li>
          <li>Skin diseases</li>
          <li>NCD</li>
          <li>GIT</li>
          <li>Wamana karma</li>
          <li>Wirechana karma</li>
        </ul>
      </li>

      <li>
        Orthopedics
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Practical rules</li>
          <li>Soft tissue injury</li>
          <li>Fractures and dislocations</li>
        </ul>
      </li>

      <li>X Ray</li>

      <li>
        Surgery
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Introduction</li>
          <li>Surgical instruments</li>
          <li>Yanthra</li>
          <li>Vascular diseases</li>
          <li>Agni karma / medical cauterization</li>
          <li>Ulcers / wrana types clinical methods and treatments</li>
          <li>Abscess, lymphadenopathy, cyst</li>
          <li>Rakhtha mòkshana</li>
        </ul>
      </li>

      <li>
        ECG
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Anatomy of the heart</li>
          <li>Histology of cardiac muscle</li>
          <li>Basic physiology of the heart</li>
          <li>Introduction of ECG</li>
        </ul>
      </li>

      <li>
        ENT and Ophthalmology
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Anatomy of ear nose throat</li>
          <li>Physiology of ear nose throat</li>
          <li>Clinical methods</li>
          <li>Allergic and Infective rhinitis - nasal polyps</li>
          <li>Sinusitis</li>
          <li>Cough</li>
          <li>Bronchial Asthma, COPD</li>
          <li>Headache types and pathology</li>
          <li>Ear diseases</li>
          <li>Ophthalmology</li>
          <li>Nasya Karma</li>
          <li>Goiter and thyroid impairment</li>
        </ul>
      </li>

      <li>
        Male Subfertility
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Introduction</li>
          <li>Anatomy and physiology of male genitalia</li>
          <li>Ayurveda view</li>
          <li>Etiology</li>
          <li>Seminal fluid (Shukra)</li>
          <li>Treatment</li>
        </ul>
      </li>

      <li>
        Gynecology
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Ayurveda and modern anatomy and physiology</li>
          <li>Arthawava - Ayurveda view</li>
          <li>Yoni vyapath</li>
          <li>Astavidha Arthava dusti</li>
          <li>Terminology</li>
          <li>Arthawa kshya</li>
          <li>Raktha Pradara / Uterine bleeding</li>
          <li>Uterine fibroid</li>
          <li>Chocolate cyst</li>
          <li>Ovarian cyst</li>
          <li>PID</li>
          <li>Leucorrhea</li>
          <li>Female subfertility</li>
        </ul>
      </li>

      <li>
        Acupuncture
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>History</li>
          <li>Advantages of learning acupuncture</li>
          <li>Types of Oriental medicines</li>
          <li>Fundamentals of acupuncture</li>
          <li>Causes of disharmony</li>
          <li>Diagnostic measures in OM</li>
          <li>Acupuncture & meridian</li>
          <li>Physiological concepts and relationship among the Zang-zy organs</li>
          <li>Acupuncture types</li>
          <li>Practical acupuncture points</li>
          <li>Acupuncture in Systems</li>
        </ul>
      </li>

      <li>Àwarana</li>

      <li>
        Kshudra Roga
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Introduction</li>
          <li>Hair loss</li>
          <li>Premature grey hair</li>
          <li>Indraluptha</li>
          <li>Arunshika</li>
          <li>Kunakaya</li>
          <li>Chippa</li>
          <li>Kadara</li>
        </ul>
      </li>

      <li>
        Drug Manufacturing
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Panchavida kashaya kalana</li>
          <li>How to grow and collect proper medicinal plants and parts</li>
          <li>Maintain the quality of raw materials</li>
          <li>Addition and special maturing procedures of kashàya chùrna guli kalka</li>
          <li>Preparation of balm, gritha, thaila and shampoo</li>
          <li>Common discussion regarding dravya guna and drug preparation</li>
          <li>Practical visits</li>
        </ul>
      </li>

      <li>
        Manufacturing of Kshàra
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Introduction</li>
          <li>Kshàra classification</li>
          <li>Manufacturing process of prathisharaniya and all kshàra</li>
          <li>Clinical assessment of kshara before using</li>
          <li>Usage of kshàra</li>
          <li>Qualities of kshàra</li>
          <li>Introduction of kshàra suthra</li>
          <li>Manufacturing process of kshàra suthra</li>
          <li>Types of kshàra suthra</li>
          <li>Preservation of kshàra suthra and packing</li>
          <li>Discussion regarding clinical usages of kshàra suthra</li>
        </ul>
      </li>

      <li>Yoga</li>

      <li>
        Basic Life Support
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>NG tube insertion</li>
          <li>Cannulation</li>
          <li>Urinary catheter insertion</li>
        </ul>
      </li>

      <li>
        Food and Ayurveda
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Food and diseases</li>
        </ul>
      </li>
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
