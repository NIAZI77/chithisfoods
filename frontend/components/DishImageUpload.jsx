import ImageUpload from './ImageUpload';

const DishImageUpload = ({ onImageUpload, onImageRemove, currentImageUrl, disabled = false }) => {
  return (
    <ImageUpload
      onImageUpload={onImageUpload}
      onImageRemove={onImageRemove}
      currentImageUrl={currentImageUrl}
      label="Dish Image"
      required={true}
      showRequired={false} // No asterisk
      aspectRatio="aspect-video"
      maxSize={5}
      className="md:w-[50%] w-full mx-auto"
      disabled={disabled}
      customStyles={{
        backgroundColor: '#f8fafc', // slate-50
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0' // slate-200
      }}
    />
  );
};

export default DishImageUpload;
