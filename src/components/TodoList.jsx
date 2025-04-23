"use client"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addTodo, toggleTodo, removeTodo, selectTodos } from "../features/todos/todosSlice"
import "./TodoList.css"

export function TodoList() {
    const [newTodo, setNewTodo] = useState("")
    const todos = useSelector(selectTodos)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (newTodo.trim()) {
            dispatch(addTodo(newTodo.trim()))
            setNewTodo("")
        }
    }

    return (
        <div className="todo-container">
            <h2>Danh sách công việc</h2>

            <form onSubmit={handleSubmit} className="todo-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Thêm công việc mới..."
                    className="todo-input"
                />
                <button type="submit" className="todo-button add">
                    Thêm
                </button>
            </form>

            <ul className="todo-list">
                {todos.length === 0 ? (
                    <li className="todo-empty">Chưa có công việc nào</li>
                ) : (
                    todos.map((todo) => (
                        <li key={todo.id} className="todo-item">
                            <div
                                className={`todo-text ${todo.completed ? "completed" : ""}`}
                                onClick={() => dispatch(toggleTodo(todo.id))}
                            >
                                {todo.text}
                            </div>
                            <button onClick={() => dispatch(removeTodo(todo.id))} className="todo-button remove">
                                Xóa
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}
