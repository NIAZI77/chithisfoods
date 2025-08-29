import ImageUpload from './ImageUpload';

const CategoryImageUpload = ({ onImageUpload, onImageRemove, currentImageUrl, disabled = false }) => {
  return (
    <ImageUpload
      onImageUpload={onImageUpload}
      onImageRemove={onImageRemove}
      currentImageUrl={currentImageUrl}
      label="Category Image"
      required={true}
      showRequired={false} // No asterisk
      aspectRatio="aspect-square"
      maxSize={5}
      className="w-full"
      disabled={disabled}
      customStyles={{
        backgroundColor: '#fdf2f8', // pink-50
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #fce7f3', // pink-200
        boxShadow: '0 1px 3px 0 rgba(236, 72, 153, 0.1)'
      }}
    />
  );
};

export default CategoryImageUpload;
