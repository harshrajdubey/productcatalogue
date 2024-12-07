import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  sortProducts,
} from "../redux/productSlice";
import { Product } from "../types";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCatalog: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    products,
    filteredProducts,
    loading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
  } = useSelector((state: RootState) => state.products);

  // Set default sort on component mount
  useEffect(() => {
    dispatch(setSortBy("rating")); // Default to sorting by rating
    dispatch(setSortOrder("desc")); // Default to descending order
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(sortProducts()); // Sort whenever `sortBy` or `sortOrder` changes
  }, [dispatch, sortBy, sortOrder]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(event.target.value));
    },
    [dispatch]
  );

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(event.target.value as "price" | "rating"));
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setSortOrder(event.target.value as "asc" | "desc"));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.round(rating);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <img
          src="https://i.gifer.com/VAyR.gif"
          alt="Loading..."
          className="w-16 h-16"
        />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mx-auto p-6">
      <div className="md:flex items-center gap-4 justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search products"
          className="w-full mb-4 md:mb-0 p-2 border border-gray-300 rounded-xl bg-white text-black"
        />
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="p-2 border w-1/2 border-gray-300 rounded-xl bg-white text-black"
          >
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="p-2 border w-1/2 border-gray-300 rounded-xl bg-white text-black"
          >
            <option value="asc">Low To High</option>
            <option value="desc">High To Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white border rounded-xl shadow-xl p-4"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-auto h-56 mx-auto object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold truncate">{product.title}</h3>
            <p className="text-gray-600">${product.price}</p>
            {renderStars(product.rating.rate)} {/* Display stars */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProductCatalog);
