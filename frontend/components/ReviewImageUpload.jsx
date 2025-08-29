import ImageUpload from './ImageUpload';

const ReviewImageUpload = ({ onImageUpload, onImageRemove, currentImageUrl, disabled = false }) => {
  return (
    <ImageUpload
      onImageUpload={onImageUpload}
      onImageRemove={onImageRemove}
      currentImageUrl={currentImageUrl}
      label="Add Photo (Optional)"
      required={false}
      showRequired={false}
      aspectRatio="aspect-[4/3]"
      maxSize={5}
      className="w-full"
      disabled={disabled}
      customStyles={{
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb' // gray-200
      }}
    />
  );
};

export default ReviewImageUpload;
