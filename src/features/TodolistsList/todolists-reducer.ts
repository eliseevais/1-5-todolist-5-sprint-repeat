import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const res = await todolistsAPI.getTodolists();
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolists: res.data}
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null);
    }
  });

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist',
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      thunkAPI.dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, status: 'loading'}))
      const res = await todolistsAPI.deleteTodolist(todolistId);
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistId: todolistId}
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null);
    }
  });

export const addTodolistTC = createAsyncThunk('todolists/addTodolist',
  async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
      const res = await todolistsAPI.createTodolist(title)
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolist: res.data.data.item}
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null);
    }
  });

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle',
  async (param: { id: string, title: string }, thunkAPI) => {
    try {
      const res = await todolistsAPI.updateTodolist(param.id, param.title)
      return {todolistId: param.id, title: param.title}
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
      }
      return thunkAPI.rejectWithValue(null);
    }
  });

const slice = createSlice({
  name: ' todolists',
  initialState: initialState,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      state[index].entityStatus = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        state[index].title = action.payload.title
      })
  }
});

export const todolistsReducer = slice.reducer;
export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC
} = slice.actions;


// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<SetAppStatusActionType | SetAppErrorActionType>
