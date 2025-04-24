import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { store } from "./App.jsx"
import "./index.css"

// Make the store available globally to avoid circular dependencies
window.store = store

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
