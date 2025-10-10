import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Ensure all necessary Lucide icons are imported
import { Link as LinkIcon, Globe, Award, Heart, Star, DollarSign, Bell, Settings, CheckCircle, X, Quote, ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);

// Reusing your TestimonialCard structure for consistency, with slight adaptations
const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="group w-full p-4 h-full flex flex-col justify-between">
            <div className="relative h-full bg-slate-800/60 backdrop-blur-lg rounded-2xl p-8 flex flex-col border border-slate-700 overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--theme-accent)]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl scale-0 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 pointer-events-none" />
                <Quote className="h-10 w-10 text-[var(--theme-accent)] mb-6 z-10" />
                <p className="text-slate-300 text-lg italic mb-6 leading-relaxed flex-grow z-10 font-sans">
                    "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-auto pt-6 border-t border-slate-700 z-10">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover mr-5 border-2 border-[var(--theme-accent)]"
                    />
                    <div>
                        <p className="font-bold text-white text-lg font-serif">{testimonial.author}</p>
                        <p className="text-sm text-slate-400 font-sans">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Testimonials data
const pricingTestimonials = [
    { id: 1, quote: "CeTutor's commission model is incredibly fair. I only pay when I earn, which is perfect for building my practice.", author: "Dr. Evelyn Reed", role: "Professor of Physics, MIT", avatar: "https://i.pravatar.cc/80?img=5" },
    { id: 2, quote: "The transparency in pricing is a breath of fresh air. No hidden fees, just straightforward earnings.", author: "Maria Garcia", role: "PhD Candidate, Sociology", avatar: "https://i.pravatar.cc/80?img=3" },
    { id: 3, quote: "Setting up my profile and receiving payments through CeTutor was seamless. Their cut is reasonable for the value they provide.", author: "Dr. Angela Chen", role: "Machine Learning Expert", avatar: "https://i.pravatar.cc/80?img=35" },
   ];

// FAQs data for pricing page
const pricingFAQs = [
    { q: "What are the fees on CeTutor?", a: "CeTutor operates on a commission-based model. We charge a 10% commission for sessions booked directly through your personalized profile link, and a 20% commission for new clients discovered and booked through CeTutor's public browse listings (marketplace)." },
    { q: "Is there a subscription fee to use CeTutor?", a: "No, CeTutor does not charge any upfront subscription fees or recurring charges for mentors. You only pay a commission when you successfully earn from a completed session." },
    { q: "How do I get paid for my sessions?", a: "Earnings from your sessions are securely processed by our payment partners and are typically paid out to your linked bank account on a [e.g., weekly/bi-weekly] basis, subject to a minimum payout threshold." },
    { q: "Can I set my own prices for sessions and services?", a: "Absolutely! CeTutor gives you full control over your pricing. You can set your own rates for various services, and even offer flexible or country-based pricing options if you choose to." },
    { q: "What's the difference between direct and marketplace bookings?", a: "Direct bookings occur when a student finds your profile through a link you've shared (e.g., on your social media) or by searching directly for your name. Marketplace bookings are when students discover you through CeTutor's general search and browse categories on our platform." },
    { q: "Do you offer refunds for sessions?", a: "Our refund policy is designed to be fair to both mentors and students. Specific refund conditions are outlined in our Terms of Service, but generally, we encourage direct communication to resolve issues first. Our support team can mediate if necessary." },
];

// Comparison Features Data - Centralized for reusability
const comparisonFeatures = [
    { feature: "Pricing", CeTutor: "10-20% Commission", genericScheduling: "Subscription ($10-$50/m)", genericCoursePlatform: "15-30% Commission" },
    { feature: "Transaction Fees", CeTutor: "2-3%", genericScheduling: "2.9%", genericCoursePlatform: "4-5%" },
    { feature: "Instant Payouts", CeTutor: true, genericScheduling: true, genericCoursePlatform: false },
    { feature: "Flexible Pricing Models (e.g., Pay What You Want)", CeTutor: true, genericScheduling: false, genericCoursePlatform: false },
    { feature: "Custom Personal Page", CeTutor: true, genericScheduling: true, genericCoursePlatform: true },
    { feature: "Integrated Chats", CeTutor: true, genericScheduling: true, genericCoursePlatform: true },
    { feature: "Profile Badges & Credibility", CeTutor: true, genericScheduling: false, genericCoursePlatform: false },
    { feature: "Automated Re-engagement", CeTutor: true, genericScheduling: false, genericCoursePlatform: false },
    { feature: "Marketplace Discovery", CeTutor: true, genericScheduling: false, genericCoursePlatform: true },
    { feature: "Dedicated Mentor Support", CeTutor: true, genericScheduling: false, genericCoursePlatform: true },
];


const PricingPage = () => {
    const pageRef = useRef(null);
    const heroSectionRef = useRef(null);
    const scrollTriggerRefs = useRef([]);
    const [openFAQ, setOpenFAQ] = useState(null); // State for FAQ accordion

    // Refs for FAQ answer elements to control height with GSAP
    const faqAnswerRefs = useRef([]);

    const toggleFAQ = (index) => {
        if (openFAQ === index) {
            gsap.to(faqAnswerRefs.current[index], { height: 0, opacity: 0, paddingBottom: 0, ease: "power2.inOut", duration: 0.3 });
            setOpenFAQ(null);
        } else {
            if (openFAQ !== null) {
                gsap.to(faqAnswerRefs.current[openFAQ], { height: 0, opacity: 0, paddingBottom: 0, ease: "power2.inOut", duration: 0.3 });
            }
            setOpenFAQ(index);
            gsap.fromTo(faqAnswerRefs.current[index],
                { height: "auto", opacity: 1, paddingBottom: 20 },
                { height: "auto", opacity: 1, paddingBottom: 20, ease: "power2.inOut", duration: 0.5 }
            );
        }
    };


    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero section text animation
            gsap.fromTo(".hero-text-animate", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 });

            // 3D Ring animations (Four rings with different initial orientations and continuous rotation)
            // Ensure transform-origin is center for all rings implicitly by flexbox center positioning

            // Ring 1: Vertical (rotates primarily around its local Y-axis)
            gsap.to(".ring-1", {
                rotationY: 360,
                duration: 40,
                ease: "none",
                repeat: -1,
                transformOrigin: "center center",
            });

            // Ring 2: Horizontal (initially rotated 90deg around X, then rotates around its local Y/global X)
            gsap.to(".ring-2", {
                rotationY: 360, // Local Y rotation, appears as global X rotation due to initial transform
                duration: 45,
                ease: "none",
                repeat: -1,
                transformOrigin: "center center",
            });

            // Ring 3: Tilted Left (initially rotated, then rotates around its local Y and a bit of X)
            gsap.to(".ring-3", {
                rotationY: 360,
                rotationX: 180, // Add some rotation on X to make it more dynamic
                duration: 50,
                ease: "none",
                repeat: -1,
                transformOrigin: "center center",
            });

            // Ring 4: Tilted Right (initially rotated, then rotates around its local Y and a bit of X)
            gsap.to(".ring-4", {
                rotationY: 360,
                rotationX: -180, // Inverse X rotation
                duration: 55,
                ease: "none",
                repeat: -1,
                transformOrigin: "center center",
            });


            // 3D Card animation (ONLY ROTATION, no orbit)
            const tl = gsap.timeline({ repeat: -1, ease: "none" });
            
            tl.to(".small-card", {
                duration: 12,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: false,
                rotationY: 720,
                rotationX: 360,
                rotationZ: 180,
            });

            // General section scroll animations for other sections
            scrollTriggerRefs.current.forEach((element) => {
                if (element) {
                    gsap.fromTo(element,
                        { autoAlpha: 0, y: 30 },
                        {
                            autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: element,
                                start: "top 85%",
                                toggleActions: "play none none reverse",
                                // markers: true,
                            }
                        }
                    );
                }
            });
        
            // Testimonials Grid Entry Animation
            gsap.utils.toArray(".testimonial-card-container").forEach((card, i) => {
                gsap.fromTo(card,
                    { autoAlpha: 0, y: 50, rotationX: -10 },
                    {
                        autoAlpha: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power3.out",
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            });

            // Parallax effect for Testimonials section background
            gsap.to(".testimonials-parallax-bg", {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: ".testimonials-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });

            // Value Proposition "Feature Blocks" entry animation
            gsap.utils.toArray(".value-feature-block").forEach((block, i) => {
                gsap.fromTo(block,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: block,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            });

        }, pageRef);
        return () => ctx.revert();
    }, []);

    // Helper to assign ref and add to scrollTriggerRefs array
    const assignScrollRef = (el) => {
        if (el && !scrollTriggerRefs.current.includes(el)) {
            scrollTriggerRefs.current.push(el);
        }
    };

    const renderCheckOrX = (value) => {
        return value ? (
            <CheckCircle size={24} className="text-green-500 mx-auto animate-pulse-check" />
        ) : (
            <X size={24} className="text-red-500 mx-auto" />
        );
    };


    return (
        <div ref={pageRef} className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* --- Hero Section (Enhanced with 3D-like animations) --- */}
            <section ref={heroSectionRef} className="relative bg-gradient-to-br from-primary/5 to-blue-50 pt-28 h-[470px] sm:pt-32 pb-16 sm:pb-24 text-center overflow-hidden">
                {/* Background pulse effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-70 blur-xl animate-pulse-subtle"></div>
                
                {/* 3D Animation Container */}
                <div className="perspective-container absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    {/* Four Rings */}
                    <div className="large-ring ring-1 absolute
                                    w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]
                                    rounded-full border-[10px] sm:border-[15px] lg:border-[20px] border-blue-400
                                    transform-gpu"
                        style={{ transformStyle: "preserve-3d" }}
                    ></div>
                    <div className="large-ring ring-2 absolute
                                    w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]
                                    rounded-full border-[10px] sm:border-[15px] lg:border-[20px] border-blue-400/80
                                    transform-gpu"
                        style={{ transformStyle: "preserve-3d", transform: "rotateX(90deg)" }}
                    ></div>
                     <div className="large-ring ring-3 absolute
                                    w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]
                                    rounded-full border-[10px] sm:border-[15px] lg:border-[20px] border-blue-400/70
                                    transform-gpu"
                        style={{ transformStyle: "preserve-3d", transform: "rotateX(45deg) rotateY(30deg)" }}
                    ></div>
                     <div className="large-ring ring-4 absolute
                                    w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]
                                    rounded-full border-[10px] sm:border-[15px] lg:border-[20px] border-blue-400/60
                                    transform-gpu"
                        style={{ transformStyle: "preserve-3d", transform: "rotateX(-45deg) rotateY(-30deg)" }}
                    ></div>
                    
                    {/* Small Card (Orbiter) */}
                    <div className="small-card absolute
                                    w-24 h-16 sm:w-28 sm:h-20 bg-accent rounded-lg shadow-xl
                                    flex items-center justify-center text-white text-lg font-bold font-serif
                                    transform-gpu"
                        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                    >
                        CeTutor
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10"> {/* Ensure content is above icons */}
                    <h1 className="hero-text-animate text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-primary leading-tight">
                        Your Success, Our Success.
                    </h1>
                    <p className="hero-text-animate mt-6 text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
                        Our model is simple: a fair commission on completed sessions. No hidden fees, no credit card required to start, just pure value.
                    </p>
                </div>
            </section>

            {/* --- Pricing Plans Section (Innovative Cards) --- */}
            <section ref={assignScrollRef} className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary text-center mb-12 sm:mb-16">
                        Simple, Transparent Pricing.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        
                         {/* Pricing Card 1 - Featured/Accentuated */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 text-white rounded-3xl shadow-2xl border border-primary/50 p-8 flex flex-col items-center text-center transform scale-[1.02] hover:scale-[1.05] transition-all duration-500">
                            {/* Decorative background shapes for featured card */}
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/20 rounded-full opacity-50 transform group-hover:scale-125 transition-all duration-500"></div>
                            <div className="relative z-10 w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                                <LinkIcon size={48} className="drop-shadow-md" />
                            </div>
                            <h3 className="relative z-10 text-2xl font-serif font-bold mb-2">Your Profile, Your Price</h3>
                            <p className="relative z-10 text-6xl sm:text-7xl font-extrabold mb-4 leading-none">10%</p>
                            <p className="relative z-10 text-white/80 leading-relaxed font-sans flex-grow mt-2">
                                A minimal commission on all sessions booked directly through your personalized CeTutor profile link.
                            </p>
                            <Link to="/faculty/signup" className="relative z-10 mt-8 px-8 py-3 bg-accent text-primary-dark font-bold rounded-lg hover:bg-white hover:text-primary transition-colors shadow-md transform group-hover:scale-105">
                                Get Started <ArrowRight size={18} className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    
                        {/* Pricing Card 3 */}
                        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl border border-border-color/60 p-8 flex flex-col items-center text-center transform hover:scale-[1.03] transition-all duration-500">
                             {/* Decorative background circle */}
                            <div className="absolute -top-10 -left-10 w-48 h-48 bg-secondary/5 rounded-full opacity-50 transform group-hover:scale-125 transition-all duration-500"></div>
                            <div className="relative z-10 w-24 h-24 bg-secondary/10 text-primary rounded-full flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                                <Award size={48} className="drop-shadow-md" />
                            </div>
                            <h3 className="relative z-10 text-2xl font-serif font-bold text-primary mb-2">Enterprise & Partnerships</h3>
                            <p className="relative z-10 text-6xl sm:text-7xl font-extrabold text-primary mb-4 leading-none">Custom</p>
                            <p className="relative z-10 text-text-secondary leading-relaxed font-sans flex-grow mt-2">
                                For high-volume mentors, institutions, or unique collaborations. Let's craft a plan that fits your vision.
                            </p>
                            <Link to="/contact" className="relative z-10 mt-8 px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors shadow-md transform group-hover:scale-105">
                                Contact Sales <ArrowRight size={18} className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Value Proposition Grid (INNOVATIVE FEATURE BLOCKS) --- */}
            <section className="py-16 sm:py-24 bg-primary text-white relative overflow-hidden"> {/* Changed to a darker primary */}
                <div className="absolute inset-0 z-0 bg-grid-original opacity-20"></div> {/* Background grid */}
                <div className="container mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16 relative z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
                        How CeTutor Fuels Your Growth.
                    </h2>
                    <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                        Our platform is engineered to maximize your impact and income.
                    </p>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Block 1 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <Heart size={64} className="text-red-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">15%</h3>
                            <p className="text-xl font-bold text-white mb-2">Higher Rebooking Rate</p>
                            <p className="text-white/80 text-base">Automated follow-ups encourage students to re-engage with your expertise.</p>
                        </div>

                        {/* Feature Block 2 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <Star size={64} className="text-yellow-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">30%</h3>
                            <p className="text-xl font-bold text-white mb-2">Conversion Uplift</p>
                            <p className="text-white/80 text-base">Leverage integrated testimonials and profile optimization features to build trust.</p>
                        </div>

                        {/* Feature Block 3 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <Globe size={64} className="text-blue-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">Global</h3>
                            <p className="text-xl font-bold text-white mb-2">Expand Your Reach Globally</p>
                            <p className="text-white/80 text-base">Connect with students from diverse backgrounds and regions, no boundaries.</p>
                        </div>

                        {/* Feature Block 4 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <DollarSign size={64} className="text-green-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">Flexible</h3>
                            <p className="text-xl font-bold text-white mb-2">Multiple Earning Pathways</p>
                            <p className="text-white/80 text-base">Offer various services from live chats to project guidance, and more, all priced by you.</p>
                        </div>

                        {/* Feature Block 5 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <Bell size={64} className="text-purple-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">Reduced</h3>
                            <p className="text-xl font-bold text-white mb-2">Reduced Abandonment</p>
                            <p className="text-white/80 text-base">Automated reminders minimize missed opportunities and unconfirmed bookings.</p>
                        </div>

                        {/* Feature Block 6 */}
                        <div className="value-feature-block group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl">
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full bg-blue-600/30 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                <Settings size={64} className="text-orange-400" />
                            </div>
                            <h3 className="text-5xl font-extrabold mb-2 text-accent">Effortless</h3>
                            <p className="text-xl font-bold text-white mb-2">Effortless Management</p>
                            <p className="text-white/80 text-base">Manage your schedule, availability, and communications with ease from one dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Comparison Table (Enhanced Styling) --- */}
            <section ref={assignScrollRef} className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-sm font-semibold uppercase text-accent mb-2">Comparison</p>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">
                            Why CeTutor Stands Out.
                        </h2>
                        <p className="text-base sm:text-lg text-text-secondary">
                            We're built specifically for expert-mentor connections, offering tailored features that generic scheduling tools simply can't match.
                        </p>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6">
                    {/* Desktop Table View */}
                    <div className="overflow-x-auto pb-6 hidden md:block">
                        <table className="min-w-full bg-white border border-border-color rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-semibold uppercase text-text-secondary border-b border-border-color">
                                    <th className="py-4 px-6 rounded-tl-lg">Feature</th>
                                    <th className="py-4 px-6 text-center">CeTutor</th>
                                    <th className="py-4 px-6 text-center">Generic Scheduling</th>
                                    <th className="py-4 px-6 text-center rounded-tr-lg">Generic Course Platform</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, index) => (
                                    <tr key={index} className={`border-b border-border-color ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}>
                                        <td className="py-4 px-6 font-semibold text-primary">{row.feature}</td>
                                        <td className="py-4 px-6 text-center text-text-secondary">
                                            {typeof row.CeTutor === 'boolean' ? renderCheckOrX(row.CeTutor) : row.CeTutor}
                                        </td>
                                        <td className="py-4 px-6 text-center text-text-secondary">
                                            {typeof row.genericScheduling === 'boolean' ? renderCheckOrX(row.genericScheduling) : row.genericScheduling}
                                        </td>
                                        <td className="py-4 px-6 text-center text-text-secondary">
                                            {typeof row.genericCoursePlatform === 'boolean' ? renderCheckOrX(row.genericCoursePlatform) : row.genericCoursePlatform}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden grid grid-cols-1 gap-6">
                        {comparisonFeatures.map((row, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg border border-border-color p-6 transition-all duration-300 hover:shadow-xl">
                                <h3 className="font-bold text-lg text-primary mb-4 border-b pb-3 border-border-color">{row.feature}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-primary">CeTutor:</span>
                                        <span className="text-text-secondary">
                                            {typeof row.CeTutor === 'boolean' ? renderCheckOrX(row.CeTutor) : row.CeTutor}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-primary">Generic Scheduling:</span>
                                        <span className="text-text-secondary">
                                            {typeof row.genericScheduling === 'boolean' ? renderCheckOrX(row.genericScheduling) : row.genericScheduling}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-primary">Generic Course Platform:</span>
                                        <span className="text-text-secondary">
                                            {typeof row.genericCoursePlatform === 'boolean' ? renderCheckOrX(row.genericCoursePlatform) : row.genericCoursePlatform}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           

            {/* --- FAQs Section (Innovative Accordion) --- */}
            <section ref={assignScrollRef} className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                            Frequently Asked Questions About Pricing
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
                            Find quick answers to the most common questions about our platform's fees and earnings.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {pricingFAQs.map((faq, index) => (
                            <div key={index} className={`accordion-item overflow-hidden rounded-lg shadow-sm border transition-all duration-300 ease-in-out
                                ${openFAQ === index ? 'bg-light-bg border-primary/50' : 'bg-gray-50 border-border-color/60 hover:border-accent/50'}`}>
                                <button
                                    className="w-full text-left p-5 flex justify-between items-center font-serif font-semibold text-lg text-primary cursor-pointer"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.q}
                                    <ChevronDown className={`transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180 text-primary' : 'text-text-secondary'}`} />
                                </button>
                                <div
                                    ref={el => faqAnswerRefs.current[index] = el}
                                    className="accordion-content px-5 pt-0 text-text-secondary leading-relaxed overflow-hidden"
                                    style={{
                                        height: openFAQ === index ? 'auto' : '0px',
                                        opacity: openFAQ === index ? 1 : 0,
                                        paddingBottom: openFAQ === index ? '20px' : '0px'
                                    }}
                                >
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12 sm:mt-16 text-text-secondary">
                        <p className="text-lg">
                            Can't find the answer you're looking for? Our team is here to help clarify.
                        </p>
                        <Link to="/contact" className="inline-block mt-4 text-accent font-semibold hover:underline">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
             {/* --- Get Started CTA Button --- */}
            <section ref={assignScrollRef} className="py-16 sm:py-20  text-center">
                <div className="container mx-auto px-4 sm:px-6">
                    <Link to="/faculty/signup" className="inline-block px-10 py-4 bg-primary text-white text-lg font-bold rounded-lg hover:bg-secondary transition-colors shadow-xl group">
                        Start Earning with CeTutor <ArrowRight size={20} className="inline-block ml-3 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
            <Footer />
            {/* Global Styles for background grid and animations */}
            <style jsx global>{`
                .bg-grid-original {
                    background-image: linear-gradient(rgba(48, 80, 144, 0.1) 1px, transparent 1px),
                                      linear-gradient(to right, rgba(48, 80, 144, 0.1) 1px, transparent 1px);
                    background-size: 4rem 4rem;
                }
                /* Additional animation for hero background pulse */
                @keyframes pulse-subtle {
                    0% { opacity: 0.7; }
                    50% { opacity: 0.9; }
                    100% { opacity: 0.7; }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 6s infinite ease-in-out;
                }
                /* 3D perspective container for hero elements */
                .perspective-container {
                    perspective: 1000px; /* Adjust as needed for desired depth */
                }
                /* Elements within the 3D space */
                .large-ring, .small-card {
                    transform-style: preserve-3d;
                }
                .small-card {
                    backface-visibility: hidden; /* Hides the back of the element when flipped, for a cleaner look */
                }
                /* Animation for checkmark pulse in comparison table */
                @keyframes pulse-check {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                .animate-pulse-check {
                    animation: pulse-check 1.5s infinite ease-in-out;
                }
                /* Custom styles for FAQ accordion */
                .accordion-content {
                    will-change: height, opacity, padding-bottom;
                }
                /* Styles for the new Feature Cubes */
                .feature-cube { /* Keeping this for reference, though structure changed to value-feature-block */
                    transform-origin: center center; /* Ensure transformations are from the center */
                    will-change: transform, opacity, box-shadow;
                }
            `}</style>
        </div>
    );
};

export default PricingPage;