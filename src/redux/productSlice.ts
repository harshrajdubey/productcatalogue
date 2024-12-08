import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[]; // Store unique categories
  selectedCategory: string | null; // Track selected category for filtering
  searchQuery: string;
  loading: boolean;
  error: string | null;
  sortBy: 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [], // Initialize categories as empty
  selectedCategory: null, // No category selected initially
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'rating', // Default sort by rating
  sortOrder: 'desc', // Default sort order is descending
};

// Define the async thunk for fetching products
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products'); // Replace with your API URL
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filteredProducts = state.products
        .filter((product) =>
          product.title.toLowerCase().includes(action.payload.toLowerCase())
        )
        .filter((product) =>
          state.selectedCategory
            ? product.category === state.selectedCategory
            : true
        );
    },
    setSortBy(state, action: PayloadAction<'price' | 'rating'>) {
      state.sortBy = action.payload;
    },
    setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sortOrder = action.payload;
    },
    sortProducts(state) {
      const { sortBy, sortOrder } = state;

      state.filteredProducts = [...state.filteredProducts].sort((a, b) => {
        if (sortBy === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        } else {
          return sortOrder === 'asc'
            ? a.rating.rate - b.rating.rate
            : b.rating.rate - a.rating.rate;
        }
      });
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
      state.filteredProducts = state.products.filter((product) =>
        action.payload ? product.category === action.payload : true
      );
    },
    extractCategories(state) {
      state.categories = Array.from(
        new Set(state.products.map((product) => product.category))
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
          state.filteredProducts = action.payload;
          state.categories = Array.from(
            new Set(action.payload.map((product) => product.category))
          ); // Extract categories on fetch
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {
  setSearchQuery,
  setSortBy,
  setSortOrder,
  sortProducts,
  setCategory,
  extractCategories,
} = productSlice.actions;

export default productSlice.reducer;