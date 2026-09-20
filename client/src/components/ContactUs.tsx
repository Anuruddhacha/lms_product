"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { contactMembers } from "@/app/data";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-0 pb-0">
      {contactMembers.map(
        (
          member: {
            name: React.ReactNode;
            phoneNumbers: string[];
            email: string;
            location: string;
            profileImage: string;
            facebookUrl: string;
          },
          index: React.Key
        ) => {
          // Prepare WhatsApp link using first phone number (remove spaces, plus signs)
          const rawPhone = member.phoneNumbers[0] || "";
          const cleanPhone = rawPhone.replace(/\D/g, ""); // keep digits only
          const whatsappUrl = `https://wa.me/${cleanPhone}`;
          const facebookUrl = member.facebookUrl;

          return (
            <div className="text-center px-6" key={index}>
              {/* Profile image */}
              <div className="size-20 rounded-full overflow-hidden shadow-md mx-auto">
                <Image
                  src={member.profileImage}
                  alt={`${member.name} profile`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="mt-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-slate-200">
                  {member.name}
                </h5>

                <div className="mt-2">
                  <p className="text-slate-500 dark:text-slate-400">Phone:</p>
                  <div className="flex flex-col mt-1 gap-1">
                    {member.phoneNumbers.map((phone, i) => (
                      <Link
                        key={i}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="text-blue-600 hover:underline transition duration-300"
                      >
                        {phone}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-slate-500 dark:text-slate-400">Email:</p>
                  <Link
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:underline transition duration-300"
                  >
                    {member.email}
                  </Link>
                </div>

                {/* Buttons container */}
<div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
  {cleanPhone && (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-40"
    >
      <FaWhatsapp className="w-5 h-5 mr-2" />
      WhatsApp
    </a>
  )}

  {facebookUrl && (
    <a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-40"
    >
      <FaFacebookF className="w-5 h-5 mr-2" />
      Facebook
    </a>
  )}
</div>

              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
