import {
  addTodolistTC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC, changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid'
import {TodolistType} from '../../api/todolists-api'
import {RequestStatusType} from '../../app/app-reducer'

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0}
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({todolistId: todolistId1}, 'requestId', 'New Todolist'))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  let todolist: TodolistType = {
    title: 'New Todolist',
    id: 'any id',
    addedDate: '',
    order: 0
  }


  const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist: todolist},
    'requestId', 'New Todolist'))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'New Todolist';

  const action = changeTodolistTitleTC.fulfilled(
    {todolistId: todolistId2, title: newTodolistTitle},
    'requestId',
    {id: todolistId2, title: newTodolistTitle})

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  const action = changeTodolistFilterAC({todolistId: todolistId2, filter: newFilter})

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})
test('todolists should be added', () => {

  const action = fetchTodolistsTC.fulfilled({todolists: startState}, 'requestId')

  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatusType = 'loading'

  const action = changeTodolistEntityStatusAC({todolistId: todolistId2, status: newStatus})

  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})



