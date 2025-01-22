import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProductReviewPopup = ({
  isOpen,
  onClose,
  vendorId,
  productId,
  userName,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendor, setVendor] = useState(null);
  const router = useRouter();

  const review = {
    product_id: productId,
    user_name: userName,
    rating,
    text: reviewText,
    date: new Date().toLocaleDateString("en-GB"),
  };

  const handleRatingChange = (newRating) => {
    setRating(Math.floor(newRating)); // Ensure rating is an integer
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const fetchVendor = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}?populate=*`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error.message || "Error fetching vendor data.");
      } else {
        setVendor(data.data);
      }
    } catch (error) {
      toast.error("Error fetching vendor data.");
      console.error(error);
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
  };

  const updateVendorRating = (menu) => {
    const totalRating = menu.reduce((sum, dish) => {
      const avgRating = dish.reviews ? getAverageRating(dish.reviews) : 0;
      return sum + avgRating;
    }, 0);
    const fmenu = menu.filter(
      (dish) => dish.reviews && dish.reviews.length > 0
    );
    return parseFloat((totalRating / fmenu.length).toFixed(1));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!rating || !reviewText || !userName) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedMenu = vendor?.menu?.map((dish) => {
        if (dish.id === productId) {
          const updatedReviews = dish.reviews
            ? [...dish.reviews, review]
            : [review];
          const avgRating = getAverageRating(updatedReviews);
          return {
            ...dish,
            reviews: updatedReviews,
            rating: avgRating,
          };
        }
        return dish;
      });

      const updatedVendorRating = updateVendorRating(updatedMenu);
      const isTopRated = updatedVendorRating > 4;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              menu: updatedMenu,
              rating: updatedVendorRating,
              isTopRated,
            },
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Dish Reviewed Successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.error.message || "An error occurred");
      }
    } catch (error) {
      console.error("An error occured", error);
      toast.error("An error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getCookie = (name) => {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    };

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }

    fetchVendor();
  }, [router, vendorId]);

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96 max-w-full">
          <h2 className="text-xl font-bold text-center mb-4">Feedback</h2>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <div className="flex items-center justify-around">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={reviewText}
                onChange={handleReviewTextChange}
                rows="4"
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Write your review"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-bold ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductReviewPopup;
