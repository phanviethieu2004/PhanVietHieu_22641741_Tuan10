"use client"

import { useEffect, useState } from "react"
import { fetchUsers } from "./App.jsx"

function UserList() {
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)
    const [theme, setTheme] = useState("dark")
    const [store, setStore] = useState(null)

    useEffect(() => {
        // Get the store from the window object
        const appStore = window.store
        if (appStore) {
            setStore(appStore)

            // Get initial state
            const state = appStore.getState()
            setUsers(state.users.items)
            setStatus(state.users.status)
            setError(state.users.error)
            setTheme(state.theme.mode)

            // Subscribe to store changes
            const unsubscribe = appStore.subscribe(() => {
                const newState = appStore.getState()
                setUsers(newState.users.items)
                setStatus(newState.users.status)
                setError(newState.users.error)
                setTheme(newState.theme.mode)
            })

            // Fetch users if not already loaded
            if (state.users.status === "idle") {
                appStore.dispatch(fetchUsers())
            }

            return () => unsubscribe()
        }
    }, [])

    const handleRefetch = () => {
        if (store) {
            store.dispatch(fetchUsers())
        }
    }

    return (
        <div className={`user-list-container ${theme}`}>
            <div className="user-list-header">
                <h3>Users List</h3>
                <button className="user-button refresh" onClick={handleRefetch}>
                    Refresh Data
                </button>
            </div>

            {status === "loading" && (
                <div className="user-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            )}

            {status === "failed" && (
                <div className="user-error">
                    <p>Error: {error}</p>
                    <button className="user-button retry" onClick={handleRefetch}>
                        Try Again
                    </button>
                </div>
            )}

            {status === "succeeded" && (
                <div className="user-grid">
                    {users.map((user) => (
                        <div key={user.id} className={`user-card ${theme}`}>
                            <div className="user-avatar">{user.name.charAt(0)}</div>
                            <div className="user-info">
                                <h4>{user.name}</h4>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {user.phone}
                                </p>
                                <p>
                                    <strong>Company:</strong> {user.company.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserList
