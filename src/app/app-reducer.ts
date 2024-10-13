import {authAPI} from '../api/todolists-api'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch, rejectWithValue}) => {
  const res = await authAPI.me();
  if (res.data.resultCode === 0) {
   // dispatch(setAppStatusAC({status: 'succeeded'}))
    dispatch(setIsLoggedInAC({ value: true }));
    // return;
  } else {
  }
  // return;
})

const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle',
    error: null,
    isInitialized: false
  } as InitialStateType,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    }
  },
  extraReducers: builder => builder
    .addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true
    })
});
export const appReducer = slice.reducer;
export const {
  setAppStatusAC,
  setAppErrorAC
} = slice.actions;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;