import { Counter } from "./components/Counter"
import { TodoList } from "./components/TodoList"
import "./App.css"

function App() {
  return (
    <div className="App">
      <h1>Redux Toolkit Demo</h1>

      <div className="exercise-section">
        <div className="exercise-header">
          <h2>Bài 1: Counter App</h2>
          <div className="divider"></div>
        </div>
        <Counter />
      </div>

      <div className="exercise-section">
        <div className="exercise-header">
          <h2>Bài 2: Todo List</h2>
          <div className="divider"></div>
        </div>
        <TodoList />
      </div>
    </div>
  )
}

export default App
