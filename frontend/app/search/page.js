"use client";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "../loading";
import VendorCard from "../components/vendorCard";
import ProductCard from "../components/productCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [vendorPage, setVendorPage] = useState(1);
  const [dishPage, setDishPage] = useState(1);
  const [locationPage, setLocationPage] = useState(1);
  const itemsPerPage = 9;

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setData(data.data.sort((a, b) => b.rating - a.rating));
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSearch = () => {
    setSearching(true);
    const filteredVendors = data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setVendors(filteredVendors);

    const filteredDishes = data.flatMap((item) =>
      item.menu
        .filter((dish) => dish.name.toLowerCase().includes(query.toLowerCase()))
        .map((dish) => ({
          ...dish,
          vendor: item,
        }))
    );
    setDishes(filteredDishes);

    const filteredLocations = data.filter(
      (item) =>
        item.location.city.toLowerCase().includes(query.toLowerCase()) ||
        item.location.state.toLowerCase().includes(query.toLowerCase()) ||
        item.location.country.toLowerCase().includes(query.toLowerCase()) ||
        item.location.zipcode.includes(query)
    );
    setLocations(filteredLocations);

    setSearching(false);
    if (vendors.length === 0 && dishes.length === 0 && locations.length === 0) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getPaginatedResults = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const loadMoreResults = (category) => {
    if (category === "vendors") {
      setVendorPage((prevPage) => prevPage + 1);
    } else if (category === "dishes") {
      setDishPage((prevPage) => prevPage + 1);
    } else if (category === "locations") {
      setLocationPage((prevPage) => prevPage + 1);
    }
  };

  const hasMoreResults = (data, page) => {
    return data.length > page * itemsPerPage;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-[90%]">
      <h1 className="text-3xl font-bold text-center mb-4">Search</h1>
      <div className="flex justify-center mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border border-gray-300 rounded-l-lg p-2 w-full"
          placeholder="Search for Vendor, Dish, Location, ZipCode"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white rounded-r-lg px-6 py-2 hover:bg-orange-600"
        >
          <FaSearch />
        </button>
      </div>
      {!notFound && (
        <div>
          {dishes.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Dishes
              </h2>
              <div className="grid md:grid-cols-3 grid-cols-1">
                {getPaginatedResults(dishes, dishPage).map((dish, index) => (
                  <div key={index}>
                    <ProductCard
                      product={dish}
                      logo={dish.vendor.logo}
                      location={dish.vendor.location}
                      documentId={dish.vendor.documentId}
                    />
                  </div>
                ))}
              </div>
              {hasMoreResults(dishes, dishPage) && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => loadMoreResults("dishes")}
                    className="bg-orange-500 text-white py-2 px-4 rounded"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          )}
          {vendors.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Vendors
              </h2>
              <div className="gap-6 grid md:grid-cols-3 grid-cols-1">
                {getPaginatedResults(vendors, vendorPage).map(
                  (vendor, index) => (
                    <div key={index}>
                      <VendorCard vendor={vendor} className="mx-auto" />
                    </div>
                  )
                )}
              </div>
              {hasMoreResults(vendors, vendorPage) && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => loadMoreResults("vendors")}
                    className="bg-orange-500 text-white py-2 px-4 rounded"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          )}
          {locations.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Locations
              </h2>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                {getPaginatedResults(locations, locationPage).map(
                  (vendor, index) => (
                    <div key={index}>
                      <VendorCard vendor={vendor} className="mx-auto" />
                    </div>
                  )
                )}
              </div>
              {hasMoreResults(locations, locationPage) && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => loadMoreResults("locations")}
                    className="bg-orange-500 text-white py-2 px-4 rounded"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {notFound && <div>No Results Found</div>}
      {searching && <div>Searching...</div>}
    </div>
  );
}
