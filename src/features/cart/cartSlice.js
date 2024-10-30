import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/cart', { productId: id, size, qty: 1 });
      return res.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.message || '장바구니 담기 실패',
          status: 'error',
        })
      );
      return rejectWithValue(error.error && error.message);
    }
  }
);

export const getCartList = createAsyncThunk(
  'cart/getCartList',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/cart');
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/cart/${id}`);
      dispatch(getCartList());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateQty = createAsyncThunk(
  'cart/updateQty',
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/cart/${id}`, { qty: value });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  'cart/getCartQty',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/cart/qty');
      return res.data.qty;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
        state.error = '';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
        state.error = '';
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.discountPrice * item.qty,
          0
        );
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload.qty;
        state.error = '';
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.data;
        state.error = '';
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
