import React, { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { gsap } from 'gsap';

// --- Child Component: TestimonialCard (No changes needed here) ---
const TestimonialCard = React.forwardRef(({ testimonial }, ref) => {
    const cardRef = useRef(null);
    const spotlightRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const spotlight = spotlightRef.current;
        if (!card || !spotlight) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            gsap.to(spotlight, { x: e.clientX - rect.left, y: e.clientY - rect.top, duration: 0.2, ease: 'power3.out' });
        };
        const handleMouseEnter = () => gsap.to(spotlight, { scale: 1, opacity: 1, duration: 0.3 });
        const handleMouseLeave = () => gsap.to(spotlight, { scale: 0, opacity: 0, duration: 0.3 });

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={ref} className="testimonial-card-container w-[90vw] md:w-[480px] flex-shrink-0 p-4 h-full">
            <div ref={cardRef} className="relative h-full bg-slate-800/60 backdrop-blur-lg rounded-2xl p-8 flex flex-col border border-slate-700 overflow-hidden">
                <div ref={spotlightRef} className="absolute top-0 left-0 w-30 h-30 bg-[var(--theme-accent)]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl scale-0 opacity-0 pointer-events-none" />
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
});


// --- Main Testimonials Component (SLIDER REFACTOR) ---
const Testimonials = () => {
    const sectionRef = useRef(null);
    const cardsWrapperRef = useRef(null);
    const animationTimeline = useRef(null); // Ref to store the GSAP timeline

    // To create a seamless loop, we duplicate the testimonials.
    const originalTestimonials = [
        { id: 1, quote: "The quality of experts available is simply unmatched. It feels like having the academic support of multiple universities right at your fingertips.", author: "David Kim", role: "Student, Economics", avatar: "https://i.pravatar.cc/80?img=7" },
        { id: 2, quote: "This platform has become my go-to for quick career advice from academics who are leaders in their field. The perspective they provide is priceless.", author: "Sanjay Gupta", role: "Alumnus, Business School", avatar: "https://i.pravatar.cc/80?img=9" },
        { id: 3, quote: "It's an empowering tool for both learning and teaching. The direct interaction fosters a genuine passion for subjects and helps students overcome hurdles instantly.", author: "Prof. Aisha Khan", role: "Professor of Literature, Oxford", avatar: "https://i.pravatar.cc/80?img=10" },
    ];
    const testimonialsData = [...originalTestimonials, ...originalTestimonials.map(t => ({ ...t, id: t.id + originalTestimonials.length }))];


    useEffect(() => {
        const ctx = gsap.context(() => {
            const wrapper = cardsWrapperRef.current;
            if (!wrapper) return;

            // Calculate the total width of the original cards (not the duplicated ones)
            const totalWidth = wrapper.offsetWidth / 2;
            const duration = 20; // Duration in seconds for one loop

            // Set the initial position
            gsap.set(wrapper, { x: 0 });

            // Create the infinite looping timeline
            animationTimeline.current = gsap.timeline({
                repeat: -1,
                defaults: { ease: 'none' }
            }).to(wrapper, {
                x: -totalWidth,
                duration: duration
            });

           
        }, sectionRef);

        return () => {
            animationTimeline.current?.kill(); // Kill the timeline on cleanup
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="bg-[#1B283D] text-white relative overflow-hidden py-24 md:py-32">
            <div className="absolute inset-0 z-0 bg-grid-original" />

            <div className="container mx-auto px-4 text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold font-serif mb-6">
                    What Our <span className="text-[var(--theme-accent)]">Users Say</span>
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto font-sans">
                    Everything you need to know to get started and make the most of our platform.
                </p>
            </div>

            <div className="w-full overflow-hidden">
                <div ref={cardsWrapperRef} className="flex items-center h-full w-max">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard
                            key={`${testimonial.id}-${index}`}
                            testimonial={testimonial}
                        />
                    ))}
                </div>
            </div>
            <GlobalStyles />
        </section>
    );
};

// --- Inlined Global Styles (No changes needed here) ---
const GlobalStyles = () => (
    <style jsx global>{`
        .bg-grid-original {
            background-image: linear-gradient(rgba(48, 80, 144, 0.1) 1px, transparent 1px),
                              linear-gradient(to right, rgba(48, 80, 144, 0.1) 1px, transparent 1px);
            background-size: 4rem 4rem;
        }
    `}</style>
);

export default Testimonials;