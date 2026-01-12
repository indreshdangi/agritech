"use client";
import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Plus, Trash2, Save } from 'lucide-react';
import { useGlobal } from '../context'; // Global Data use kar rahe hain
import Link from 'next/link';

export default function AdminPanel() {
  const { products, orders, addProduct, deleteProduct } = useGlobal();
  const [activeTab, setActiveTab] = useState("products");
  
  // New Product Form State
  const [newProd, setNewProd] = useState({ name: "", price: "", stock: "", image: "📦" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      id: Date.now(),
      ...newProd
    });
    setNewProd({ name: "", price: "", stock: "", image: "📦" }); // Reset form
    alert("Product Added Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-green-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">⚙️ Admin</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-3 w-full p-3 rounded transition ${activeTab === "products" ? "bg-green-700" : "hover:bg-green-800"}`}>
            <Package size={20} /> Manage Products
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 w-full p-3 rounded transition ${activeTab === "orders" ? "bg-green-700" : "hover:bg-green-800"}`}>
            <ShoppingBag size={20} /> Customer Orders
          </button>
          <Link href="/" className="flex items-center gap-3 w-full p-3 rounded hover:bg-green-800 mt-10 border-t border-green-700">
            ⬅ Back to Website
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Inventory ({products.length})</h1>
            
            {/* ADD PRODUCT FORM */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-green-100">
              <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                <Plus className="w-5 h-5"/> Add New Item
              </h3>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input required placeholder="Item Name (e.g. Aloo)" className="p-2 border rounded" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                <input required placeholder="Price (e.g. 20)" type="number" className="p-2 border rounded" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
                <input required placeholder="Stock (e.g. 100 kg)" className="p-2 border rounded" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} />
                <select className="p-2 border rounded" value={newProd.image} onChange={e => setNewProd({...newProd, image: e.target.value})}>
                  <option value="📦">Select Icon</option>
                  <option value="🌾">Wheat</option>
                  <option value="🍚">Rice</option>
                  <option value="🥔">Potato</option>
                  <option value="🍅">Tomato</option>
                  <option value="🌶️">Chilli</option>
                  <option value="🍯">Honey</option>
                  <option value="🥛">Milk</option>
                </select>
                <button type="submit" className="bg-green-600 text-white font-bold rounded hover:bg-green-700 flex items-center justify-center gap-2">
                  <Save size={18}/> Save
                </button>
              </form>
            </div>

            {/* PRODUCT LIST */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-2xl">{p.image}</td>
                      <td className="p-4 font-bold text-gray-800">{p.name}</td>
                      <td className="p-4 text-green-600 font-bold">₹{p.price}</td>
                      <td className="p-4 text-sm bg-gray-100 rounded inline-block m-2 px-2">{p.stock}</td>
                      <td className="p-4">
                        <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 p-2 rounded hover:bg-red-500 hover:text-white transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Orders ({orders.length})</h1>
            <div className="space-y-4">
              {orders.length === 0 ? <p className="text-gray-400">No orders yet.</p> : orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center border-l-4 border-blue-500">
                  <div>
                    <h3 className="font-bold text-lg">{order.customer}</h3>
                    <p className="text-sm text-gray-500 mb-2">{order.date}</p>
                    <p className="text-gray-700 bg-gray-50 p-2 rounded text-sm">Items: <b>{order.items}</b></p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">₹{order.total}</p>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">PENDING</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}