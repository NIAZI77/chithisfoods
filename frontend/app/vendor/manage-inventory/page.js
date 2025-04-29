"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const sampleData = [
  {
    id: "302012",
    name: "Green Beans",
    image: "/baryani.jpeg",
    price: 121.0,
    rating: 4.3,
    category: "Vegetables",
    subcategory: "Organic",
    available: true,
  },
  {
    id: "302011",
    name: "Carrot Mix",
    image: "/baryani.jpeg",
    price: 590.0,
    rating: 4.7,
    category: "Vegetables",
    subcategory: "Organic",
    available: true,
  },
  {
    id: "302002",
    name: "Organic Spinach",
    image: "/baryani.jpeg",
    price: 125.0,
    rating: 4.5,
    category: "Vegetables",
    subcategory: "Leafy Greens",
    available: false,
  },
  {
    id: "301901",
    name: "Bell Peppers",
    image: "/baryani.jpeg",
    price: 348.0,
    rating: 4.6,
    category: "Vegetables",
    subcategory: "Sweet Peppers",
    available: true,
  },
  {
    id: "301643",
    name: "Broccoli Florets",
    image: "/baryani.jpeg",
    price: 760.0,
    rating: 4.8,
    category: "Vegetables",
    subcategory: "Cruciferous",
    available: true,
  },
];

export default function ManageInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const router = useRouter();

  const filteredData = sampleData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Available" && item.available) ||
      (filterStatus === "Out of Stock" && !item.available);
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    true: "bg-green-100 text-green-700",
    false: "bg-gray-200 text-gray-700",
  };

  const handleAddDish = () => {
    router.push("/vendor/add-dish")
  };

  const handleEdit = (id) => {
    alert(`Dish with ID ${id} has been successfully updated.`);
  };

  const handleDelete = (id) => {
    alert(`Dish with ID ${id} has been removed from your inventory.`);
  };

  return (
    <div className="p-2 py-6 md:p-8 !pl-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-orange-600">
          Manage Inventory
        </h1>
        <button
          onClick={handleAddDish}
          className="bg-orange-500 text-white md:px-4 md:py-2 px-2 py-1 rounded-md font-medium"
        >
          + Add Dish
        </button>
      </div>

      <section className="flex items-center justify-between gap-2 md:flex-row flex-col mb-4">
        <div className="flex flex-wrap gap-1 w-fit p-1 border-1 rounded-lg mb-4 md:p-2 md:border-2">
          {["All", "Available", "Out of Stock"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`md:px-4 md:py-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                filterStatus === status
                  ? "bg-orange-100 text-orange-700"
                  : "bg-white text-gray-600"
              }`}
            >
              {status === "All" ? "All Dishes" : status}
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
            {filteredData.length === 0 ? (
              <tr className="h-12">
                <td colSpan="9" className="p-4 text-center text-gray-400">
                  No matching dishes found.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 h-12">
                  <td className="font-medium hover:underline hover:text-orange-400 pl-3">
                    {item.id}
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <Image
                      src={item.image}
                      alt={item.name}
                      height={40}
                      width={64}
                      priority={true}
                      className="h-10 w-16 object-cover rounded-md"
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.rating}</td>
                  <td>{item.category}</td>
                  <td>{item.subcategory}</td>
                  <td>
                    <span
                      className={`inline-block min-w-[80px] text-center px-2 py-1 w-28 rounded-md text-xs font-semibold ${
                        statusStyles[item.available]
                      }`}
                    >
                      {item.available ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div className="flex pl-4 gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
