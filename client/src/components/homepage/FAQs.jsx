// src/components/homepage/FAQs.jsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- FAQ Content ---
const faqsList = [
    { id: 'q1', q: "How does the matching process work?", a: "Our platform empowers you to find the perfect mentor. You can meticulously filter our directory by subject matter, area of specialty, university affiliation, and even specific keywords. Each mentor has a detailed profile showcasing their full credentials, publications, and experience. Once you identify your ideal match, you can initiate a connection request directly through our secure platform." },
    { id: 'q2', q: "What credentials do the mentors have?", a: "We uphold the highest standards of academic and professional integrity. Every mentor on ProfsConnect undergoes a rigorous multi-step verification process. We confirm their academic credentials with their affiliated institutions and verify their professional experience. This ensures you are always connecting with a legitimate, highly-qualified expert." },
    { id: 'q3', q: "Is my live chat session private and secure?", a: "Absolutely. We consider your privacy and data security to be a non-negotiable priority. All communications on our platform, including live chat, video calls, and file transfers, are protected by end-to-end AES-256 encryption. Your academic discussions are confidential and will never be shared." },
    { id: 'q4', q: "What if I'm not satisfied with a session?", a: "Your satisfaction is the measure of our success. In the rare event that a session does not meet your expectations, we encourage you to contact our dedicated support team within 24 hours. We offer a satisfaction guarantee and will work with you to find a solution, which may include a full platform credit or a complimentary session with an alternative expert." },
    { id: 'q5', q: "Can this service be used for professional development?", a: "Yes, ProfsConnect is a powerful tool for lifelong learners and professionals. Many of our mentors are industry-leading experts and C-suite executives who provide invaluable guidance on corporate strategy, leadership, career transitions, upskilling, and navigating complex professional challenges." },
];

const FAQs = () => {
    const [activeQuestionId, setActiveQuestionId] = useState(faqsList[0].id);
    const answerContainerRef = useRef(null);
    const magicBgRef = useRef(null);
    const questionRefs = useRef([]);
    const progressBarRef = useRef(null);

    useLayoutEffect(() => {
        const initialActiveButton = questionRefs.current.find(btn => btn.dataset.id === faqsList[0].id);
        if (initialActiveButton && magicBgRef.current) {
            gsap.set(magicBgRef.current, {
                top: initialActiveButton.offsetTop, height: initialActiveButton.offsetHeight, opacity: 1
            });
        }
    }, []);

    const handleQuestionClick = (id, index) => {
        if (id === activeQuestionId) return;
        const clickedButton = questionRefs.current.find(btn => btn.dataset.id === id);
        if (!clickedButton) return;

        gsap.to(magicBgRef.current, { top: clickedButton.offsetTop, height: clickedButton.offsetHeight, duration: 0.5, ease: 'power3.inOut' });
        gsap.to(progressBarRef.current, { width: `${((index + 1) / faqsList.length) * 100}%`, duration: 0.6, ease: 'power3.inOut' });

        gsap.to(answerContainerRef.current, {
            duration: 0.3, opacity: 0, y: 10, ease: 'power3.in',
            onComplete: () => {
                setActiveQuestionId(id);
                // Simple fade-in animation without SplitText
                gsap.fromTo(answerContainerRef.current, 
                    { opacity: 0, y: -10 }, 
                    { duration: 0.5, opacity: 1, y: 0, ease: 'power3.out' }
                );
            }
        });
    };

    const activeFaq = faqsList.find(faq => faq.id === activeQuestionId) || faqsList[0];
    const totalQuestions = faqsList.length;

    return (
        <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary">Your Questions, Answered</h2>
                    <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
                        Everything you need to know to get started and make the most of our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    
                    {/* --- Left Column: Questions List --- */}
                    <div className="lg:col-span-1 relative">
                        <div ref={magicBgRef} className="absolute left-0 w-full bg-primary/5 border border-accent rounded-lg shadow-lg opacity-0 pointer-events-none z-0" />
                        <div className="relative space-y-3 sm:space-y-4 z-10">
                            {faqsList.map((faq, index) => (
                                <button key={faq.id} ref={el => questionRefs.current[index] = el} data-id={faq.id}
                                    onClick={() => handleQuestionClick(faq.id, index)}
                                    className="w-full text-left p-4 rounded-lg transition-colors duration-300 flex items-center justify-between">
                                    <span className={`font-serif font-semibold text-base sm:text-lg ${activeQuestionId === faq.id ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>{faq.q}</span>
                                    <div className={`transition-opacity duration-300 ${activeQuestionId === faq.id ? 'opacity-100' : 'opacity-0'}`}>
                                        <ArrowRight className="h-5 w-5 text-accent" />
                                    </div>
                                </button>
                            ))}

                            {/* --- INTEGRATED Contact CTA Card --- */}
                             <a href="/contact" className="group block text-left p-4 rounded-lg border-2 border-dashed border-border-color hover:border-accent hover:bg-primary/5 transition-all duration-300">
                                <div className="flex items-center">
                                    <MessageSquareQuote className="h-8 w-8 text-primary mr-4 transition-transform duration-300 group-hover:scale-110"/>
                                    <div>
                                        <h4 className="font-serif font-bold text-lg text-primary">Still have questions?</h4>
                                        <p className="text-text-secondary text-sm">Our support team is here to help.</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* --- Right Column: Answer Display --- */}
                    <div className="lg:col-span-2 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between">
                       <div className="p-6 sm:p-8 lg:p-10 flex-grow">
                           <div ref={answerContainerRef} className="opacity-100">
                               <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-primary mb-4">{activeFaq.q}</h3>
                               <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                                  {activeFaq.a}
                               </p>
                           </div>
                       </div>
                        <div className="w-full bg-gray-200 h-1.5 mt-auto">
                            <div ref={progressBarRef} className="bg-gradient-to-r from-accent to-primary h-1.5" 
                                 style={{width: `${((faqsList.findIndex(f => f.id === activeFaq.id) + 1) / totalQuestions) * 100}%`}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

};

export default FAQs;