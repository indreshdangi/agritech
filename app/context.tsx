"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  price: string;
  stock: string;
  image: string;
};

type Order = {
  id: number;
  customer: string;
  items: string;
  total: number;
  status: string;
  date: string;
};

type GlobalContextType = {
  products: Product[];
  cart: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  placeOrder: (customerName: string, mobile: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  // --- INITIAL DATA (Agar database khali ho toh ye dikhega) ---
  const defaultProducts = [
    { id: 1, name: "Sharbati Wheat", price: "45", stock: "500 kg", image: "🌾" },
    { id: 2, name: "Basmati Rice", price: "90", stock: "200 kg", image: "🍚" },
    { id: 3, name: "Turmeric Powder", price: "250", stock: "50 kg", image: "🌶️" },
    { id: 4, name: "Desi Ghee", price: "900", stock: "40 L", image: "🍯" },
  ];

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // --- LOAD DATA (Jab website khule toh purana data yaad kare) ---
  useEffect(() => {
    const savedProducts = localStorage.getItem("ind_products");
    const savedCart = localStorage.getItem("ind_cart");
    const savedOrders = localStorage.getItem("ind_orders");

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // --- SAVE DATA (Jab bhi kuch badle toh save kare) ---
  useEffect(() => {
    localStorage.setItem("ind_products", JSON.stringify(products));
    localStorage.setItem("ind_cart", JSON.stringify(cart));
    localStorage.setItem("ind_orders", JSON.stringify(orders));
  }, [products, cart, orders]);

  // --- FUNCTIONS ---
  
  // 1. Admin Product Add karega
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  // 2. Admin Product Delete karega
  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // 3. Customer Cart me dalega
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    alert("Added to cart! 🛒");
  };

  // 4. Cart se remove karna
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 5. Order Place karna
  const placeOrder = (customerName: string, mobile: string) => {
    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);
    const itemNames = cart.map(i => i.name).join(", ");
    
    const newOrder: Order = {
      id: Date.now(),
      customer: `${customerName} (${mobile})`,
      items: itemNames,
      total: totalAmount,
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    setOrders([newOrder, ...orders]); // Order list me add karo
    setCart([]); // Cart khali karo
    alert("Order Placed Successfully! ✅");
  };

  return (
    <GlobalContext.Provider value={{ products, cart, orders, addProduct, deleteProduct, addToCart, removeFromCart, placeOrder }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
}