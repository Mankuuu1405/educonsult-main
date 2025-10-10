// src/components/homepage/Hero.jsx
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

// --- More realistic placeholder data ---
const professorsCol1 = [
  { name: 'Dr. Evelyn Reed', title: 'Quantum Physics', imgSrc: 'https://i.pravatar.cc/300?img=1', color: 'from-accent to-blue-500' },
  { name: 'Ganesh Balakrishnan', title: 'Shark Tank India', imgSrc: 'https://i.pravatar.cc/300?img=51', color: 'from-primary to-indigo-700' },
  { name: 'Dr. Aditi Paul, PhD', title: 'Helping Immigrants', imgSrc: 'https://i.pravatar.cc/300?img=31', color: 'from-pink-400 to-red-400' },
  { name: 'Samuel Grant', title: 'Shakespearean Literature', imgSrc: 'https://i.pravatar.cc/300?img=12', color: 'from-yellow-400 to-orange-500' },
];

const professorsCol2 = [
  { name: 'Josh Burns Tech', title: 'Freelancer', imgSrc: 'https://i.pravatar.cc/300?img=68', color: 'from-purple-400 to-primary' },
  { name: 'Radhika Agrawal', title: 'Experience Design', imgSrc: 'https://i.pravatar.cc/300?img=25', color: 'from-green-400 to-accent' },
  { name: 'Melissa Chapman', title: 'PMP eBook Author', imgSrc: 'https://i.pravatar.cc/300?img=40', color: 'from-red-400 to-rose-500' },
  { name: 'Dr. Angela Chen', title: 'Machine Learning', imgSrc: 'https://i.pravatar.cc/300?img=35', color: 'from-sky-400 to-blue-600' },
];

// --- Professor Card Sub-Component ---
const ProfessorCard = ({ name, title, imgSrc, color }) => (
  <div className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105">
    <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden mb-3">
      <img src={imgSrc} alt={name} className="w-full h-full object-cover" loading="lazy" />
      <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-30 mix-blend-hard-light`}></div>
    </div>
    <h3 className="font-serif font-bold text-primary text-base sm:text-lg">{name}</h3>
    <p className="font-sans text-text-secondary text-xs sm:text-sm">{title}</p>
  </div>
);

const Hero = () => {
  const comp = useRef(null);

  // GSAP animations for all elements
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Animate the content
      gsap.fromTo(".hero-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2, stagger: 0.2 });
      
      // Animate the card grid
      gsap.fromTo(".card-grid", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.5 });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={comp} id="hero" className="bg-light-bg overflow-hidden pt-16 md:pt-20 lg:pt-0">
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-28 flex flex-col lg:flex-row items-center relative">
        
        {/* --- Scrolling Cards Grid --- */}
        <div className="lg:w-1/2 w-full h-full flex justify-center lg:justify-end lg:order-2">
            <div className="card-grid w-[90vw] max-w-sm sm:max-w-md md:max-w-lg lg:w-[500px] h-[450px] sm:h-[500px] flex gap-4 -rotate-3 lg:-rotate-6 transform">
                <div className="w-1/2 space-y-4 group">
                    <div className="animate-[scroll-up_25s_linear_infinite] group-hover:[animation-play-state:paused] space-y-4">
                        {[...professorsCol1, ...professorsCol1].map((prof, i) => <ProfessorCard key={`col1-${i}`} {...prof} />)}
                    </div>
                </div>
                <div className="w-1/2 space-y-4 pt-12 sm:pt-16 group">
                    <div className="animate-[scroll-down_25s_linear_infinite] group-hover:[animation-play-state:paused] space-y-4">
                        {[...professorsCol2, ...professorsCol2].map((prof, i) => <ProfessorCard key={`col2-${i}`} {...prof} />)}
                    </div>
                </div>
            </div>
        </div>
        
        {/* --- Content Column --- */}
        <div className="relative lg:static lg:w-1/2 w-full text-center lg:text-left lg:order-1 z-10 
                       mt-[-280px] sm:mt-[-320px] md:mt-[-280px] lg:mt-0">
          
          {/* Glassmorphic card for mobile/tablet */}
          <div className="bg-gray-400/20 backdrop-blur-xl border border-white/20 p-6 rounded-3xl
                         lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0">
            <h1 className="hero-content text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-primary leading-tight">
              Storefront for Your Knowledge.
            </h1>
            <p className="hero-content mt-6 text-base sm:text-lg text-black max-w-xl mx-auto lg:mx-0">
              Everything you offer—consultations, digital products, webinars and services—packaged in one trusted link your clients take seriously.
            </p>
            <div className="hero-content mt-10 justify-center lg:justify-start">
               <Link 
                  to="/faculty/signup" 
                  className="inline-block px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-primary bg-transparent border-2 border-primary rounded-xl hover:bg-primary hover:text-white transform hover:-translate-y-1 transition-all duration-300"
                >
                  Start My Page
               </Link>
            </div>
            <div className="hero-content mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="bg-white border border-border-color rounded-xl px-4 py-2 text-center">
                <p className="font-bold text-primary text-sm sm:text-base">★★★★★ <span className="font-sans text-text-secondary font-normal">10k+ reviews</span></p>
              </div>
              <div className="bg-white border border-border-color rounded-xl px-4 py-2 text-center">
                <p className="font-bold text-primary text-sm sm:text-base">1k+ <span className="font-sans text-text-secondary font-normal">professionals</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;