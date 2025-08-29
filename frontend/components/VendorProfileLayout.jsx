import { useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";

const VendorProfileLayout = ({ 
  onCoverImageUpload, 
  onCoverImageRemove, 
  onAvatarUpload, 
  onAvatarRemove,
  currentCoverImageUrl = null,
  currentAvatarUrl = null,
  disabled = false 
}) => {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const uploadImage = async (file, type) => {
    const form = new FormData();
    form.append("files", file);

    try {
      if (type === 'cover') {
        setUploadingCover(true);
      } else {
        setUploadingAvatar(true);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
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
      if (type === 'cover') {
        setUploadingCover(false);
      } else {
        setUploadingAvatar(false);
      }
    }
  };

  const handleCoverImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const uploadedImage = await uploadImage(file, 'cover');
      if (uploadedImage) {
        onCoverImageUpload(uploadedImage);
      }
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const uploadedImage = await uploadImage(file, 'avatar');
      if (uploadedImage) {
        onAvatarUpload(uploadedImage);
      }
    }
  };

  const removeCoverImage = () => {
    onCoverImageRemove();
  };

  const removeAvatar = () => {
    onAvatarRemove();
  };

  return (
    <div className="relative w-full">
      {/* Cover Image Area */}
      <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
        {currentCoverImageUrl ? (
          <>
            <img
              src={currentCoverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeCoverImage}
              disabled={disabled || uploadingCover}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Camera className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm text-gray-500">Cover Image</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={disabled || uploadingCover}
            />
            {uploadingCover && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Avatar - Circular and overlapping */}
      <div className="absolute -bottom-8 left-8">
        <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {currentAvatarUrl ? (
            <>
              <img
                src={currentAvatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeAvatar}
                disabled={disabled || uploadingAvatar}
                className="absolute bottom-1 right-7 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 border-2 border-white"
              >
                <Camera className="w-3 h-3 text-gray-600" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Camera className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-xs text-gray-500">Avatar</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={disabled || uploadingAvatar}
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <Spinner />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileLayout;
