"use client";
import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Star, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useGlobal } from '../context';

export default function Shop() {
  const { products, cart, addToCart, removeFromCart, placeOrder } = useGlobal();
  const [isCartOpen, setCartOpen] = useState(false);
  
  // Checkout Form States
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(name, mobile);
    setShowCheckout(false);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* --- HEADER --- */}
      <div className="container mx-auto flex justify-between items-center mb-8 sticky top-0 bg-gray-50 z-10 py-4">
        <Link href="/" className="flex items-center gap-2 text-green-700 font-bold hover:underline">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        
        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => setCartOpen(!isCartOpen)}>
          <div className="bg-white p-3 rounded-full shadow-md border border-green-100 hover:bg-green-50 transition">
            <ShoppingCart className="w-6 h-6 text-green-800" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- CART SIDEBAR (Pop up) --- */}
      {isCartOpen && (
        <div className="absolute right-6 top-20 w-80 bg-white shadow-2xl rounded-xl p-5 z-50 border border-green-100 animate-in fade-in slide-in-from-top-5">
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <h3 className="font-bold text-lg text-gray-800">Your Cart ({cart.length})</h3>
            <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-red-500">✕</button>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20"/>
              <p>Jhola khali hai!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.image}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-green-700">₹{item.price}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && !showCheckout && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between font-bold text-gray-800 mb-4">
                <span>Total:</span>
                <span>₹{cart.reduce((sum, i) => sum + Number(i.price), 0)}</span>
              </div>
              <button onClick={() => setShowCheckout(true)} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold shadow-lg shadow-green-200">
                Buy Now
              </button>
            </div>
          )}

          {/* Checkout Form */}
          {showCheckout && (
            <form onSubmit={handleCheckout} className="mt-4 space-y-3 animate-in fade-in">
              <input 
                required 
                placeholder="Apna Naam Likhein" 
                className="w-full p-2 border rounded text-sm outline-green-500"
                value={name} onChange={(e) => setName(e.target.value)}
              />
              <input 
                required 
                placeholder="Mobile Number" 
                type="tel"
                className="w-full p-2 border rounded text-sm outline-green-500"
                value={mobile} onChange={(e) => setMobile(e.target.value)}
              />
              <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400">
                Confirm Order ✅
              </button>
            </form>
          )}
        </div>
      )}

      {/* --- PRODUCT GRID --- */}
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Organic Store 🌾</h1>
        <p className="text-gray-500 mb-8">Taaza aur Shuddh samaan, seedha kisan se.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="h-48 bg-green-50 rounded-xl flex items-center justify-center text-7xl mb-4 group-hover:scale-105 transition-transform">
                {item.image}
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">{item.name}</h2>
                  <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded">
                  <Star className="w-3 h-3 fill-current" /> 4.8
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-700">₹{item.price}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors shadow-lg shadow-gray-200"
                >
                  Add <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}