import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, ArrowRight, Send } from 'lucide-react';

const CTA = () => {
    return (
        <>
         {/* --- Part 1: High-Impact Call-to-Action Section (No Changes) --- */}
                    <section className="bg-primary py-20 text-white">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Ready to Connect?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                                Join a thriving community of ambitious learners and world-class mentors. Your next breakthrough is just a conversation away.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/faculty/signup" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary bg-white rounded-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl">
                                    Get Started for Free
                                    <ArrowRight className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                                <a href="/browse" className="px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white/50 rounded-lg hover:bg-white hover:text-primary transform hover:-translate-y-1 transition-all duration-300">
                                    Browse Experts
                                </a>
                            </div>
                        </div>
                    </section>
                     </>
    );
};

export default CTA;