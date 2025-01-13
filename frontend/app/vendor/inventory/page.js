"use client";

import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Loading from "@/app/loading";

export default function MenuPage() {
  const [dishData, setDishData] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function getCookie(name) {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    }

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }

    const fetchVendorData = async (email) => {
      setLoading(true);
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
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
          const vendorData = data.data[0];
          if (vendorData.length == 0) {
            router.push("/become-vendor");
          } else {
            setFormData(vendorData);
            setDishData(vendorData.menu || []);
          }
        }
      } catch (error) {
        toast.error("Error fetching vendor data.");
        console.error(error);
      }
      setLoading(false);
    };

    if (storedUser) {
      fetchVendorData(storedUser);
    }
  }, [router]);
  if (loading) {
    return <Loading />;
  }
  const deleteDish = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dish?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${formData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              menu: dishData.filter((dish) => dish.id !== id),
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Dish Deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  const handleDayToggle = (dishIndex, day) => {
    setDishData((prevDishes) => {
      const updatedDishes = [...prevDishes];
      const dayIndex = updatedDishes[dishIndex].available_days.indexOf(day);
      if (dayIndex === -1) {
        updatedDishes[dishIndex].available_days.push(day);
      } else {
        updatedDishes[dishIndex].available_days.splice(dayIndex, 1);
      }
      return updatedDishes;
    });
  };

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <ToastContainer />
      <div className="p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">My Menu</h1>

        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-medium">
              Dish Catalogue ({dishData.length})
            </h2>
          </div>

          {dishData.map((dish, index) => (
            <div key={index} className="border-b py-4 last:border-b-0">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="border p-2 text-gray-400 w-full md:w-40">
                  {dish.image && dish.image.url ? (
                    <img
                      src={dish.image.url}
                      alt={dish.name}
                      className="w-full h-20 object-cover"
                    />
                  ) : (
                    <span>Please Add Photo</span>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium">
                        {dish.name || "Dish Name"}
                      </h3>
                      <p className="text-gray-500">${dish.price}</p>
                    </div>
                    <div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        {dish.dish_availability}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {dish.description.substr(0, 30)}...
                  </p>
                  <div className="flex flex-wrap space-x-2 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <button
                          key={day}
                          onClick={() => handleDayToggle(index, day)}
                          className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${
                            dish.available_days.includes(day)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {day.slice(0, 1)}
                        </button>
                      )
                    )}
                  </div>
                  <div className="flex justify-end items-center mt-2 space-x-2">
                    <Link
                      href={`/vendor/editDish/${dish.id}`}
                      className="text-sm text-blue-500"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => deleteDish(dish.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link href={"/vendor/addDish"}>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">
              Add New Dish
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
