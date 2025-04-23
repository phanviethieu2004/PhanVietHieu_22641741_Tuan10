import { createSlice } from "@reduxjs/toolkit"

export const todosSlice = createSlice({
    name: "todos",
    initialState: {
        items: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.items.push({
                id: Date.now(),
                text: action.payload,
                completed: false,
            })
        },
        toggleTodo: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        },
        removeTodo: (state, action) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload)
        },
    },
})

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions

export const selectTodos = (state) => state.todos.items

export default todosSlice.reducer
