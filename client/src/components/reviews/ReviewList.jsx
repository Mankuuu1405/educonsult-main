import React from 'react';
import { Star } from 'lucide-react';

const ReviewList = ({ reviews }) => {
    if (reviews.length === 0) {
        return <p className="text-lg text-text-secondary">This mentor has no reviews yet.</p>;
    }

    return (
        <div className="space-y-6">
            {reviews.map(review => (
                <div key={review._id} className="p-6 bg-white rounded-lg border">
                    <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} className="text-amber-500 fill-current" />)}
                        <p className="ml-3 font-serif font-bold text-primary">{review.student.fullName}</p>
                    </div>
                    <p className="italic text-text-secondary">"{review.comment}"</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;