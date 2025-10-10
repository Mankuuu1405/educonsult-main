import React from 'react';

const BookLoader = () => {
  return (
    <>
      {/* We include the keyframe animation styles directly here for self-containment */}
      <style>{`
        /* Keyframe for individual particle movement and fade */
        @keyframes converge-and-fade {
          0% {
            /* Start position (defined by CSS variables), completely transparent and slightly blurred */
            transform: translate(calc(var(--start-x)), calc(var(--start-y)));
            opacity: 0;
            filter: blur(2px);
          }
          20% {
             /* Fully opaque and sharp shortly after starting, before reaching the center */
             opacity: 1;
             filter: blur(0px);
          }
          70% {
            /* Reach the center (0,0) with full opacity */
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            /* Fade out and blur at the center before restarting, giving a soft dissolve */
            transform: translate(0, 0);
            opacity: 0;
            filter: blur(2px);
          }
        }

        /* Container for the particles, establishing the relative coordinate system */
        .particle-container {
            position: relative;
            width: 120px; /* Defines the area where particles originate and converge */
            height: 120px;
            display: flex; /* Helps to center the visual effect if the content inside needs it */
            justify-content: center;
            align-items: center;
            /* Using overflow: hidden; ensures particles smoothly appear/disappear at the boundary */
            overflow: hidden; 
            /* You can add subtle shadows or borders here to define the space, if desired */
            /* border: 1px dashed #e2e8f0; */
            border-radius: 8px;
        }

        /* Base styling for each individual particle */
        .particle {
            position: absolute;
            width: 7px;
            height: 7px;
            background-color: #6366f1; /* Default vibrant indigo color (Tailwind Indigo-500/600) */
            border-radius: 50%; /* Makes them circular (dots) */
            filter: blur(0px); /* Initially clear */
            /* Apply the animation, with a custom cubic-bezier for a smooth, elastic feel */
            animation: converge-and-fade 2.5s infinite cubic-bezier(0.68, -0.05, 0.36, 1.25); 
            will-change: transform, opacity, filter; /* Optimize for performance */
        }

        /* Customizing each particle's start position, delay, and optional color for variety */
        .particle:nth-child(1) {
            --start-x: -60px; --start-y: -60px; /* Top-left origin */
            animation-delay: 0s;
            background-color: #6366f1; 
        }
        .particle:nth-child(2) {
            --start-x: 60px; --start-y: -60px; /* Top-right origin */
            animation-delay: 0.4s;
            background-color: #4f46e5; /* Slightly darker indigo */
            width: 8px; height: 8px; /* Varying size */
        }
        .particle:nth-child(3) {
            --start-x: 60px; --start-y: 60px; /* Bottom-right origin */
            animation-delay: 0.8s;
            background-color: #a78bfa; /* Light purple */
        }
        .particle:nth-child(4) {
            --start-x: -60px; --start-y: 60px; /* Bottom-left origin */
            animation-delay: 1.2s;
            background-color: #8b5cf6; /* Deeper purple */
            width: 6px; height: 6px;
        }
        .particle:nth-child(5) {
            --start-x: 0px; --start-y: -70px; /* Top-middle origin */
            animation-delay: 0.2s;
            background-color: #6d28d9; /* Darkest purple */
        }
        .particle:nth-child(6) {
            --start-x: 0px; --start-y: 70px; /* Bottom-middle origin */
            animation-delay: 1.0s;
            background-color: #7c3aed; /* Mid-range purple */
            width: 9px; height: 9px;
        }
        .particle:nth-child(7) {
            --start-x: -70px; --start-y: 0px; /* Left-middle origin */
            animation-delay: 0.6s;
            background-color: #9333ea; /* More vibrant purple */
            width: 7px; height: 7px;
        }
        .particle:nth-child(8) {
            --start-x: 70px; --start-y: 0px; /* Right-middle origin */
            animation-delay: 1.4s;
            background-color: #c084fc; /* Lightest purple */
            width: 5px; height: 5px;
        }


        /* Overall wrapper for demonstration, centering the loader */
        .main-loader-wrapper {
          min-height: 250px; /* Ensure visibility for testing */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f9fafb; /* A clean, light background for contrast */
          border-radius: 8px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08); /* A soft shadow for context */
          padding: 2rem;
        }
      `}</style>
      <div className="main-loader-wrapper">
        <div className="particle-container">
          {/* Multiple particle divs, each will get unique animation characteristics */}
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
    </>
  );
};

export default BookLoader;