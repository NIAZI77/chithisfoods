import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag, Layers, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const defaultFormData = {
  name: '',
  image: { id: 0, url: '' },
  subcategories: []
};

// Function to validate if string contains only letters and spaces
const isValidInput = (value) => {
  return /^[A-Za-z\s]*$/.test(value);
};

const CategoryForm = ({ isOpen, onClose, initialData = null, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: { id: null, url: '' },
    subcategories: [{ name: '', subSubcategories: [''] }],
  });
  const lastInputRef = useRef(null);
  const [focusSubcategoryIndex, setFocusSubcategoryIndex] = useState(null);

  useEffect(() => {
    if (initialData) {
      // Transform Strapi data to form format
      setFormData({
        documentId: initialData.documentId,
        name: initialData.name,
        image: {
          id: initialData.image?.id || null,
          url: initialData.image?.url || '',
        },
        subcategories: initialData.subcategories?.map(sub => ({
          name: sub.name,
          subSubcategories: sub.subSubcategories || [''],
        })) || [{ name: '', subSubcategories: [''] }],
      });
    } else {
      setFormData({
        name: '',
        image: { id: null, url: '' },
        subcategories: [{ name: '', subSubcategories: [''] }],
      });
    }
  }, [initialData]);

  // Focus the last sub-subcategory input for a subcategory after adding
  useEffect(() => {
    if (focusSubcategoryIndex !== null) {
      setTimeout(() => {
        // Select all sub-subcategory inputs for this subcategory
        const subInputs = document.querySelectorAll(
          `input[placeholder='Enter sub-subcategory'][data-subcategory-index='${focusSubcategoryIndex}']`
        );
        if (subInputs.length > 0) {
          subInputs[subInputs.length - 1].focus();
        }
        setFocusSubcategoryIndex(null);
      }, 0);
    }
  }, [formData, focusSubcategoryIndex]);

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("files", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        toast.error("Failed to upload image. Please try again.");
        return null;
      }

      const data = await res.json();
      const { id, url } = data[0];
      const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_HOST}${url}`;

      toast.success("Image uploaded successfully.");
      return { id, url: fullUrl };
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        setFormData(prev => ({ ...prev, image: uploadedImage }));
      }
    }
  };

  const addSubcategory = () => {
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: '', subSubcategories: [''] }]
    }));
  };

  const removeSubcategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const updateSubcategory = (index, value) => {
    if (!isValidInput(value)) {
      toast.error('Only letters and spaces are allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) =>
        i === index ? { ...sub, name: value } : sub
      )
    }));
  };

  const addSubSubcategory = (subcategoryIndex) => {
    const currentSubcategory = formData.subcategories[subcategoryIndex];
    const hasEmptySubSubcategories = currentSubcategory.subSubcategories.some(ss => !ss.trim());

    if (hasEmptySubSubcategories) {
      toast.error('Please fill in all existing sub-subcategories first');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) =>
        i === subcategoryIndex
          ? { ...sub, subSubcategories: [...sub.subSubcategories, ''] }
          : sub
      )
    }));
  };

  const removeSubSubcategory = (subcategoryIndex, subSubcategoryIndex) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) =>
        i === subcategoryIndex
          ? {
            ...sub,
            subSubcategories: sub.subSubcategories.filter((_, j) => j !== subSubcategoryIndex)
          }
          : sub
      )
    }));
  };

  const updateSubSubcategory = (subcategoryIndex, subSubcategoryIndex, value) => {
    if (!isValidInput(value)) {
      toast.error('Only letters and spaces are allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) =>
        i === subcategoryIndex
          ? {
            ...sub,
            subSubcategories: sub.subSubcategories.map((ss, j) =>
              j === subSubcategoryIndex ? value : ss
            )
          }
          : sub
      )
    }));
  };

  const handleKeyPress = (e, subcategoryIndex, subSubcategoryIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentSubcategory = formData.subcategories[subcategoryIndex];
      const currentValue = currentSubcategory.subSubcategories[subSubcategoryIndex].trim();
      // If not the last sub-subcategory, move to the next input
      if (subSubcategoryIndex < currentSubcategory.subSubcategories.length - 1) {
        if (!currentValue) {
          toast.error('Please enter a valid sub-subcategory name');
          return;
        }
        setTimeout(() => {
          const allInputs = document.querySelectorAll('input[type="text"]');
          const subInputs = Array.from(allInputs).filter(input => input.placeholder === 'Enter sub-subcategory');
          const baseIndex = subInputs.length * subcategoryIndex + subSubcategoryIndex;
          if (subInputs[baseIndex + 1]) {
            subInputs[baseIndex + 1].focus();
          }
        }, 0);
      } else {
        // If last sub-subcategory, only add a new one if all are filled and current is not empty
        const hasEmpty = currentSubcategory.subSubcategories.some(ss => !ss.trim());
        if (!hasEmpty && currentValue) {
          addSubSubcategory(subcategoryIndex);
          setFocusSubcategoryIndex(subcategoryIndex);
        }
        // If last input is empty, do nothing (no toast, no focus change)
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }

    if (!formData.image?.url) {
      toast.error('Category image is required');
      return;
    }

    // Validate subcategories
    const hasEmptySubcategories = formData.subcategories.some(
      sub => !sub.name.trim() || sub.subSubcategories.some(ss => !ss.trim())
    );

    if (hasEmptySubcategories) {
      toast.error('Please fill in all subcategory and sub-subcategory fields');
      return;
    }

    // Call onSave with formData including documentId and trimmed name
    if (onSave) {
      onSave({
        ...formData,
        name: trimmedName,
        documentId: initialData?.documentId || formData.documentId
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSaving) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto custom-scrollbar animate-in zoom-in-50 duration-200">
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ec4899;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #db2777;
          }
        `}</style>

        <DialogHeader>
          <DialogTitle className="text-pink-600 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {initialData ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <div className="p-1.5 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                  <Tag className="w-4 h-4 text-pink-600" />
                </div>
                Category Name
              </label>
              <Input
                id="name"
                value={formData.name.replace(/-/g, ' ')}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="category name"
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 capitalize"
              />
            </div>

            <div className="group">
              <label className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <div className="p-1.5 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                  <ImageIcon className="w-4 h-4 text-pink-600" />
                </div>
                Category Image
              </label>
              {formData.image?.url && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50 shadow-sm mx-auto border border-gray-200 hover:border-pink-300 transition-colors p-4 my-4">
                  <Image
                    src={formData.image.url}
                    alt="Category preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                </div>
              )}

              <input
                type="file"
                id="image"
                name="image"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              <label
                htmlFor="image"
                className="w-full border rounded-xl py-1 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-50 border-gray-200 hover:border-pink-300"
              >
                <div className="p-2 bg-pink-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                {formData.image?.url ? "Change Image" : "Upload Image"}
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-sm flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <div className="p-1.5 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                    <Layers className="w-4 h-4 text-pink-600" />
                  </div>
                  Subcategories
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubcategory}
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subcategory
                </Button>
              </div>

              {formData.subcategories.map((subcategory, index) => (
                <div key={index} className="space-y-2 p-4 border border-pink-100 rounded-lg hover:border-pink-200 transition-colors">
                  <div className="flex items-center gap-2">
                    <Input
                      value={subcategory.name}
                      onChange={(e) => updateSubcategory(index, e.target.value)}
                      placeholder="Enter subcategory name"
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 capitalize"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubcategory(index)}
                      className="text-pink-600 hover:bg-pink-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 pl-4">
                    {subcategory.subSubcategories.map((subSubcategory, ssIndex) => (
                      <div key={ssIndex} className="flex items-center gap-2">
                        <Input
                          value={subSubcategory}
                          onChange={(e) => updateSubSubcategory(index, ssIndex, e.target.value)}
                          placeholder="Enter sub-subcategory"
                          onKeyPress={(e) => handleKeyPress(e, index, ssIndex)}
                          className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 capitalize"
                          data-subcategory-index={index}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubSubcategory(index, ssIndex)}
                          className="text-pink-600 hover:bg-pink-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSubSubcategory(index)}
                      className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sub-subcategory
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Update' : 'Create'
              )} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm; 