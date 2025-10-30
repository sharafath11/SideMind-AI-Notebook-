import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { subjectServices } from "@/services/subject.service";
import { FetchSubjectsResponse, SubjectState } from "@/types/subjectTypes";

const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
  total: 0,
  page: 0,
  totalPages: 0,
};

export const fetchSubjects = createAsyncThunk(
  "subjects/fetchAll",
  async (params: any, thunkAPI) => {
    try {
      const res = await subjectServices.getSubjects(params);
      if (!res.ok) throw new Error(res.msg);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addSubject = createAsyncThunk(
  "subjects/add",
  async ({ title, description }: { title: string; description: string }, thunkAPI) => {
    try {
      const res = await subjectServices.addSubject(title, description);
      if (!res.ok) throw new Error(res.msg);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  "subjects/delete",
  async (id: string, thunkAPI) => {
    try {
      const res = await subjectServices.deleteSubject(id);
      if (!res.ok) throw new Error(res.msg);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editSubject = createAsyncThunk(
  "subjects/edit",
  async (
    { id, title, description }: { id: string; title: string; description: string },
    thunkAPI
  ) => {
    try {
      const res = await subjectServices.editSubject(id, title, description);
      if (!res.ok) throw new Error(res.msg);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearSubjects: (state) => {
      state.subjects = [];
      state.loading = false;
      state.error = null;
      state.total = 0;
      state.page = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action: PayloadAction<FetchSubjectsResponse>) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter((s) => s.subId !== action.payload);
      })
      .addCase(editSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex((s) => s.subId === action.payload.subId);
        if (index !== -1) state.subjects[index] = action.payload;
      });
  },
});

export const { clearSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;
