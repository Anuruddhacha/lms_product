/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react';
import Link from 'next/link';


export default function AboutOne({title}:{title:any}) {
    const [isOpen, setOpen] = useState<boolean>(false);
  return (

        <div className="flex justify-center">
            <div className="max-w-2xl w-full text-center">
                {title &&
                    <span className="text-udemy-purple font-semibold mb-3 uppercase">Our Story</span>
                }

                   <div className="max-w-xl mx-auto space-y-6">
  <div>
    <h4 className="text-udemy-purple font-bold">Vision</h4>
    <p className="text-udemy-black font-semibold">
      "To be a leading platform for accessible, high-quality education, nurturing globally competent professionals and advancing lifelong learning through innovation and integrity."
    </p>
  </div>

  <div>
    <h4 className="text-udemy-purple font-bold">Mission</h4>
    <p className="text-udemy-black font-semibold">
      "Our mission is to deliver transformative education by integrating expert knowledge with modern learning technology, empowering students through experiential learning, global collaboration, and practice-driven curricula. We strive to cultivate skilled and compassionate professionals ready to succeed in their fields."
    </p>
  </div>
</div>


                <div className="mt-6">
                 <Link href="" className="group h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-sm bg-udemy-purpleLight hover:bg-udemy-purple text-udemy-purple hover:text-white-100 transition-colors">
                 Learn More <i className="mdi mdi-arrow-right align-middle ms-1 group-hover:text-white-100 text-inherit"></i>
                 </Link>
                </div>
            </div>
        </div>
    
  )
}
