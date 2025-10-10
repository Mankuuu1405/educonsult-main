import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext'; 

const ReviewForm = ({ bookingId, onSubmitReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
     const { addToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !comment) {
            // alert('Please provide a rating and a comment.');
            addToast('Please provide a rating and a comment.', 'error');
            return;
        }
        onSubmitReview({ bookingId, rating, comment });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Leave a Review for this Session</h3>
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <label key={ratingValue}>
                            <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} className="hidden" />
                            <Star 
                                onMouseEnter={() => setHover(ratingValue)} 
                                onMouseLeave={() => setHover(0)}
                                className={`cursor-pointer transition-colors ${ratingValue <= (hover || rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                                size={28} 
                            />
                        </label>
                    );
                })}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows="4"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
            />
            <button type="submit" className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;