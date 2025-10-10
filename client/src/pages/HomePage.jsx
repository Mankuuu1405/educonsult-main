// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/homepage/Navbar';
import Hero from '../components/homepage/Hero';
import Services from '../components/homepage/Services';
import TopProfessors from '../components/homepage/TopProfessors';
import Testimonials from '../components/homepage/Testimonials';
import FAQs from '../components/homepage/FAQs';
import CTA from '../components/homepage/CTA';
import Footer from '../components/homepage/Footer';

const HomePage = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <TopProfessors />
        <Testimonials />
        <FAQs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;