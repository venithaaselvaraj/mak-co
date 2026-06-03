import React, { createContext, useState, useContext, useEffect } from 'react';
import { toastCart, toastItemRemoved, toastCartCleared } from '../utils/toast.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) return [];
        try {
            const parsedCart = JSON.parse(savedCart);
            return parsedCart.filter(item => !item.id.includes('paired-'));
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        toastCart(product.name);
    };

    const removeFromCartOne = (productId) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem?.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            return prevCart.filter(item => item.id !== productId);
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const item = prevCart.find(i => i.id === productId);
            if (item) toastItemRemoved(item.name);
            return prevCart.filter(i => i.id !== productId);
        });
    };

    const clearCart = () => {
        setCart([]);
        toastCartCleared();
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeFromCartOne, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
