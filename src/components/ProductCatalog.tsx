import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  sortProducts,
  setCategory,
} from "../redux/productSlice";
import { Product } from "../types";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCatalog: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    loading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
  } = useSelector((state: RootState) => state.products);

  // Fetch products and set default sort order on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(setSortBy("rating"));
    dispatch(setSortOrder("desc"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(sortProducts());
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

  const handleCategoryChange = (category: string | null) => {
    dispatch(setCategory(category));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.round(rating);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-red-500" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-red-500" />}
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

  console.log(filteredProducts);

  return (
    <div className="mx-auto md:grid grid-cols-4 gap-6 p-6 absolute top-0 scroll-smooth">
      {/* Sidebar */}
      <div className="col-span-1 z-20 gap-4 mb-4 px-4 py-16 sticky border-r-2 h-screen top-0">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search products"
          className="w-full mb-4 p-2 border border-gray-300 rounded-xl bg-white text-black"
        />
        <div className="flex items-center space-x-4 mb-4">
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
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-2">
            <li
              key="all"
              className={`cursor-pointer p-2 rounded-lg ${
                selectedCategory === null
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryChange(null)}
            >
              All Products
            </li>
            {categories.map((category) => (
              <li
                key={category}
                className={`capitalize cursor-pointer p-2 rounded-lg ${
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white border rounded-xl shadow-xl p-4 hover:scale-110 transform transition duration-300 ease-in-out"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-56 max-h-56 mx-auto object-contain rounded-md mb-4"
            />
            <h3 className="text-xl font-bold truncate">{product.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-black text-lg font-semibold">${Math.round(product.price*100)/100}</p>
              <div className="flex flex-col items-center ">
                {renderStars(product.rating.rate)} {/* Display stars */}
                ({product.rating.count} Reviews)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProductCatalog);
