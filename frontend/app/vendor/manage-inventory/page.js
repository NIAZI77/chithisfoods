"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export default function ManageInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dishes, setDishes] = useState([]);
  const router = useRouter();

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isAvailable = dish.available === true;
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Available" && isAvailable) ||
      (filterStatus === "Unavailable" && !isAvailable);
    return matchesSearch && matchesStatus;
  });

  const handleAddDish = () => router.push("/vendor/add-dish");

  const handleEdit = (id) => {
    toast.info("Redirecting to edit dish page...");
    router.push(`/vendor/edit-dish/${id}`);
  };

  const handleDelete = (id) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
    toast.success("Dish removed from your inventory.");
  };

  const toggleAvailability = (id) => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) =>
        dish.id === id ? { ...dish, available: !dish.available } : dish
      )
    );

    const updatedDish = dishes.find((dish) => dish.id === id);
    const newStatus = updatedDish?.available ? "unavailable" : "available";

    toast.success(`Dish "${updatedDish?.name}" is now marked as ${newStatus}.`);
  };

  const fetchInventory = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[email][$eq]=${email}&populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error("Failed to fetch");
      setDishes(json.data);
      console.log("Fetched dishes:", json.data);
      toast.success("Inventory loaded successfully.");
    } catch (error) {
      console.error("Inventory fetch failed:", error);
      toast.error("Unable to load inventory. Please try again later.");
    }
  };

  useEffect(() => {
    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    } else {
      fetchInventory(storedUser);
    }
  }, []);

  return (
    <div className="p-2 py-6 md:p-8 !pl-16 md:!pl-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-orange-600">
          Manage Inventory
        </h1>
        <button
          onClick={handleAddDish}
          className="bg-orange-500 text-white md:px-4 md:py-2 px-2 py-1 rounded-md font-medium flex items-center jusctrify-center gap-2 hover:bg-orange-600 transition-all"
        >
          <Plus /> Add Dish
        </button>
      </div>

      <section className="flex items-center justify-between gap-2 md:flex-row flex-col mb-4">
        <div className="flex flex-wrap gap-1 w-fit p-1 border-1 rounded-lg mb-4 md:p-2 md:border-2">
          {["All", "Available", "Unavailable"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`md:px-4 md:py-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                filterStatus === status
                  ? "bg-orange-100 text-orange-700"
                  : "bg-white text-gray-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search product..."
            className="border rounded-md px-4 py-2 w-full outline-orange-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-[800px] w-full text-sm text-left">
          <thead className="bg-orange-100">
            <tr className="h-12">
              <th className="text-left pl-3 w-24">ID</th>
              <th className="text-left pl-3 w-36">Name</th>
              <th className="text-left pl-3 w-28">Image</th>
              <th className="text-left pl-3 w-24">Price</th>
              <th className="text-left pl-3 w-24">Rating</th>
              <th className="text-left pl-3 w-32">Category</th>
              <th className="text-left pl-3 w-32">Subcategory</th>
              <th className="text-left pl-3 w-28">Available</th>
              <th className="text-left pl-3 w-28">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredDishes.length === 0 ? (
              <tr className="h-12">
                <td colSpan="9" className="p-4 text-center text-gray-400">
                  No matching dishes found.
                </td>
              </tr>
            ) : (
              filteredDishes.map((dish) => (
                <tr key={dish.id} className="border-b hover:bg-gray-50 h-12">
                  <td className="font-medium hover:underline hover:text-orange-400 pl-3">
                    {dish.id}
                  </td>
                  <td>{dish.name}</td>
                  <td>
                    <Image
                      src={dish.image?.url || "/placeholder.jpg"}
                      alt={dish.name}
                      height={40}
                      width={64}
                      priority
                      className="h-10 w-16 object-cover rounded-md"
                    />
                  </td>
                  <td>${dish.price?.toFixed(2)}</td>
                  <td>{dish.rating ?? 0}</td>
                  <td>{dish.category}</td>
                  <td>{dish.subcategory}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(dish.id)}
                      className={`relative w-12 h-6 flex items-center p-0.5 rounded-full transition-all shadow-md mx-auto ${
                        dish.available ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white ${
                          dish.available ? "translate-x-6" : "translate-x-0"
                        }`}
                      >
                        {dish.available ? (
                          <div className="w-3 h-3 border-2 border-black rounded-full"></div>
                        ) : (
                          <div className="w-3 h-0.5 bg-black"></div>
                        )}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex pl-4 gap-2">
                      <button
                        onClick={() => handleEdit(dish.id)}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(dish.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
