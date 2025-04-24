"use client"

import { useState, useEffect } from "react"
import { login, logout, setUserInfo } from "./App.jsx"

function AuthComponent() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        user: null,
    })
    const [theme, setTheme] = useState("dark")
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    })
    const [profileForm, setProfileForm] = useState({
        fullName: "",
        email: "",
        avatar: "",
    })
    const [store, setStore] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        // Get the store from the window object
        const appStore = window.store
        if (appStore) {
            setStore(appStore)
            const state = appStore.getState()
            setAuthState(state.auth)
            setTheme(state.theme.mode)

            const unsubscribe = appStore.subscribe(() => {
                const newState = appStore.getState()
                setAuthState(newState.auth)
                setTheme(newState.theme.mode)
            })

            return () => unsubscribe()
        }
    }, [])

    const handleLoginChange = (e) => {
        const { name, value } = e.target
        setLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setError("")

        // Simple validation
        if (!loginForm.username || !loginForm.password) {
            setError("Vui lòng nhập đầy đủ thông tin")
            return
        }

        // Mock login - in a real app, this would call an API
        if (loginForm.username === "admin" && loginForm.password === "password") {
            const user = {
                username: loginForm.username,
                fullName: "Admin User",
                email: "admin@example.com",
                avatar: "https://via.placeholder.com/150",
            }

            if (store) {
                store.dispatch(login(user))
                // Update profile form with user data
                setProfileForm({
                    fullName: user.fullName,
                    email: user.email,
                    avatar: user.avatar,
                })
            }
        } else {
            setError("Tên đăng nhập hoặc mật khẩu không đúng")
        }
    }

    const handleLogout = () => {
        if (store) {
            store.dispatch(logout())
            // Reset forms
            setLoginForm({
                username: "",
                password: "",
            })
        }
    }

    const handleUpdateProfile = (e) => {
        e.preventDefault()
        if (store && authState.isLoggedIn) {
            store.dispatch(
                setUserInfo({
                    fullName: profileForm.fullName,
                    email: profileForm.email,
                    avatar: profileForm.avatar,
                }),
            )
        }
    }

    // Login Form
    const renderLoginForm = () => (
        <div className={`auth-form-container ${theme}`}>
            <h3>Đăng nhập</h3>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={loginForm.username}
                        onChange={handleLoginChange}
                        className={`auth-input ${theme}`}
                        placeholder="Nhập tên đăng nhập"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        className={`auth-input ${theme}`}
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <div className="form-hint">
                    <small>Sử dụng: admin / password</small>
                </div>
                <button type="submit" className="auth-button login">
                    Đăng nhập
                </button>
            </form>
        </div>
    )

    // User Profile
    const renderUserProfile = () => (
        <div className={`auth-profile-container ${theme}`}>
            <div className="profile-header">
                <img
                    src={authState.user?.avatar || "https://via.placeholder.com/150"}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <div className="profile-welcome">
                    <h3>Xin chào, {authState.user?.fullName || authState.user?.username}</h3>
                    <p>{authState.user?.email}</p>
                </div>
            </div>

            <div className="profile-actions">
                <button onClick={handleLogout} className="auth-button logout">
                    Đăng xuất
                </button>
            </div>

            <div className="profile-edit">
                <h4>Cập nhật thông tin</h4>
                <form onSubmit={handleUpdateProfile} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Họ tên</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={profileForm.fullName}
                            onChange={handleProfileChange}
                            className={`auth-input ${theme}`}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className={`auth-input ${theme}`}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="avatar">Avatar URL</label>
                        <input
                            type="text"
                            id="avatar"
                            name="avatar"
                            value={profileForm.avatar}
                            onChange={handleProfileChange}
                            className={`auth-input ${theme}`}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                    <button type="submit" className="auth-button update">
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    )

    return <div className="auth-container">{authState.isLoggedIn ? renderUserProfile() : renderLoginForm()}</div>
}

export default AuthComponent
