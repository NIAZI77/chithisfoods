import ImageUpload from './ImageUpload';

const ProfileImageUpload = ({ onImageUpload, onImageRemove, currentImageUrl, disabled = false }) => {
  return (
    <ImageUpload
      onImageUpload={onImageUpload}
      onImageRemove={onImageRemove}
      currentImageUrl={currentImageUrl}
      label="Profile Avatar"
      required={false}
      showRequired={false}
      aspectRatio="aspect-square"
      maxSize={5}
      className="w-full"
      disabled={disabled}
      customStyles={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #f3f4f6', // gray-100
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};

export default ProfileImageUpload;
