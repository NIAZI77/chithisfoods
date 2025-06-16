import { X, Star, MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "@/app/orders/[id]/components/dialog";
import Spinner from "@/app/components/Spinner";

const ReviewDialog = ({
  isOpen,
  onOpenChange,
  selectedDish,
  selectedRating,
  setSelectedRating,
  reviewText,
  setReviewText,
  isRating,
  onRatingSubmit,
}) => {
  const renderRatingStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && setSelectedRating(index + 1)}
        className={`${interactive ? "cursor-pointer" : ""}`}
        disabled={!interactive || isRating}
      >
        <Star
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          } ${interactive ? "hover:text-yellow-400" : ""}`}
        />
      </button>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-[85%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white mx-auto">
        <DialogHeader className="space-y-2 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-2.5">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              Review Dish
            </DialogTitle>
            <DialogPrimitive.Close className="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </DialogPrimitive.Close>
          </div>
          <p className="text-sm sm:text-base text-gray-500">
            Share your experience with {selectedDish?.name}
          </p>
        </DialogHeader>

        <div className="p-4 space-x-2 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              Your Rating
            </label>
            <div className="flex gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl items-center justify-center">
              {renderRatingStars(selectedRating, true)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience with this dish..."
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg sm:rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 h-[80px] sm:h-[100px] placeholder:text-gray-400"
              rows={3}
              disabled={isRating}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-2 sticky bottom-0 bg-white border-t">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
            disabled={isRating}
          >
            Cancel
          </button>
          <button
            onClick={onRatingSubmit}
            disabled={isRating || selectedRating === 0}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-rose-500 text-white rounded-lg sm:rounded-xl transition-colors hover:bg-rose-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-2.5"
          >
            {isRating ? (
              <Spinner />
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Review
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog; 