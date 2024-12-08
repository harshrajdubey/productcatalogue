import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  sortProducts,
  setCategory,
  setCurrentPage,
} from "../redux/productSlice";
import { Product } from "../types";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaInfoCircle,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

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
    currentPage,
    itemsPerPage,
  } = useSelector((state: RootState) => state.products);

  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [showFilters, setShowFilters] = useState(false); // State for showing filters on mobile

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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(filteredProducts.length / itemsPerPage)) {
      dispatch(setCurrentPage(page));
    }
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Set dark mode on the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Pagination: Slice filteredProducts to show only items for the current page
  const currentPageProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div
      className={` transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 h-[90vh] ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-end items-center align-middle absolute top-4 right-4">
        <button
          onClick={toggleFilters}
          className="p-2 z-50 flex md:hidden items-center align-middle mr-2 gap-2 dark:bg-white dark:text-black bg-gray-800 text-white rounded-full"
        >
          <FaFilter />
          {showFilters ? "Hide Filter" : "Show Filter"}
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 z-50 flex gap-2 align-middle items-center dark:bg-white dark:text-black bg-gray-800 text-white rounded-full"
        >
          {darkMode ? (
            <FaSun className="text-yellow-500" />
          ) : (
            <FaMoon className="text-white" />
          )}

          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="mx-auto md:grid grid-cols-4 gap-6 px-4 md:p-6  absolute top-0 scroll-smooth transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700">
        <div
          className={`border-none dark:bg-gray-800 dark:text-white my-0 gap-4 md:sticky z-20 col-span-1 pt-16 md:py-16 border-r-2 md:h-screen top-0 mb-4 px-4 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products"
            className="w-full mb-4 p-2 border border-gray-300 rounded-xl bg-white text-black dark:bg-gray-900 dark:text-white"
          />
          <div className="flex items-center space-x-4 mb-4">
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="p-2 border w-1/2 border-gray-300 rounded-xl bg-white text-black dark:bg-gray-900 dark:text-white"
            >
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="p-2 border w-1/2 border-gray-300 rounded-xl bg-white text-black dark:bg-gray-900 dark:text-white"
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
                    : "hover:bg-red-500 hover:text-white bg-gray-100 dark:hover:bg-red-500 dark:bg-gray-900"
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
                      : "hover:bg-red-500 hover:text-white bg-gray-100 dark:hover:bg-red-500 dark:bg-gray-900"
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
        <div className="col-span-3 p-0 md:p-4 md:pt-14 pt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700">
          {currentPageProducts.map((product: Product) => (
            <div
              key={product.id}
              className="h-[28rem] bg-white border rounded-xl shadow-xl p-4 hover:scale-105 transform transition duration-300 ease-in-out dark:bg-gray-900 dark:border-gray-700"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 max-h-48 mx-auto object-contain rounded-md mb-4"
              />
              <h3 className="text-xl font-bold truncate">{product.title}</h3>
              <div className="flex items-center justify-between my-2">
                <p className="text-lg font-semibold">
                  ${Math.round(product.price * 100) / 100}
                </p>
                <div className="flex flex-col items-center">
                  {renderStars(product.rating.rate)} {/* Display stars */}
                  ({product.rating.count} Reviews)
                </div>
              </div>
              <p className="text-base text-justify line-clamp-[3]">
                {product.description}
              </p>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="group border border-black text-black bg-green-200 text-sm p-2 rounded-full flex items-center gap-1 hover:bg-green-300">
                  <FaShoppingCart />
                  <span className="hidden group-hover:inline-block">
                    Add To Cart
                  </span>
                </button>
                <button className="group border border-black text-black bg-blue-200 text-sm p-2 rounded-full flex items-center gap-1 hover:bg-blue-300">
                  <FaInfoCircle />
                  <span className="hidden group-hover:inline-block">
                    Product Info
                  </span>
                </button>
              </div>
            </div>
          ))}

             {/* Pagination */}
      <div className="col-span-1 md:col-span-4 flex justify-center py-4">
        <button
          className={`px-4 py-2 mx-2 border rounded-full ${
            currentPage === 1
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="flex items-center justify-center px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 mx-2 border rounded-full ${
            currentPage === totalPages
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
        </div>
      </div>

   
    </div>
  );
};

export default ProductCatalog;
