import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  'products/getProductList',
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get('/product', { params: { ...query } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  'products/getProductDetail',
  async (id, { rejectWithValue }) => {}
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/product', formData);
      dispatch(
        showToastMessage({ message: '상품 등록 완료', status: 'success' })
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { dispatch, rejectWithValue }) => {}
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/product/${id}`, formData);
      dispatch(
        showToastMessage({ message: '상품 수정 완료', status: 'success' })
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: 'products',
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: '',
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = '';
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.total;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = '';
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError, resetSuccess } =
  productSlice.actions;
export default productSlice.reducer;
