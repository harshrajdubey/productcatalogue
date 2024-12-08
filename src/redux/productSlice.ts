import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  sortBy: 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'rating',
  sortOrder: 'desc',
  currentPage: 1,
  itemsPerPage: 12, // Number of items per page
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
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
          product.title.toLowerCase().includes(action.payload.toLowerCase()) || product.description.toLowerCase().includes(action.payload.toLowerCase())
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
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.categories = Array.from(
          new Set(action.payload.map((product) => product.category))
        );
      })
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
  setCurrentPage,
} = productSlice.actions;

export default productSlice.reducer;
