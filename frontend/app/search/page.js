"use client";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "../loading";
import VendorCard from "../components/vendorCard";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";
import NoResultFound from "../components/noResultFound";

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
    if (query === "") {
      setVendors([]);
      setDishes([]);
      setLocations([]);
      return;
    }
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
    setNotFound(
      filteredVendors.length === 0 &&
        filteredDishes.length === 0 &&
        filteredLocations.length === 0
    );
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 md:w-[80%] w-full">
      <h1 className="md:text-2xl text-xl font-bold text-center mb-4">Search</h1>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-5 justify-items-center">
                {getPaginatedResults(dishes, dishPage).map((dish, index) => (
                  <ProductCard
                    key={index}
                    product={dish}
                    logo={dish.vendor.logo}
                    location={dish.vendor.location}
                    documentId={dish.vendor.documentId}
                  />
                ))}
              </div>
              {dishes.length > itemsPerPage && (
                <Pagination
                  currentPage={dishPage}
                  totalPages={Math.ceil(dishes.length / itemsPerPage)}
                  onPageChange={setDishPage}
                />
              )}
            </div>
          )}
          {vendors.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Vendors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-5 justify-items-center">
                {getPaginatedResults(vendors, vendorPage).map(
                  (vendor, index) => (
                    <VendorCard
                      key={index}
                      vendor={vendor}
                      className="mx-auto"
                    />
                  )
                )}
              </div>
              {vendors.length > itemsPerPage && (
                <Pagination
                  currentPage={vendorPage}
                  totalPages={Math.ceil(vendors.length / itemsPerPage)}
                  onPageChange={setVendorPage}
                />
              )}
            </div>
          )}
          {locations.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold my-4 text-center">
                Locations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-5 justify-items-center">
                {getPaginatedResults(locations, locationPage).map(
                  (vendor, index) => (
                    <VendorCard
                      key={index}
                      vendor={vendor}
                      className="mx-auto"
                    />
                  )
                )}
              </div>
              {locations.length > itemsPerPage && (
                <Pagination
                  currentPage={locationPage}
                  totalPages={Math.ceil(locations.length / itemsPerPage)}
                  onPageChange={setLocationPage}
                />
              )}
            </div>
          )}
        </div>
      )}
      {notFound && <NoResultFound/>}
      {searching && <div>Searching...</div>}
    </div>
  );
}
