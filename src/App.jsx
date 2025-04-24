"use client"

import { useState, useEffect } from "react"
import { Provider } from "react-redux"
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Sun, Moon } from "./ThemeIcons.jsx"
import ShoppingCart from "./ShoppingCart.jsx"
import AuthComponent from "./AuthComponent.jsx"
import UserList from "./UserList.jsx"
import CalculatorForm from "./CalculatorForm.jsx"
import "./App.css"

// Add the fetchUsers async thunk before the appSlice
export const fetchUsers = createAsyncThunk("app/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    if (!response.ok) {
      throw new Error("Server Error")
    }
    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// Tạo slice với counter, theme, cart, auth, users và calculator
const appSlice = createSlice({
  name: "app",
  initialState: {
    counter: {
      value: 0,
    },
    theme: {
      mode: "dark", // Mặc định là dark mode
    },
    todoList: {
      todos: [
        { id: 1, text: "Học Redux", completed: false },
        { id: 2, text: "Làm bài tập", completed: true },
      ],
    },
    cart: {
      items: [],
    },
    auth: {
      user: null,
      isLoggedIn: false,
    },
    users: {
      items: [],
      status: "idle", // idle | loading | succeeded | failed
      error: null,
    },
    calculator: {
      activeCalculator: "bmi",
      bmi: {
        height: "",
        weight: "",
        result: null,
        classification: "",
      },
      tax: {
        income: "",
        result: null,
        breakdown: {},
      },
    },
  },
  reducers: {
    // Counter actions
    increment: (state) => {
      state.counter.value += 1
    },
    decrement: (state) => {
      state.counter.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.counter.value += Number(action.payload)
    },
    resetCounter: (state) => {
      state.counter.value = 0
    },
    // Theme actions
    toggleTheme: (state) => {
      state.theme.mode = state.theme.mode === "light" ? "dark" : "light"
    },
    // Todo actions
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      }
      state.todoList.todos.push(newTodo)
    },
    toggleTodo: (state, action) => {
      const todo = state.todoList.todos.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    removeTodo: (state, action) => {
      state.todoList.todos = state.todoList.todos.filter((todo) => todo.id !== action.payload)
    },
    // Cart actions
    addItem: (state, action) => {
      const existingItem = state.cart.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeItem: (state, action) => {
      state.cart.items = state.cart.items.filter((item) => item.id !== action.payload)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cart.items.find((item) => item.id === id)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },
    // Auth actions
    login: (state, action) => {
      state.auth.isLoggedIn = true
      state.auth.user = action.payload
    },
    logout: (state) => {
      state.auth.isLoggedIn = false
      state.auth.user = null
    },
    setUserInfo: (state, action) => {
      state.auth.user = { ...state.auth.user, ...action.payload }
    },
    // Calculator actions
    updateInput: (state, action) => {
      const { calculator, field, value } = action.payload
      state.calculator[calculator][field] = value
    },
    calculateResult: (state) => {
      if (state.calculator.activeCalculator === "bmi") {
        // Calculate BMI
        const height = Number.parseFloat(state.calculator.bmi.height) / 100 // convert cm to m
        const weight = Number.parseFloat(state.calculator.bmi.weight)

        if (height > 0 && weight > 0) {
          const bmi = weight / (height * height)
          state.calculator.bmi.result = bmi

          // Determine BMI classification
          if (bmi < 18.5) {
            state.calculator.bmi.classification = "Thiếu cân"
          } else if (bmi < 25) {
            state.calculator.bmi.classification = "Bình thường"
          } else if (bmi < 30) {
            state.calculator.bmi.classification = "Thừa cân"
          } else {
            state.calculator.bmi.classification = "Béo phì"
          }
        }
      } else if (state.calculator.activeCalculator === "tax") {
        // Calculate income tax (simplified Vietnamese personal income tax)
        const income = Number.parseFloat(state.calculator.tax.income)
        let tax = 0
        const breakdown = {}

        if (income > 0) {
          // Tax brackets (simplified for demonstration)
          if (income <= 5000000) {
            tax = income * 0.05
            breakdown["Bậc 1 (5%)"] = tax
          } else if (income <= 10000000) {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = (income - 5000000) * 0.1
            tax = breakdown["Bậc 1 (5%)"] + breakdown["Bậc 2 (10%)"]
          } else if (income <= 18000000) {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = 5000000 * 0.1
            breakdown["Bậc 3 (15%)"] = (income - 10000000) * 0.15
            tax = breakdown["Bậc 1 (5%)"] + breakdown["Bậc 2 (10%)"] + breakdown["Bậc 3 (15%)"]
          } else if (income <= 32000000) {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = 5000000 * 0.1
            breakdown["Bậc 3 (15%)"] = 8000000 * 0.15
            breakdown["Bậc 4 (20%)"] = (income - 18000000) * 0.2
            tax =
              breakdown["Bậc 1 (5%)"] + breakdown["Bậc 2 (10%)"] + breakdown["Bậc 3 (15%)"] + breakdown["Bậc 4 (20%)"]
          } else if (income <= 52000000) {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = 5000000 * 0.1
            breakdown["Bậc 3 (15%)"] = 8000000 * 0.15
            breakdown["Bậc 4 (20%)"] = 14000000 * 0.2
            breakdown["Bậc 5 (25%)"] = (income - 32000000) * 0.25
            tax =
              breakdown["Bậc 1 (5%)"] +
              breakdown["Bậc 2 (10%)"] +
              breakdown["Bậc 3 (15%)"] +
              breakdown["Bậc 4 (20%)"] +
              breakdown["Bậc 5 (25%)"]
          } else if (income <= 80000000) {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = 5000000 * 0.1
            breakdown["Bậc 3 (15%)"] = 8000000 * 0.15
            breakdown["Bậc 4 (20%)"] = 14000000 * 0.2
            breakdown["Bậc 5 (25%)"] = 20000000 * 0.25
            breakdown["Bậc 6 (30%)"] = (income - 52000000) * 0.3
            tax =
              breakdown["Bậc 1 (5%)"] +
              breakdown["Bậc 2 (10%)"] +
              breakdown["Bậc 3 (15%)"] +
              breakdown["Bậc 4 (20%)"] +
              breakdown["Bậc 5 (25%)"] +
              breakdown["Bậc 6 (30%)"]
          } else {
            breakdown["Bậc 1 (5%)"] = 5000000 * 0.05
            breakdown["Bậc 2 (10%)"] = 5000000 * 0.1
            breakdown["Bậc 3 (15%)"] = 8000000 * 0.15
            breakdown["Bậc 4 (20%)"] = 14000000 * 0.2
            breakdown["Bậc 5 (25%)"] = 20000000 * 0.25
            breakdown["Bậc 6 (30%)"] = 28000000 * 0.3
            breakdown["Bậc 7 (35%)"] = (income - 80000000) * 0.35
            tax =
              breakdown["Bậc 1 (5%)"] +
              breakdown["Bậc 2 (10%)"] +
              breakdown["Bậc 3 (15%)"] +
              breakdown["Bậc 4 (20%)"] +
              breakdown["Bậc 5 (25%)"] +
              breakdown["Bậc 6 (30%)"] +
              breakdown["Bậc 7 (35%)"]
          }

          state.calculator.tax.result = tax
          state.calculator.tax.breakdown = breakdown
        }
      }
    },
    setActiveCalculator: (state, action) => {
      state.calculator.activeCalculator = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.users.status = "loading"
        state.users.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.status = "succeeded"
        state.users.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = "failed"
        state.users.error = action.payload
      })
  },
})

// Update the exported actions to include calculator actions
export const {
  increment,
  decrement,
  incrementByAmount,
  resetCounter,
  toggleTheme,
  addTodo,
  toggleTodo,
  removeTodo,
  addItem,
  removeItem,
  updateQuantity,
  login,
  logout,
  setUserInfo,
  updateInput,
  calculateResult,
  setActiveCalculator,
} = appSlice.actions

// Tạo store
const store = configureStore({
  reducer: appSlice.reducer,
})

// Export store để có thể import từ main.jsx
export { store }

// Theme Toggle Component (Bài tập 3)
function ThemeToggle() {
  const [theme, setTheme] = useState(store.getState().theme.mode)

  const handleToggleTheme = () => {
    store.dispatch(toggleTheme())
    setTheme(store.getState().theme.mode)
  }

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.getState().theme.mode)
    })
    return () => unsubscribe()
  }, [])

  return (
    <button
      className={`theme-toggle-button ${theme === "light" ? "light" : "dark"}`}
      onClick={handleToggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon /> : <Sun />}
      <span className="theme-toggle-text">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
    </button>
  )
}

// Counter Component (Bài tập 1 & 7)
function Counter() {
  const [count, setCount] = useState(store.getState().counter.value)
  const [theme, setTheme] = useState(store.getState().theme.mode)
  const [incrementAmount, setIncrementAmount] = useState(1)

  const handleIncrement = () => {
    store.dispatch(increment())
    setCount(store.getState().counter.value)
  }

  const handleDecrement = () => {
    store.dispatch(decrement())
    setCount(store.getState().counter.value)
  }

  const handleReset = () => {
    store.dispatch(resetCounter())
    setCount(store.getState().counter.value)
  }

  const handleIncrementByAmount = () => {
    store.dispatch(incrementByAmount(incrementAmount))
    setCount(store.getState().counter.value)
  }

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCount(store.getState().counter.value)
      setTheme(store.getState().theme.mode)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className={`counter-container ${theme}`}>
      <h2 className="counter-display">{count}</h2>
      <div className="counter-buttons">
        <button className="counter-button decrement" onClick={handleDecrement}>
          Giảm
        </button>
        <button className="counter-button increment" onClick={handleIncrement}>
          Tăng
        </button>
        <button className="counter-button reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="counter-custom-increment">
        <input
          type="number"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
          className={`counter-input ${theme}`}
          min="1"
        />
        <button className="counter-button increment-by-amount" onClick={handleIncrementByAmount}>
          Tăng theo giá trị
        </button>
      </div>
    </div>
  )
}

// Todo List Component (Bài tập 2)
function TodoList() {
  const [todos, setTodos] = useState(store.getState().todoList.todos)
  const [theme, setTheme] = useState(store.getState().theme.mode)
  const [newTodo, setNewTodo] = useState("")

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      store.dispatch(addTodo(newTodo))
      setNewTodo("")
    }
  }

  const handleToggleTodo = (id) => {
    store.dispatch(toggleTodo(id))
  }

  const handleRemoveTodo = (id) => {
    store.dispatch(removeTodo(id))
  }

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTodos(store.getState().todoList.todos)
      setTheme(store.getState().theme.mode)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className={`todo-container ${theme}`}>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm công việc mới..."
          className={`todo-input ${theme}`}
        />
        <button type="submit" className="todo-button add">
          Thêm
        </button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <span
              className="todo-text"
              onClick={() => handleToggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? "line-through" : "none" }}
            >
              {todo.text}
            </span>
            <button className="todo-button remove" onClick={() => handleRemoveTodo(todo.id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(store.getState().theme.mode)

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.getState().theme.mode)
    })
    return () => unsubscribe()
  }, [])

  // Sample products for the shopping cart
  const products = [
    { id: 1, name: "Áo thun", price: 150000, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Quần jean", price: 350000, image: "https://via.placeholder.com/50" },
    { id: 3, name: "Giày thể thao", price: 500000, image: "https://via.placeholder.com/50" },
  ]

  return (
    <Provider store={store}>
      <div className={`App ${theme}`}>
        <header className={`App-header ${theme}`}>
          <ThemeToggle />
          <h1>Redux Exercises</h1>

          <div className="exercises-container">
            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 1 & 7: Counter App Nâng cao</h2>
              <div className="exercise-description">
                <p>Sử dụng createSlice để tạo các action: increment, decrement</p>
                <p>Thêm nút reset và incrementByAmount</p>
              </div>
              <Counter />
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 2: Todo List</h2>
              <div className="exercise-description">
                <p>State: todos (mảng các công việc)</p>
                <p>Action: addTodo, toggleTodo, removeTodo</p>
              </div>
              <TodoList />
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 3: Toggle Theme</h2>
              <div className="exercise-description">
                <p>State: theme (light / dark)</p>
                <p>Action: toggleTheme</p>
                <p>Áp dụng theme cho giao diện bằng CSS class</p>
              </div>
              <div className="theme-demo">
                <div className={`theme-sample ${theme}`}>
                  <p>Current Theme: {theme === "light" ? "Light Mode" : "Dark Mode"}</p>
                  <p>Click the button in the top-right corner to toggle theme</p>
                </div>
              </div>
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 4: Giỏ hàng (Shopping Cart)</h2>
              <div className="exercise-description">
                <p>State: cartItems (mảng sản phẩm)</p>
                <p>Action: addItem, removeItem, updateQuantity</p>
                <p>Tính tổng số lượng và tổng tiền</p>
              </div>
              <ShoppingCart products={products} />
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 5: Quản lý user đăng nhập (Auth)</h2>
              <div className="exercise-description">
                <p>State: user, isLoggedIn</p>
                <p>Action: login, logout, setUserInfo</p>
                <p>Hiển thị giao diện đăng nhập / chào mừng người dùng</p>
              </div>
              <AuthComponent />
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 6: Đồng bộ dữ liệu từ API (Async Thunk)</h2>
              <div className="exercise-description">
                <p>Sử dụng createAsyncThunk để gọi API lấy danh sách users</p>
                <p>State: users, status, error</p>
                <p>Action: fetchUsers</p>
              </div>
              <UserList />
            </div>

            <div className={`exercise-card ${theme}`}>
              <h2 className="exercise-title">Bài 8: Form tính toán đơn giản</h2>
              <div className="exercise-description">
                <p>State: dữ liệu form và kết quả tính toán</p>
                <p>Action: updateInput, calculateResult</p>
                <p>Tính BMI và thuế thu nhập cá nhân</p>
              </div>
              <CalculatorForm />
            </div>
          </div>
        </header>
      </div>
    </Provider>
  )
}

export default App
