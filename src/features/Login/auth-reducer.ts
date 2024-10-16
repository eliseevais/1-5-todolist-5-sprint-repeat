import {initializeAppTC, setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  isLoggedIn: false
}

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
  }>('auth/login',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const res = await authAPI.login(param);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
      }
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
      }
      return thunkAPI.rejectWithValue({errors: ["unknown error"], fieldsErrors: undefined});
    }
  });

export const logoutTC = createAsyncThunk('auth/logout',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        return;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
      }
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({})
      }
      return thunkAPI.rejectWithValue({});
    }
  });


const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
  },
  extraReducers: builder => builder
    .addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    .addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    })

});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// types
type InitialStateType = {
  isLoggedIn: boolean
}