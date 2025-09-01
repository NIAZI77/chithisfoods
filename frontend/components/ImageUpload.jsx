import { useState } from "react";
import { Upload, X, Image } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import { toast } from "react-toastify";

const ImageUpload = ({
  onImageUpload,
  onImageRemove,
  currentImageUrl = null,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5, // in MB
  className = "",
  disabled = false,
  required = false,
  aspectRatio = "aspect-video", // or "aspect-square", "aspect-[4/3]", etc.
  uploadEndpoint = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`,
  uploadToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  showRequired = false, // New prop to control asterisk display
  customStyles = {} // New prop for custom styling
}) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(currentImageUrl);

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("files", file);

    try {
      setUploading(true);
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${uploadToken}`,
        },
        body: form,
      });

      if (!res.ok) {
        toast.error("Image upload didn't work. Let's try again!");
        return null;
      }

      const data = await res.json();
      const { id, url, name } = data[0];
      const fullUrl = new URL(url, process.env.NEXT_PUBLIC_STRAPI_HOST).href;

      toast.success("Perfect! Your image is now uploaded.");
      return { id, url: fullUrl, name };
    } catch (err) {
      toast.error("Image upload failed. Let's try again!");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Image size must be less than ${maxSize}MB`);
        return;
      }

      // Upload the image immediately
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        setImagePreview(uploadedImage.url);
        onImageUpload(uploadedImage);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageRemove();
  };

  return (
    <div className={`space-y-2 ${className} flex flex-col items-center`} style={customStyles}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Image className="w-4 h-4 text-green-500" />
        {label} {required && showRequired && <span className="text-red-500">*</span>}
      </label>

      {!imagePreview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center w-3/4">
          <input
            type="file"
            accept={accept}
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
            disabled={disabled || uploading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <Spinner />
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
            <span className="text-xs text-gray-600">
              {uploading ? "Uploading..." : "Click to upload an image"}
            </span>
            <span className="text-xs text-gray-400">
              Max size: {maxSize}MB • JPG, PNG, GIF
            </span>
          </label>
        </div>
      ) : (
        <div className="relative flex justify-center bg-transparent">
          <div className="relative bg-transparent">
            <img
              src={imagePreview}
              alt="Image preview"
              className={`w-1/2 ${aspectRatio} m-auto object-contain rounded-lg border border-gray-200 bg-transparent`}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
