import React, { useLayoutEffect, useRef, useState } from 'react'; // Import useState
import { Search, User, CreditCard, MessageSquare, Shield, HelpCircle, Mail, Phone } from 'lucide-react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Data for support topics ---
const supportTopics = [
    { title: "Account & Profile", icon: User, description: "Manage your profile, login, and notification settings." },
    { title: "Billing & Payments", icon: CreditCard, description: "Understand payments, invoices, and transactions." },
    { title: "Using CeTutor", icon: MessageSquare, description: "Learn how to use chat, schedule, and find mentors." },
    { title: "Trust & Safety", icon: Shield, description: "Our policies for a secure and trusted community." },
];

const faqItems = [
    { q: "How do I reset my password?", a: "You can reset your password by clicking the 'Forgot Password' link on the login page. An email with instructions will be sent to your registered email address." },
    { q: "Where can I find my invoice?", a: "All your invoices and transaction history are available in the 'Billing' section of your account dashboard." },
    { q: "How do I report an issue with a session?", a: "If you encounter any issues, you can report it directly from your session history page or contact our support team with the session details." },
    { q: "Can I connect with multiple mentors?", a: "Yes, CeTutor allows you to connect with multiple mentors based on your needs and interests." },
    { q: "What if I miss a scheduled session?", a: "Please refer to our cancellation and no-show policy available in the 'Terms of Service' or contact support for specific cases." },
    { q: "Is my data secure on CeTutor?", a: "We prioritize your privacy and data security. All data is encrypted and protected according to industry standards. Please see our Privacy Policy for more details." },
];

const SupportPage = () => {
    const pageRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    // Handle search input changes
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter support topics based on search query
    const filteredTopics = supportTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter FAQ items based on search query
    const filteredFaqs = faqItems.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".animate-header", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' });
            // Only animate topics/faqs if not currently filtering to avoid re-animations on search
            if (!searchQuery) {
                gsap.fromTo(".animate-topic", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ".topics-grid", start: "top 80%" } });
                gsap.fromTo(".animate-faq", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ".faq-section", start: "top 80%" } });
            }
            gsap.fromTo(".animate-contact", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ".contact-section", start: "top 80%" } });
        }, pageRef);
        return () => ctx.revert();
    }, [searchQuery]); // Re-run effect if searchQuery changes (to apply animations if search clears)

    return (
        <div ref={pageRef} className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-24">
                
                {/* --- Header & Search Bar --- */}
                <header className="animate-header text-center bg-white p-12 rounded-2xl shadow-lg border border-border-color/30 mb-20">
                    <h1 className="text-4xl lg:text-5xl font-serif font-extrabold text-primary">How can we help?</h1>
                    <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                        Search our knowledge base or browse topics to find the answers you need.
                    </p>
                    <div className="mt-8 max-w-2xl mx-auto relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-secondary/70" />
                        <input
                            type="search"
                            placeholder="Describe your issue..."
                            value={searchQuery} // Controlled component
                            onChange={handleSearchChange} // Event handler
                            className="w-full pl-16 pr-6 py-4 bg-gray-100 text-lg rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </header>

                {/* --- Search Results / Topic Grid --- */}
                {searchQuery && filteredTopics.length === 0 && filteredFaqs.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-serif font-bold text-text-secondary">No results found for "{searchQuery}"</h2>
                        <p className="mt-4 text-lg text-text-secondary">Please try a different keyword or browse our topics.</p>
                        <button 
                            onClick={() => setSearchQuery('')} 
                            className="mt-6 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Only show topic grid if there are filtered topics or no search query */}
                        {(filteredTopics.length > 0 || !searchQuery) && (
                            <div className="topics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                                {searchQuery && <h2 className="col-span-full text-2xl font-serif font-bold text-primary mb-4">Matching Topics</h2>}
                                {filteredTopics.map(topic => (
                                    <a href="#" key={topic.title} className="animate-topic group p-6 bg-white rounded-2xl border border-border-color/60 hover:border-accent hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                            <topic.icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-primary mb-2">{topic.title}</h3>
                                        <p className="text-text-secondary font-sans">{topic.description}</p>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Only show FAQ section if there are filtered FAQs or no search query */}
                        {(filteredFaqs.length > 0 || !searchQuery) && (
                            <div className="faq-section mb-20">
                                <h2 className="text-3xl font-serif font-bold text-primary text-center mb-10">
                                    {searchQuery ? 'Matching Questions' : 'Frequently Asked Questions'}
                                </h2>
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {filteredFaqs.map((faq, index) => (
                                        <details key={index} className="animate-faq p-5 bg-white rounded-lg shadow-sm border border-border-color/60 group">
                                            <summary className="font-serif font-semibold text-lg text-primary cursor-pointer list-none flex justify-between items-center">
                                                {faq.q}
                                                <div className="transform transition-transform duration-300 group-open:rotate-180">▼</div>
                                            </summary>
                                            <p className="mt-4 text-text-secondary leading-relaxed">{faq.a}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {/* --- Contact Us Section --- */}
                 <div className="contact-section animate-contact p-10 bg-gradient-to-br from-primary to-blue-800 text-white rounded-2xl shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-3">Still Need Help?</h2>
                            <p className="text-white/80 max-w-lg">If you can't find the answer you're looking for, please don't hesitate to reach out to our dedicated support team.</p>
                             <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                    <Mail className="w-6 h-6 mr-4 text-accent"/>
                                    <a href="mailto:support@CeTutor.com" className="text-lg hover:underline">support@CeTutor.com</a>
                                </div>
                                 <div className="flex items-center">
                                    <Phone className="w-6 h-6 mr-4 text-accent"/>
                                    <span className="text-lg">(123) 456-7890 (Mon-Fri, 9am-5pm)</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                             <form className="space-y-4">
                                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-gray-100 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-gray-100 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                                <textarea placeholder="How can we help you?" rows="4" className="w-full px-4 py-3 bg-gray-100 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
                                <button type="submit" className="w-full py-3 font-bold text-white bg-accent rounded-lg hover:bg-opacity-90 transition-all">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SupportPage;