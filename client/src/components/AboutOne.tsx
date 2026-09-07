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
                    <span className="text-green-500 font-semibold mb-3 uppercase">Our Story</span>
                }
               
                   <div className="max-w-xl mx-auto space-y-6">
  <div>
    <h4 className="text-green-500 font-bold">Vision</h4>
    <p className="text-gray-800 font-semibold">
      "To be the world’s leading institution in Ayurvedic medical education and skills development, nurturing globally competent professionals grounded in the timeless wisdom of Ayurveda, and advancing human well-being through innovation, integrity, and cultural heritage."
    </p>
  </div>

  <div>
    <h4 className="text-green-500 font-bold">Mission</h4>
    <p className="text-gray-800 font-semibold">
      "Our mission is to deliver transformative education in Ayurveda by integrating classical knowledge with modern scientific principles, empowering students through experiential learning, global collaboration, and research-driven practice. We strive to cultivate ethical, skilled, and compassionate professionals who will elevate Ayurvedic medicine on a global platform while upholding the rich healing legacy of Sri Lanka."
    </p>
  </div>
</div>


                <div className="mt-6">
                 <Link href="" className="group h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-green-500 text-green-500 hover:text-white-100">
                 Learn More <i className="mdi mdi-arrow-right align-middle ms-1 group-hover:text-white text-inherit"></i>
                 </Link>
                </div>
            </div>
        </div>
    
  )
}
