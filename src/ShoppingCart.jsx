"use client"

import { useState, useEffect } from "react"
import { addItem, removeItem, updateQuantity } from "./App.jsx"

function ShoppingCart({ products }) {
    const [cartItems, setCartItems] = useState([])
    const [theme, setTheme] = useState("dark")
    const [store, setStore] = useState(null)

    useEffect(() => {
        // Get the store from the window object (since we can't import it directly due to circular dependency)
        const appStore = window.store
        if (appStore) {
            setStore(appStore)
            setCartItems(appStore.getState().cart.items)
            setTheme(appStore.getState().theme.mode)

            const unsubscribe = appStore.subscribe(() => {
                setCartItems(appStore.getState().cart.items)
                setTheme(appStore.getState().theme.mode)
            })

            return () => unsubscribe()
        }
    }, [])

    // Calculate total quantity and total price
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    // Format price as VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const handleAddToCart = (product) => {
        if (store) {
            store.dispatch(addItem(product))
        }
    }

    const handleRemoveFromCart = (productId) => {
        if (store) {
            store.dispatch(removeItem(productId))
        }
    }

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (store) {
            store.dispatch(updateQuantity({ id: productId, quantity: newQuantity }))
        }
    }

    return (
        <div className={`cart-container ${theme}`}>
            <div className="products-list">
                <h3>Sản phẩm</h3>
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className={`product-card ${theme}`}>
                            <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p>{formatPrice(product.price)}</p>
                            </div>
                            <button className="cart-button add" onClick={() => handleAddToCart(product)}>
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cart-items">
                <h3>Giỏ hàng ({totalQuantity} sản phẩm)</h3>
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Giỏ hàng trống</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cartItems.map((item) => (
                                <li key={item.id} className={`cart-item ${theme}`}>
                                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p>{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <button
                                            className="quantity-button"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="item-quantity">{item.quantity}</span>
                                        <button
                                            className="quantity-button"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                        <button className="cart-button remove" onClick={() => handleRemoveFromCart(item.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className={`cart-summary ${theme}`}>
                            <p>
                                Tổng tiền: <strong>{formatPrice(totalPrice)}</strong>
                            </p>
                            <button className="cart-button checkout">Thanh toán</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ShoppingCart
