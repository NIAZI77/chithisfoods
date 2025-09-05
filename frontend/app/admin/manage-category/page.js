"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Edit2, Trash2 } from "lucide-react";
import CategoryForm from "../global-settings/components/CategoryForm";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

// Utility functions
const toKebabCase = (str) =>
  str &&
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

const Page = () => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (AdminJWT || AdminUser) {
      const isAdmin = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AdminJWT}`,
            },
          }
        );
        const data = await response.json();
        if (data.isAdmin) {
          fetchCategories();
          return;
        } else {
          toast.error("Sorry, you don't have permission to access this page.");
          deleteCookie("AdminJWT");
          deleteCookie("AdminUser");
          router.push("/admin/login");
          return;
        }
      };
      isAdmin();
    } else {
      toast.error("Please sign in to continue.");
      router.push("/admin/login");
    }
  }, [router]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?populate=*&sort=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(
        "We're having trouble loading categories right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = (documentId) => {
    setCategoryToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories/${categoryToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((cat) => cat.documentId !== categoryToDelete)
      );
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success("Great! The category has been deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        "We couldn't delete the category right now. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryFormSave = async (formData) => {
    try {
      setIsSaving(true);
      const kebabCategory = {
        ...formData,
        name: toKebabCase(formData.name),
        subcategories: formData.subcategories.map((sub) => ({
          name: toKebabCase(sub.name),
          subSubcategories: sub.subSubcategories.map(toKebabCase),
        })),
      };

      const payload = {
        name: kebabCategory.name,
        subcategories: kebabCategory.subcategories,
      };

      // Handle image data properly
      if (kebabCategory.image?.id) {
        // New image uploaded or existing image preserved
        payload.image = kebabCategory.image.id;
      } else if (formData.documentId && selectedCategory?.image?.id) {
        // Editing existing category, keep existing image if no new image provided
        payload.image = selectedCategory.image.id;
      }

      const url = formData.documentId
        ? `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories/${formData.documentId}`
        : `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories`;

      const response = await fetch(url, {
        method: formData.documentId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to save category");
      }

      const updatedData = await response.json();

      // For updates, fetch the complete category data with populated image
      if (formData.documentId) {
        try {
          const fetchResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories/${formData.documentId}?populate=*`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (fetchResponse.ok) {
            const completeData = await fetchResponse.json();
            setCategories((prev) =>
              prev.map((cat) =>
                cat.documentId === formData.documentId ? completeData.data : cat
              )
            );
          } else {
            // Fallback to using the update response data
            setCategories((prev) =>
              prev.map((cat) =>
                cat.documentId === formData.documentId ? updatedData.data : cat
              )
            );
          }
        } catch (fetchError) {
          console.error("Error fetching updated category:", fetchError);
          // Fallback to using the update response data
          setCategories((prev) =>
            prev.map((cat) =>
              cat.documentId === formData.documentId ? updatedData.data : cat
            )
          );
        }
      } else {
        // For new categories, add to the beginning of the list
        setCategories((prev) => [updatedData.data, ...prev]);
      }

      handleFormClose();
      toast.success(
        formData.documentId
          ? "Excellent! Category has been updated successfully"
          : "Perfect! New category has been created successfully"
      );
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("We couldn't save the category right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-6 pl-20">
      {/* Full-screen loading overlay for saving categories */}
      {isSaving && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
            <p className="text-lg text-gray-600 font-medium">
              Saving category...
            </p>
            <p className="text-sm text-gray-500">
              Please wait while we process your changes
            </p>
          </div>
        </div>
      )}

      {/* Full-screen loading overlay for deleting categories */}
      {isDeleting && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
            <p className="text-lg text-gray-600 font-medium">
              Deleting category...
            </p>
            <p className="text-sm text-gray-500">
              Please wait while we remove the category
            </p>
          </div>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteDialogOpen(open);
            if (!open) setCategoryToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="This will permanently remove the category and all its subcategories. This action cannot be reversed."
        confirmText="Delete Category"
        isLoading={isDeleting}
      />

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg">
            <Tag className="w-6 h-6 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Categories
          </h1>
        </div>

        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white transition-colors"
          disabled={isSaving}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.documentId || index}
            className="relative bg-white border border-gray-100 rounded-2xl p-6 animate-in fade-in-50 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Category Image Container */}
            <div className="relative w-full aspect-square rounded-2xl p-4 shadow-sm mb-4 overflow-hidden">
              <img
                src={category.image?.url || "/fallback.png"}
                alt={`${category.name || "category"} image`}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 rounded-xl" />

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-xs font-semibold text-gray-700">
                  {category.subcategories?.length || 0} sub
                </span>
              </div>
            </div>

            {/* Category Info */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold text-gray-800 capitalize leading-tight">
                {category.name?.replace(/-/g, " ")}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {category.subcategories?.length || 0} subcategories
              </p>

              {/* Subcategory Preview */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {category.subcategories.slice(0, 3).map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded-full border border-pink-100"
                    >
                      {sub.name?.replace(/-/g, " ")}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300 transition-all duration-200 font-medium"
                onClick={() => handleEdit(category)}
                disabled={isSaving}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 font-medium"
                onClick={() => handleDelete(category.documentId)}
                disabled={isSaving}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        initialData={selectedCategory}
        onSave={handleCategoryFormSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Page;
