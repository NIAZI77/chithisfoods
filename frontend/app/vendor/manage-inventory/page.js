"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Edit, Plus, Trash2, AlertTriangle, ChefHat, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingAvailability, setchangingAvailability] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [bulkActionMessage, setBulkActionMessage] = useState("");
  const [deletingDish, setDeletingDish] = useState(false);
  const router = useRouter();

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isAvailable = dish.available === true;
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Available" && isAvailable) ||
      (filterStatus === "Unavailable" && !isAvailable);
    return matchesSearch && matchesStatus;
  });

  const fetchInventory = async (email) => {
    setLoadingMenu(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[email][$eq]=${email}&sort=createdAt:desc&populate=*&pagination[limit]=9999999999`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error();

      const json = await res.json();
      setDishes(json.data);
    } catch {
      toast.error("Failed to load inventory.");
    } finally {
      setLoadingMenu(false);
    }
  };

  const toggleAvailability = async (id, currentAvailability) => {
    setchangingAvailability(true);
    try {
      const updated = !currentAvailability;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: { available: updated } }),
        }
      );
      if (!res.ok) throw new Error();

      fetchInventory(getCookie("user"));
      toast.success(`Dish marked as ${updated ? "available" : "unavailable"}.`);
    } catch {
      toast.error("Update failed. Please try again.");
    } finally {
      setchangingAvailability(false);
    }
  };

  const handleDelete = async (id) => {
    setDishToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeletingDish(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error();

      fetchInventory(getCookie("user"));
      toast.success("Dish deleted.");
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeletingDish(false);
      setDeleteDialogOpen(false);
      setDishToDelete(null);
    }
  };

  const handleEdit = (id) => {
    router.push(`/vendor/edit-dish/${id}`);
  };

  const handleAddDish = () => {
    router.push("/vendor/add-dish");
  };

  const setAllAvailable = async () => {
    if (dishes.length === 0) {
      toast.info("No dishes to update.");
      return;
    }

    setchangingAvailability(true);
    setBulkActionMessage("Setting all dishes as Available");
    try {
      const updatePromises = dishes.map(dish =>
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dish.documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: { available: true } }),
        })
      );

      await Promise.all(updatePromises);
      fetchInventory(getCookie("user"));
      toast.success("All dishes marked as available.");
    } catch {
      toast.error("Failed to update all dishes. Please try again.");
    } finally {
      setchangingAvailability(false);
      setBulkActionMessage("");
    }
  };

  const setAllUnavailable = async () => {
    if (dishes.length === 0) {
      toast.info("No dishes to update.");
      return;
    }

    setchangingAvailability(true);
    setBulkActionMessage("Setting all dishes as Unavailable");
    try {
      const updatePromises = dishes.map(dish =>
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dish.documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: { available: false } }),
        })
      );

      await Promise.all(updatePromises);
      fetchInventory(getCookie("user"));
      toast.success("All dishes marked as unavailable.");
    } catch {
      toast.error("Failed to update all dishes. Please try again.");
    } finally {
      setchangingAvailability(false);
      setBulkActionMessage("");
    }
  };

  useEffect(() => {
    const jwt = getCookie("jwt");
    const email = getCookie("user");

    if (!jwt || !email) {
      router.push("/login");
    } else {
      setLoading(true);
      fetchInventory(email);
      setLoading(false);
    }
  }, [router]);
  if (loading) return <Loading />;
  return (
    <div className="p-2 py-6 md:p-8 !pl-16 md:!pl-24">
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Delete Dish
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600 mt-2">
              This will permanently remove the dish from your menu. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Dish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Loading Overlay */}
      {changingAvailability && bulkActionMessage && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-50 rounded-lg p-8 max-w-md mx-4 text-center shadow-md">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {bulkActionMessage}
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we update your dishes...
            </p>
          </div>
        </div>
      )}

      {/* Delete Loading Overlay */}
      {deletingDish && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-50 rounded-lg p-8 max-w-md mx-4 text-center shadow-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Deleting Dish
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we remove the dish from your menu...
            </p>
          </div>
        </div>
      )}

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
      <div className="flex gap-2 my-2 items-center justify-end">
        <button
          onClick={setAllAvailable}
          className="bg-emerald-500 text-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md font-medium flex items-center justify-center gap-1 md:gap-2 hover:bg-emerald-600 transition-all"
          disabled={changingAvailability}
        >
          <ChefHat className="h-3 w-3 md:h-4 md:w-4" /> Set All Available
        </button>
        <button
          onClick={setAllUnavailable}
          className="bg-rose-500 text-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md font-medium flex items-center justify-center gap-1 md:gap-2 hover:bg-rose-600 transition-all"
          disabled={changingAvailability}
        >
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" /> Set All Unavailable
        </button>
      </div>
      <section className="flex items-center justify-between gap-2 md:flex-row flex-col mb-4">
        <div className="flex flex-wrap gap-1 w-fit p-1 border-1 rounded-lg mb-4 md:p-2 md:border-2">
          {["All", "Available", "Unavailable"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`md:px-4 md:py-1.5 px-2 py-1 rounded-md text-xs font-medium ${filterStatus === status
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
          <thead className="bg-slate-100 p-2">
            <tr className="h-12">
              <th className="text-left px-3 w-36">Name</th>
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
            {loadingMenu ? (
              <tr className="h-12">
                <td colSpan="9" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-orange-600 mb-2 capitalize">
                      Loading your dishes...
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Please wait while we fetch your menu items
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredDishes.length === 0 ? (
              <tr className="h-12">
                <td colSpan="9" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <ChefHat className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize text-orange-600">
                      No dishes found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 max-w-md">
                      {searchTerm || filterStatus !== "All"
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "Get started by adding your first dish to your menu."
                      }
                    </p>
                    {!searchTerm && filterStatus === "All" && (
                      <button
                        onClick={handleAddDish}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-orange-600 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Add Your First Dish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredDishes.map((dish) => (
                <tr key={dish.id} className="border-b hover:bg-gray-50 h-12">
                  <td className="pl-3 capitalize hover:text-orange-400 hover:underline transition-all">
                    <Link href={`/dish/${dish.documentId}`}>{dish.name}</Link>
                  </td>
                  <td>
                    <img
                      src={dish.image?.url || "/placeholder.jpg"}
                      alt={dish.name}
                      className="h-10 w-16 object-cover rounded-md"
                    />
                  </td>
                  <td>${dish.price?.toFixed(2) || "0.00"}</td>
                  <td className="pl-5">{dish.rating.toFixed(2) ?? 0.0}</td>
                  <td className="capitalize">
                    {dish.category.replace("-", " ") || "-"}
                  </td>
                  <td className="capitalize">
                    {dish.subcategory.replace("-", " ") || "-"}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        toggleAvailability(dish.documentId, dish.available)
                      }
                      className={`relative w-12 h-6 flex items-center p-0.5 rounded-full transition-all shadow-md mx-auto ${dish.available ? "bg-emerald-500" : "bg-rose-500"
                        } ${changingAvailability
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                      disabled={changingAvailability}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white ${dish.available ? "translate-x-6" : "translate-x-0"
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
                        onClick={() => handleEdit(dish.documentId)}
                        className={`text-orange-500 hover:text-orange-700
                        ${changingAvailability || deletingDish
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        disabled={changingAvailability || deletingDish}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(dish.documentId)}
                        className={`text-orange-500 hover:text-orange-700
                          ${changingAvailability || deletingDish
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        disabled={changingAvailability || deletingDish}
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
