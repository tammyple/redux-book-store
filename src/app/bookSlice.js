import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apiService";
import { fetchBooks } from "./getApi";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  bookDetail: null,
  readingList: [],
  status: null,
};

export const fetchData = createAsyncThunk("book/fetchData", async (props) => {
  const response = await fetchBooks(props);
  return response.data;
});

export const getBookDetail = createAsyncThunk(
  "book/getBookDetail",
  async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);

export const addToReadingList = createAsyncThunk(
  "book/addToReadingList",
  async (book) => {
    const response = await api.post(`/favorites`, book);
    return response.data;
  }
);

export const getReadingList = createAsyncThunk(
  "book/getReadingList",
  async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  }
);

export const removeFromReadingList = createAsyncThunk(
  "book/removeFromReadingList",
  async (removedBookId) => {
    const response = await api.delete(`/favorites/${removedBookId}`);
    return response.data;
  }
);

export const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = null;
        state.books = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(addToReadingList.pending, (state, action) => {})
      .addCase(addToReadingList.fulfilled, (state, action) => {
        console.log(action.payload);
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        toast.error(action.error.message);
      });
    builder
      .addCase(getReadingList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.status = null;
        state.readingList = action.payload;
      })
      .addCase(getReadingList.rejected, (state, action) => {
        state.status = "Failed to get reading list";
      });
    builder
      .addCase(removeFromReadingList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(removeFromReadingList.fulfilled, (state, action) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeFromReadingList.rejected, (state, action) => {
        state.status = "Failed to remove from reading list";
      });
    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.bookDetail = action.payload;
      })
      .addCase(getBookDetail.rejected, (state, action) => {
        state.status = "Failed to get book detail";
      });
  },
});

export default bookSlice.reducer;
