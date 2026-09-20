/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function AboutOne({title}:{title:any}) {
    const [isOpen, setOpen] = useState<boolean>(false);
  return (
    
        <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
            <div className="lg:col-span-6 md:col-span-7">
                <div className="relative">
                    <div className="relative md:shrink-0 lg:me-0 me-10">
                        <Image className="object-cover md:w-96 w-84 h-[500px] rounded-lg shadow-md dark:shadow-gyay-700" src='/about_us.jpeg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} alt=""/>
                    </div>

                </div>
            </div>

            <div className="lg:col-span-6 md:col-span-5">
                {title && 
                    <span className="text-blue-500 font-semibold mb-3 uppercase">Our Story</span>
                }
               
                   <div className="max-w-xl mx-auto space-y-6">
  <div>
    <h4 className="text-blue-500 font-bold">Vision</h4>
    <p className="text-gray-800 font-semibold">
      "To be a leading platform for accessible, high-quality education, nurturing globally competent professionals and advancing lifelong learning through innovation and integrity."
    </p>
  </div>

  <div>
    <h4 className="text-blue-500 font-bold">Mission</h4>
    <p className="text-gray-800 font-semibold">
      "Our mission is to deliver transformative education by integrating expert knowledge with modern learning technology, empowering students through experiential learning, global collaboration, and practice-driven curricula. We strive to cultivate skilled and compassionate professionals ready to succeed in their fields."
    </p>
  </div>
</div>


                <div className="mt-6">
                 <Link href="" className="group h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-blue-500 text-blue-500 hover:text-white-100">
                 Learn More <i className="mdi mdi-arrow-right align-middle ms-1 group-hover:text-white text-inherit"></i>
                 </Link>
                </div>
            </div>
        </div>
    
  )
}
