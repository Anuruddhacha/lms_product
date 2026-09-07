import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconType } from 'react-icons';
import { teamDataAcademic, teamDataNonAcademic } from '@/app/data';

interface TeamData {
  image: string;
  name: string;
  position: string;
  social: IconType[];
  data?: string;
}

export default function Team({ isAcademic = true }: { isAcademic?: boolean }) {
  const teamData = isAcademic ? teamDataAcademic : teamDataNonAcademic;

  return (
    <div className="grid gap-8 mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {teamData.map((item: TeamData, index: number) => (
        <div
          key={index}
          className="group relative bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 text-center transform transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
        >
          {/* Image container */}
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-violet-200 dark:ring-slate-600 shadow-md">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
          </div>

          {/* Name and position */}
          <div className="mt-5">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-green-600 transition-colors duration-300">
              {item.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-300 font-medium mt-1">
              {item.position}
            </p>

            {/* Degrees / Certifications */}
            {item.data && (
              <p className="text-xs text-slate-500 dark:text-slate-300 italic mt-2">
                {item.data}
              </p>
            )}
          </div>

          {/* Social Icons */}
          <ul className="flex justify-center mt-4 space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            {item.social.map((Icon, idx) => (
              <li key={idx}>
                <Link
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
