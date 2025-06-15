"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Edit2, Trash2 } from "lucide-react";
import CategoryForm from "./components/CategoryForm";
import TaxPercentage from "./components/TaxPercentage";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

// Utility functions
const toKebabCase = (str) =>
  str && str
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

    if (!AdminJWT || !AdminUser) {
      toast.error("Please login to continue.");
      router.push("/admin/login");
      return;
    }
    fetchCategories();
  }, []);

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
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again.');
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
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat.documentId !== categoryToDelete));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again.');
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
        method: formData.documentId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save category');
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
            setCategories(prev =>
              prev.map(cat =>
                cat.documentId === formData.documentId ? completeData.data : cat
              )
            );
          } else {
            // Fallback to using the update response data
            setCategories(prev =>
              prev.map(cat =>
                cat.documentId === formData.documentId ? updatedData.data : cat
              )
            );
          }
        } catch (fetchError) {
          console.error('Error fetching updated category:', fetchError);
          // Fallback to using the update response data
          setCategories(prev =>
            prev.map(cat =>
              cat.documentId === formData.documentId ? updatedData.data : cat
            )
          );
        }
      } else {
        // For new categories, add to the beginning of the list
        setCategories(prev => [updatedData.data, ...prev]);
      }

      handleFormClose();
      toast.success(formData.documentId ? 'Category updated successfully' : 'Category created successfully');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pl-20">
      {/* Full-screen loading overlay for saving categories */}
      {isSaving && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
            <p className="text-lg text-gray-600 font-medium">Saving category...</p>
            <p className="text-sm text-gray-500">Please wait while we process your changes</p>
          </div>
        </div>
      )}

      {/* Full-screen loading overlay for deleting categories */}
      {isDeleting && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
            <p className="text-lg text-gray-600 font-medium">Deleting category...</p>
            <p className="text-sm text-gray-500">Please wait while we remove the category</p>
          </div>
        </div>
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteDialogOpen(open);
            if (!open) setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600 mt-2">
              This will permanently remove the category and all its subcategories. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel
              className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg">
            <Tag className="w-6 h-6 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Global Settings</h1>
        </div>

      </div>

      {/* Tax Percentage Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-6">
          <TaxPercentage />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories Management</h2>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white transition-colors"
            disabled={isSaving}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.documentId || index}
              className="border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-pink-200 animate-in fade-in-50 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 bg-pink-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <Image
                    src={category.image?.url || '/fallback.png'}
                    alt={`${category.name || 'category'} image`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800 capitalize">{category.name?.replace(/-/g, ' ')}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.subcategories?.length || 0} subcategories
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                  onClick={() => handleEdit(category)}
                  disabled={isSaving}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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
