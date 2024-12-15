import Image from 'next/image';
import { FaStar,FaHardHat } from 'react-icons/fa';

const VendorCard = ({ vendor }) => {

  return (
    <div className="max-w-72 w-72 h-84 max-h-84 bg-orange-50 rounded-lg shadow-md p-4 relative">
      {vendor.isTopRated && <div className='w-32 h-6 bg-pink-600 px-3 font-bold text-white text-sm flex items-center absolute top-6 left-5'
        style={{ clipPath: 'polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 0 0)' }} >
       <FaHardHat className="pr-2" /> Top Rated
      </div>}
      <div className="mb-4">
        <img height={100} width={100}
          src={vendor.coverImage.formats.thumbnail.url}
          alt={`${vendor.name} profile`}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      </div>

      <div className="flex items-center mb-4">
        <Image height={100} width={100}
          src={vendor.logo.url}
          alt={`${vendor.name} profile`}
          className="w-20 h-20 rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="text-lg font-bold">{vendor.name}</h2>
          <p className="text-sm text-gray-500">{vendor.location.city},{vendor.location.state},{vendor.location.country}</p>
          <p className="text-sm text-gray-500 font-semibold">{vendor.isVegetarian ? "Vegetarian" : "non-Vegetarian"}</p>

          <div className="flex items-center space-x-2">
            <FaStar className='text-yellow-400' />
            <p className='text-yellow-500 font-semibold'>{vendor.ratting}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-4">

      </div>
    </div>
  );
};

export default VendorCard;