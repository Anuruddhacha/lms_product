'use client'
import React from 'react'
import {Link as Link1} from 'react-scroll'
import Faq from './Faq'


export default function Faqs() {
  return (
   

        <section className="relative lg:py-24 py-16 font-medium">
            <div className="container relative">
                <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
                    <div className="lg:col-span-4 md:col-span-5">
                        <div className="rounded-md shadow text-gray-800 p-6 sticky top-20">
                            <ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
                                <li className="navbar-item p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="tech" className="text-base font-medium navbar-link">Enrollment Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="general" className="text-base font-medium navbar-link">General Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="payment" className="text-base font-medium navbar-link">Payments Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="support" className="text-base font-medium navbar-link">Support Questions</Link1></li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-8 md:col-span-7 text-gray-800">
                        <div id="tech">
                            <h5 className="text-xl font-semibold mb-6">Enrollment Questions</h5>

                            <Faq/>
                        </div>

                        <div id="general" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">General Questions</h5>

                            <Faq/>
                        </div>

                        <div id="payment" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">Payments Questions</h5>

                            <Faq/>
                        </div>

                        <div id="support" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">Support Questions</h5>

                            <Faq/>
                        </div>
                    </div>
                </div>
            </div>

        
        </section>

  )
}
