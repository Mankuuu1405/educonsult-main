

// src/components/homepage/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-bg text-text-on-dark py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                {/*
                    CRITICAL CHANGE: Set grid-cols-2 as default for mobile (xs and up).
                    This ensures "Platform" and "Company" sit side-by-side on the smallest screens.
                    Then, specify col-span-2 for sections that need to take full width on mobile.
                */}
                <div className="grid  grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 md:text-center">
                    
                    {/* Column 1: Brand & Description - Now spans 2 columns on mobile */}
                    <div className="col-span-2 lg:col-span-1 text-center md:text-flex md:flex-col md:items-center">
                                      <Link to="/" className="flex items-center">
                            <img src="/logo.jpg" alt="CeTutor Logo" className="h-16 w-auto object-contain" />
                            <span className="ml-2 text-2xl md:text-3xl font-bold text-primary tracking-tight font-serif"></span>
                        </Link>
                        <p className="text-text-on-dark/60 mt-4 font-sans text-sm leading-relaxed max-w-sm mx-auto">
                            The premier platform connecting students with expert academic and professional mentors for transformative learning experiences.
                        </p>
                    </div>

                    {/* Column 2: Platform Links - Automatically takes 1 column on mobile (grid-cols-2) */}
                    <div className="text-sm text-center">
                        <h3 className="text-base font-serif font-semibold text-primary tracking-wider uppercase mb-5">Platform</h3>
                        <ul className="space-y-4">
                            <li><a href="/browse" className="text-text-on-dark/70 hover:text-accent transition-colors">Find a Mentor</a></li>
                            <li><a href="/" className="text-text-on-dark/70 hover:text-accent transition-colors">How It Works</a></li>
                            <li><a href="/faculty/signup" className="text-text-on-dark/70 hover:text-accent transition-colors">Become a Mentor</a></li>
                            <li><a href="/contact" className="text-text-on-dark/70 hover:text-accent transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company Links - Automatically takes 1 column on mobile (grid-cols-2) */}
                    <div className="text-sm text-center">
                         <h3 className="text-base font-serif font-semibold text-primary tracking-wider uppercase mb-5">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-text-on-dark/70 hover:text-accent transition-colors">About Us</a></li>
                            <li><a href="/contact" className="text-text-on-dark/70 hover:text-accent transition-colors">Contact</a></li>
                            <li><a href="/terms" className="text-text-on-dark/70 hover:text-accent transition-colors">Terms&Conditions</a></li>
                            <li><a href="/privacy-policy" className="text-text-on-dark/70 hover:text-accent transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Stay Updated Form - Now spans 2 columns on mobile */}
                    <div className="col-span-2 lg:col-span-1 text-sm text-center md:flex md:flex-col md:items-center">
                        <h3 className="text-base font-serif font-semibold text-primary tracking-wider uppercase mb-5">Stay Updated</h3>
                        <p className="text-text-on-dark/60 mb-4">Get the latest news and insights from the team.</p>
                        <form className="flex max-w-sm mx-auto">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="w-full bg-primary/30 text-primary placeholder-text-on-dark/50 px-4 py-2.5 rounded-l-lg border border-primary/50 focus:outline-none focus:ring-2 focus:ring-accent/80 focus:border-accent"
                            />
                            <button type="submit" aria-label="Submit email" className="group bg-accent text-primary px-4 py-2.5 rounded-r-lg hover:bg-opacity-90 transition-all">
                                <Send className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-45" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- Bottom Bar: Copyright & Socials --- */}
                <div className="mt-16 pt-8 border-t border-primary/20 flex flex-col justify-between items-center text-sm">
                    <p className="text-text-on-dark/50 order-2 md:order-1 mt-4 md:mt-0 text-center">
                        &copy; {new Date().getFullYear()} CeTutor. All Rights Reserved.
                    </p>
                    <div className="flex space-x-4 order-1">
                        <a href="#" aria-label="Twitter" className="text-text-on-dark/50 hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-text-on-dark/50 hover:text-primary transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-text-on-dark/50 hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;