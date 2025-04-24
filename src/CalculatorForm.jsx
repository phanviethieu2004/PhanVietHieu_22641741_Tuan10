"use client"

import { useState, useEffect } from "react"
import { updateInput, calculateResult, setActiveCalculator } from "./App.jsx"

function CalculatorForm() {
    const [calculatorState, setCalculatorState] = useState({
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
    })
    const [theme, setTheme] = useState("dark")
    const [store, setStore] = useState(null)

    useEffect(() => {
        // Get the store from the window object
        const appStore = window.store
        if (appStore) {
            setStore(appStore)
            const state = appStore.getState()
            setCalculatorState(state.calculator)
            setTheme(state.theme.mode)

            const unsubscribe = appStore.subscribe(() => {
                const newState = appStore.getState()
                setCalculatorState(newState.calculator)
                setTheme(newState.theme.mode)
            })

            return () => unsubscribe()
        }
    }, [])

    const handleInputChange = (calculator, field, value) => {
        if (store) {
            store.dispatch(updateInput({ calculator, field, value }))
        }
    }

    const handleCalculate = () => {
        if (store) {
            store.dispatch(calculateResult())
        }
    }

    const handleSetActiveCalculator = (calculator) => {
        if (store) {
            store.dispatch(setActiveCalculator(calculator))
        }
    }

    const renderBMICalculator = () => (
        <div className="calculator-fields">
            <div className="calculator-field">
                <label htmlFor="height">Chiều cao (cm)</label>
                <input
                    type="number"
                    id="height"
                    value={calculatorState.bmi.height}
                    onChange={(e) => handleInputChange("bmi", "height", e.target.value)}
                    className={`calculator-input ${theme}`}
                    placeholder="Nhập chiều cao (cm)"
                    min="1"
                />
            </div>
            <div className="calculator-field">
                <label htmlFor="weight">Cân nặng (kg)</label>
                <input
                    type="number"
                    id="weight"
                    value={calculatorState.bmi.weight}
                    onChange={(e) => handleInputChange("bmi", "weight", e.target.value)}
                    className={`calculator-input ${theme}`}
                    placeholder="Nhập cân nặng (kg)"
                    min="1"
                />
            </div>
            <button className="calculator-button calculate" onClick={handleCalculate}>
                Tính BMI
            </button>

            {calculatorState.bmi.result !== null && (
                <div className={`calculator-result ${theme}`}>
                    <h4>Kết quả:</h4>
                    <p>
                        <strong>BMI của bạn:</strong> {calculatorState.bmi.result.toFixed(2)}
                    </p>
                    <p>
                        <strong>Phân loại:</strong> {calculatorState.bmi.classification}
                    </p>
                    <div className="bmi-scale">
                        <div className="bmi-scale-bar">
                            <div
                                className="bmi-scale-indicator"
                                style={{
                                    left: `${Math.min(Math.max((calculatorState.bmi.result / 40) * 100, 0), 100)}%`,
                                }}
                            ></div>
                        </div>
                        <div className="bmi-scale-labels">
                            <span>Thiếu cân</span>
                            <span>Bình thường</span>
                            <span>Thừa cân</span>
                            <span>Béo phì</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const renderTaxCalculator = () => (
        <div className="calculator-fields">
            <div className="calculator-field">
                <label htmlFor="income">Thu nhập hàng tháng (VND)</label>
                <input
                    type="number"
                    id="income"
                    value={calculatorState.tax.income}
                    onChange={(e) => handleInputChange("tax", "income", e.target.value)}
                    className={`calculator-input ${theme}`}
                    placeholder="Nhập thu nhập (VND)"
                    min="0"
                />
            </div>
            <button className="calculator-button calculate" onClick={handleCalculate}>
                Tính thuế
            </button>

            {calculatorState.tax.result !== null && (
                <div className={`calculator-result ${theme}`}>
                    <h4>Kết quả tính thuế:</h4>
                    <p>
                        <strong>Thu nhập trước thuế:</strong> {Number(calculatorState.tax.income).toLocaleString("vi-VN")} VND
                    </p>
                    <p>
                        <strong>Thuế thu nhập cá nhân:</strong> {calculatorState.tax.result.toLocaleString("vi-VN")} VND
                    </p>
                    <p>
                        <strong>Thu nhập sau thuế:</strong>{" "}
                        {(Number(calculatorState.tax.income) - calculatorState.tax.result).toLocaleString("vi-VN")} VND
                    </p>

                    <h5>Chi tiết thuế theo bậc:</h5>
                    <div className="tax-breakdown">
                        {Object.entries(calculatorState.tax.breakdown).map(([bracket, amount]) => (
                            <div key={bracket} className="tax-bracket">
                                <span>{bracket}:</span>
                                <span>{amount.toLocaleString("vi-VN")} VND</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className={`calculator-container ${theme}`}>
            <div className="calculator-tabs">
                <button
                    className={`calculator-tab ${calculatorState.activeCalculator === "bmi" ? "active" : ""}`}
                    onClick={() => handleSetActiveCalculator("bmi")}
                >
                    Tính BMI
                </button>
                <button
                    className={`calculator-tab ${calculatorState.activeCalculator === "tax" ? "active" : ""}`}
                    onClick={() => handleSetActiveCalculator("tax")}
                >
                    Tính Thuế TNCN
                </button>
            </div>

            <div className="calculator-content">
                {calculatorState.activeCalculator === "bmi" ? renderBMICalculator() : renderTaxCalculator()}
            </div>
        </div>
    )
}

export default CalculatorForm
