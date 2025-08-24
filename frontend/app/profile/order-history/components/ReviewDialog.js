import { useState } from "react";
import { Star, MessageSquare, Send, X, AlertCircle, ChefHat } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Spinner from "@/app/components/Spinner";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

function ReviewDialog({ 
  isOpen, 
  onClose, 
  selectedDish, 
  onSubmit, 
  isLoading,
  userData,
  getCurrentUserId,
  hasUserReviewedDish
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (rating === 0) {
      setError("Please select a rating");
      return false;
    }
    if (reviewText.trim().length === 0) {
      setError("Please write a review");
      return false;
    }
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setError("");

      
      // Validate that we have the required dish information
      if (!selectedDish.name) {
        throw new Error("Dish name is missing");
      }
      
      // Use utility function for consistent userId check
      const currentUserId = getCurrentUserId ? getCurrentUserId() : (userData?.id || userData?.email || userData?.username || getCookie("user"));
      
      if (!currentUserId) {
        throw new Error("Unable to identify user. Please refresh the page and try again.");
      }
      
      // Create the review data structure with userId
      const reviewData = {
        dishId: selectedDish.id, // Use the numeric ID from the dish data
        dishName: selectedDish.name,
        rating: rating,
        text: reviewText.trim(),
        createdAt: new Date().toISOString(),
        userId: currentUserId
      };
      
      
      
      await onSubmit(reviewData);
      
      // Reset form on successful submission
      setRating(0);
      setReviewText("");
      setError("");
      
      // Don't show success message here - parent component handles it
      // toast.success("Review submitted successfully!");
      
    } catch (error) {
      console.error("Review submission error:", error);
      const errorMessage = error.message || "Failed to submit review. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setRating(0);
    setReviewText("");
    setError("");
    onClose();
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (error && error.includes("rating")) {
      setError("");
    }
  };

  const handleReviewTextChange = (text) => {
    setReviewText(text);
    if (error && error.includes("review")) {
      setError("");
    }
  };

  const renderRatingStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => handleRatingChange(index + 1)}
        className="group cursor-pointer transition-all duration-300 transform hover:scale-110"
        disabled={isLoading}
        type="button"
        aria-label={`Rate ${index + 1} stars`}
      >
        <Star
          className={`w-6 h-6 ${
            index < rating 
              ? "text-amber-400 fill-current" 
              : "text-gray-300 group-hover:text-amber-200"
          } transition-all duration-300`}
        />
      </button>
    ));
  };

  if (!selectedDish) return null;

  // Use utility function for consistent check
  const currentUserId = getCurrentUserId ? getCurrentUserId() : (userData?.id || userData?.email || userData?.username || getCookie("user"));
  const userHasReviewed = hasUserReviewedDish ? hasUserReviewedDish(selectedDish) : 
    selectedDish.reviews?.some(review => 
      review.userId === currentUserId || 
      review.userId === userData?.id ||
      review.userId === userData?.email ||
      review.userId === userData?.username ||
      review.userId === getCookie("user")
    );

  if (userHasReviewed) {
    return (
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-sm w-[90vw] p-0 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Already Reviewed
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Thank you for your feedback! You can only review each dish once.
            </p>
            
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              type="button"
            >
              Close
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md w-[90vw] p-0 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-rose-500 p-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-white" />
              <AlertDialogTitle className="text-lg font-semibold">
                Review 
              </AlertDialogTitle>
            </div>
            <button
              onClick={handleClose}
              className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              type="button"
              aria-label="Close review dialog"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dish Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedDish.image?.url || selectedDish.image || "/fallback.png"}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/fallback.png";
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{selectedDish.name}</h4>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Your Rating
            </label>
            <div className="flex gap-1 p-3 items-center justify-center">
              {renderRatingStars()}
            </div>
     
          </div>
          
          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => handleReviewTextChange(e.target.value)}
              placeholder="Share your thoughts about this dish... (minimum 10 characters)"
              className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white h-[80px] placeholder:text-gray-400 transition-all duration-200"
              rows={3}
              disabled={isLoading}
              maxLength={500}
              minLength={10}
            />
            <div className="text-xs text-gray-400 text-right">
              {reviewText.length}/500
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoading}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0 || reviewText.trim().length < 10}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg transition-colors hover:bg-rose-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            type="button"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ReviewDialog;
