// redux/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  sortBy: 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchQuery: "",
  sortBy: "rating", // Default sort by rating
  sortOrder: "desc", // Default sort order is descending
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
      state.filteredProducts = state.products.filter((product) =>
        product.title.toLowerCase().includes(action.payload.toLowerCase())
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
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSearchQuery, setSortBy, setSortOrder, sortProducts } = productSlice.actions;

export default productSlice.reducer;
