import React from 'react';
import Lottie from 'lottie-react';
import animationData from './ai-loading-animation.json'; // Adjust this path based on where you save your JSON file

const LoadingAnimation = ({ message = "Loading..." }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-text-secondary">
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: 250, height: 250 }} // Adjust size as needed
            />
            <p className="mt-4 text-xl font-semibold">{message}</p>
        </div>
    );
};

export default LoadingAnimation;