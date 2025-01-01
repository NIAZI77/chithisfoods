"use client"; 
import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ name: '', price: 0, description: '', available: false });

  useEffect(() => {
    const sampleDishes = [
      {
        id: 1,
        name: 'Spaghetti Carbonara',
        price: 12.99,
        description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.',
        available: true,
        image: '/images/carbonara.jpg',
      },
      {
        id: 2,
        name: 'Margherita Pizza',
        price: 9.99,
        description: 'Traditional pizza with fresh mozzarella, tomatoes, and basil.',
        available: true,
        image: '/images/margherita.jpg',
      },
      {
        id: 3,
        name: 'Caesar Salad',
        price: 7.99,
        description: 'Crisp romaine lettuce, croutons, and Caesar dressing.',
        available: false,
        image: '/images/caesar_salad.jpg',
      },
    ];

    setDishes(sampleDishes);
  }, []);  

  useEffect(() => {
    function getCookie(name) {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    }

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");

    if (!storedJwt || !storedUser) {
      router.push("/login");
    }
  }, [router]);

  const handleAddDish = async () => {
    const newDishWithId = { ...newDish, id: Date.now() };
    setDishes([...dishes, newDishWithId]);
    setNewDish({ name: '', price: 0, description: '', available: false });
  };

  const handleDeleteDish = async (id) => {
    setDishes(dishes.filter((dish) => dish.id !== id));
  };

  return (
    <main className="ml-0 md:ml-64 p-6 transition-padding duration-300 bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Inventory Management</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Dish</h2>
          <input
            type="text"
            placeholder="Name"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            className="border border-gray-300 p-3 mb-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: parseFloat(e.target.value) })}
            className="border border-gray-300 p-3 mb-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Description"
            value={newDish.description}
            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            className="border border-gray-300 p-3 mb-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={newDish.available}
              onChange={(e) => setNewDish({ ...newDish, available: e.target.checked })}
              className="text-orange-600"
            />
            <span className="text-gray-700">Available</span>
          </label>
          <button
            onClick={handleAddDish}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
          >
            Add Dish
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dish Catalogue</h2>
          <table className="table-auto w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Available</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-gray-100 transition-all">
                  <td className="px-6 py-4">
                    <img
                      src={dish.image || '/placeholder.jpg'}
                      alt={dish.name}
                      className="h-16 w-16 object-cover rounded-md shadow-md"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{dish.name}</td>
                  <td className="px-6 py-4 text-gray-700">${dish.price}</td>
                  <td className="px-6 py-4 text-gray-600">{dish.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        dish.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {dish.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
