"use client"
import { useSelector, useDispatch } from "react-redux"
import { decrement, increment, selectCount } from "../features/counter/counterSlice"
import "./Counter.css"

export function Counter() {
    const count = useSelector(selectCount)
    const dispatch = useDispatch()

    return (
        <div className="counter">
            <h1>Bài 1:</h1>
            <h2>Counter App</h2>
            <div className="counter-display">{count}</div>
            <div className="counter-buttons">
                <button className="button decrement" onClick={() => dispatch(decrement())}>
                    Giảm
                </button>
                <button className="button increment" onClick={() => dispatch(increment())}>
                    Tăng
                </button>
            </div>
        </div>
    )
}
