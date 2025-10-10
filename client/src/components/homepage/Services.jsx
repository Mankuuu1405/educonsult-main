// src/components/homepage/Services.jsx
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Content for the feature cards ---
const services = [
    {
        icon: "🔍",
        title: "Discover & Explore",
        description: "Begin by browsing a diverse, verified directory of expert professors. Our advanced filters help you find the perfect match by subject, specialty, or university.",
        id: "discover"
    },
    {
        icon: "💬",
        title: "Connect in Real-Time",
        description: "No more waiting for email replies. Initiate a secure, one-on-one live chat session to get your questions answered instantly and effectively.",
        id: "connect"
    },
    {
        icon: "📝",
        title: "Deepen Your Understanding",
        description: "Receive expert guidance on complex projects, get live feedback on your thesis, and review session transcripts to solidify your learning.",
        id: "deepen"
    },
    {
        icon: "🏆",
        title: "Achieve Your Goals",
        description: "Leverage your mentor network to excel in exams, publish papers, and gain invaluable career advice that sets you up for future success.",
        id: "achieve"
    },
];

const Services = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const [activeService, setActiveService] = useState(services[0].id);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const serviceItems = gsap.utils.toArray(".service-item");

            // Pin the left column
            const pin = gsap.to(".sticky-visual", {
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: ".sticky-visual",
                    scrub: 1, // Smoother scrubbing
                }
            });

            // Activate each service card on scroll
            serviceItems.forEach((item, index) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: "top center",
                    end: "bottom center",
                    onToggle: self => {
                        if (self.isActive) {
                            setActiveService(services[index].id);
                        }
                    },
                    // Optional: for debugging scroll positions
                    // markers: true, 
                });

                // Animate cards fading in
                 gsap.fromTo(item, 
                    { autoAlpha: 0.3, y: 50 },
                    {
                        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            return () => {
                pin.kill();
                ScrollTrigger.getAll().forEach(st => st.kill());
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Add this to your index.css if you don't have it, for the blob animation
    /*
    @keyframes blob {
	    0% { transform: translate(0px, 0px) scale(1); }
	    33% { transform: translate(30px, -50px) scale(1.1); }
	    66% { transform: translate(-20px, 20px) scale(0.9); }
	    100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
    */

    return (
        <section ref={sectionRef} id="services" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary">A Better Way to Learn</h2>
                    <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                        Our platform is designed to guide you from question to clarity, seamlessly.
                    </p>
                </div>
                
                {/* --- The main grid container --- */}
                <div ref={triggerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* --- Left Column: STICKY VISUAL --- */}
                    <div className="sticky-visual sticky top-24 h-[50vh] flex-col items-center justify-center hidden lg:flex">
                        <div className="relative w-full h-full max-w-md">
                           {/* Abstract Shapes */}
                           <div className="absolute w-64 h-64 bg-accent/20 rounded-full filter blur-3xl animate-blob" />
                           <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
                           <div className="absolute bottom-8 left-12 w-56 h-56 bg-secondary/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
                            
                            {/* Central Icon that changes */}
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-48 h-48 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all duration-500 transform-gpu">
                                   <p className="text-7xl transition-transform duration-500 ease-in-out" style={{ transform: `scale(${activeService ? 1 : 0.5})`}}>
                                        {services.find(s => s.id === activeService)?.icon || services[0].icon}
                                   </p>
                               </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: SCROLLING CONTENT --- */}
                    <div className="flex flex-col gap-16 lg:gap-24">
                        {services.map(service => (
                            <div key={service.id} className={`service-item p-8 rounded-2xl border transition-all duration-300 transform-gpu ${activeService === service.id ? 'bg-white shadow-custom border-transparent scale-[1.02]' : 'bg-gray-50 border-border-color'}`}>
                                <div className="flex items-center mb-4">
                                    <span className={`lg:hidden text-3xl p-3 rounded-full mr-4 ${activeService === service.id ? 'bg-accent/10 text-accent' : 'bg-gray-200 text-text-secondary'}`}>
                                        {service.icon}
                                    </span>
                                    <h3 className="text-3xl font-serif font-semibold text-primary">{service.title}</h3>
                                </div>
                                <p className="text-lg text-text-secondary">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;