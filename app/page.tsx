"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, Menu, Search, User, ArrowRight, Leaf, Play, Sun, Moon, X, Heart, Star, LayoutDashboard, Package, ShoppingBag, Plus, Trash2, Phone, GraduationCap, TrendingUp, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
type Product = { id: number; name: string; price: string; stock: string; image: string; };
type Order = { id: number; customer: string; items: string; total: number; status: string; date: string; };
type Story = { id: number; name: string; loc: string; img: string; videoMsg?: string; };

type GlobalContextType = {
  products: Product[]; cart: Product[]; orders: Order[]; currentPage: string; isDark: boolean;
  toggleTheme: () => void; navigateTo: (page: string) => void; addProduct: (product: Product) => void;
  deleteProduct: (id: number) => void; addToCart: (product: Product) => void; removeFromCart: (id: number) => void;
  placeOrder: (customerName: string, mobile: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const defaultProducts = [
    { id: 1, name: "Sharbati Wheat", price: "45", stock: "500 kg", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400" },
    { id: 2, name: "Organic Honey", price: "600", stock: "50 L", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400" },
    { id: 3, name: "Kashmiri Chilli", price: "250", stock: "50 kg", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400" },
    { id: 4, name: "Basmati Rice", price: "90", stock: "200 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400" },
  ];
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const toggleTheme = () => setIsDark(!isDark);
  const navigateTo = (page: string) => { 
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setCurrentPage(page); 
  };
  const addProduct = (product: Product) => setProducts([...products, product]);
  const deleteProduct = (id: number) => setProducts(products.filter((p) => p.id !== id));
  const addToCart = (product: Product) => { setCart([...cart, product]); };
  const removeFromCart = (id: number) => setCart(cart.filter((item) => item.id !== id));
  const placeOrder = (customerName: string, mobile: string) => {
    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);
    const newOrder: Order = { id: Date.now(), customer: `${customerName} (${mobile})`, items: cart.map(i => i.name).join(", "), total: totalAmount, status: "Pending", date: new Date().toLocaleDateString() };
    setOrders([newOrder, ...orders]); setCart([]);
  };

  return (
    <GlobalContext.Provider value={{ products, cart, orders, currentPage, isDark, toggleTheme, navigateTo, addProduct, deleteProduct, addToCart, removeFromCart, placeOrder }}>
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </GlobalContext.Provider>
  );
}

const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
};

// Navbar
const Navbar = () => {
  const { cart, isDark, toggleTheme, navigateTo, currentPage } = useGlobal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 w-full h-1 z-[60] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || currentPage !== 'home' ? 'bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div onClick={() => navigateTo('home')} className="text-2xl font-bold flex items-center gap-2 cursor-pointer group">
            <div className="bg-gradient-to-br from-[#FF9933] to-[#138808] p-2 rounded-xl text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="tracking-tighter dark:text-white">IND<span className="text-[#FF9933]">Agri.</span></span>
          </div>

          <div className="hidden md:flex space-x-10 font-medium text-gray-700 dark:text-gray-300">
            {['Home', 'Shop', 'Farmers', 'Admin'].map((item) => (
              <button key={item} onClick={() => navigateTo(item.toLowerCase())} className={`relative hover:text-[#138808] dark:hover:text-[#FF9933] transition-colors ${currentPage === item.toLowerCase() ? 'text-[#138808] dark:text-[#FF9933]' : ''}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition transform hover:rotate-12">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button onClick={() => navigateTo('shop')} className="relative group">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
                <ShoppingCart className="w-5 h-5 text-[#138808] dark:text-[#FF9933]" />
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow-sm animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

// Home Page
const HomePage = () => {
  const { navigateTo } = useGlobal();
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050b14] transition-colors duration-500 font-sans text-gray-800 dark:text-gray-100 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[100vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
              src="https://images.unsplash.com/photo-1625246333195-551e5051d957?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-90 dark:opacity-60" 
              alt="Indian Farm"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        </div>
        
        {/* Animated Blobs (Tiranga Colors) */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF9933] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#138808] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"></div>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm font-bold mb-6">
              <span className="w-4 h-3 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-sm"></span>
              Proudly Made in India 🇮🇳
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6 drop-shadow-2xl">
              Mitti Ki Khushbu, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">
                Desh Ki Tarakki.
              </span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed font-medium">
              "Jai Jawan, Jai Kisan". Humara mission hai Bharat ke har kisan ko saksham banana aur har ghar tak shuddh anaaj pahunchana.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigateTo('shop')} className="bg-gradient-to-r from-[#FF9933] to-[#FF8000] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#FF9933]/50 flex items-center gap-2 transition-all transform hover:scale-105">
                Kharidari Karein <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigateTo('farmers')} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> Hamari Pahal
              </button>
            </div>
          </motion.div>

          {/* Floating Glass Card */}
          <div className="hidden md:block relative h-[500px]">
             <motion.div 
               animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-10 right-10 w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl z-20 shadow-2xl"
             >
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-14 h-14 rounded-full bg-[#138808] flex items-center justify-center text-3xl text-white shadow-lg">🌾</div>
                 <div>
                   <h4 className="font-bold text-white text-xl">Swadeshi Anaaj</h4>
                   <p className="text-xs text-gray-300">Seedha MP ke kheto se</p>
                 </div>
               </div>
               <div className="h-2 bg-gray-600/50 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full"></motion.div>
               </div>
               <p className="text-right text-xs text-white mt-2 font-bold">100% Quality Checked ✅</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* FOUNDERS SECTION */}
      <section className="py-20 bg-white dark:bg-[#0a0f18] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-30"></div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Visionaries of <span className="text-[#138808]">Green India</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">Ek soch jo kheti ko naya roop de rahi hai. Bhavishya ke Bharat ke liye ek nayi shuruwat.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            
            <motion.div whileHover={{ y: -10 }} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#138808]"></div>
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">👩‍🎓</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Kavita Dangi</h3>
              <p className="text-[#138808] font-bold text-sm uppercase tracking-wider mb-4">Agriculture Student</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"Kheti sirf vyapaar nahi, ye humari sanskriti hai. Mera lakshya hai scientific tarikon se kisan ki aamdani badhana."</p>
              <div className="mt-6 flex justify-center gap-3 opacity-50"><Leaf className="w-5 h-5 text-[#138808]" /><GraduationCap className="w-5 h-5 text-[#138808]" /></div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9933]"></div>
              <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">👨‍💻</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Indresh Dangi</h3>
              <p className="text-[#FF9933] font-bold text-sm uppercase tracking-wider mb-4">Founder & Visionary</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"Technology aur Mitti ka sangam hi naye Bharat ki pehchan hai. Hum gaon ko global market se jod rahe hain."</p>
              <div className="mt-6 flex justify-center gap-3 opacity-50"><TrendingUp className="w-5 h-5 text-[#FF9933]" /><Sprout className="w-5 h-5 text-[#FF9933]" /></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold dark:text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-[#FF9933]"></span>
          Humare Anndaata (Farmers) <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Stories</span>
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide px-2">
          {[{id:1, name:"Ramesh K.", loc:"Indore", img:"https://images.unsplash.com/photo-1595231712325-9fdec2e5dc81"}, {id:2, name:"Sunita D.", loc:"Punjab", img:"https://images.unsplash.com/photo-1627920769843-2d2112a20612"}, {id:3, name:"Vikram S.", loc:"Nashik", img:"https://images.unsplash.com/photo-1534791535718-d713c77d5440"}].map((story: any) => (
            <div key={story.id} className="flex flex-col items-center gap-3 cursor-pointer min-w-[100px] group" onClick={() => setActiveStory(story)}>
               <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#138808]">
                 <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden">
                   <img src={`${story.img}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                 </div>
                 <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white text-[10px]"><Play size={10} fill="currentColor"/></div>
               </div>
               <p className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">{story.name}<br/><span className="text-[10px] font-normal text-gray-500">{story.loc}</span></p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#050b14] text-white py-12 border-t-4 border-[#FF9933]">
         <div className="container mx-auto px-6 text-center">
            <div className="mb-6 flex justify-center items-center gap-2"><Sprout className="text-[#138808]" /> <span className="text-2xl font-bold">IND<span className="text-[#FF9933]">Agri.</span></span></div>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">"Jai Jawan, Jai Kisan, Jai Vigyan". <br/> Empowering Indian Agriculture through Innovation.</p>
            <div className="flex justify-center gap-8 text-sm text-gray-500 mb-8"><span>Founder: Indresh Dangi</span><span>•</span><span>Expertise: Kavita Dangi</span></div>
            <p className="text-xs text-gray-600">© 2026 IND Agritech Pvt Ltd. Made with ❤️ in India.</p>
         </div>
      </footer>

      <AnimatePresence>
        {activeStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveStory(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-gray-900 w-full max-w-sm h-[60vh] rounded-3xl overflow-hidden relative border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <img src={`${activeStory.img}?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
                 <h3 className="text-white font-bold text-xl mb-2">"Kheti mera junoon hai."</h3>
                 <p className="text-gray-300 text-sm mb-4">Main {activeStory.loc} se hoon aur organic kheti karta hoon.</p>
                 <button onClick={() => { setActiveStory(null); navigateTo('shop'); }} className="w-full bg-[#138808] text-white py-3 rounded-xl font-bold">Support This Farmer</button>
              </div>
              <button onClick={() => setActiveStory(null)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full"><X className="text-white" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Shop Page
const ShopPage = () => {
  const { products, addToCart, cart, removeFromCart, placeOrder } = useGlobal();
  const [isCartOpen, setCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1f0a] pt-28 pb-10 px-6 transition-colors duration-500">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Mandi Rates (Live) 🌾</h1>
        <p className="text-gray-500 mb-8">Seedha kisan ke ghar se, aapki rasoi tak.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
             <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -10 }} className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all group">
               <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                 <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-full z-10"><span className="w-4 h-3 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] block rounded-sm"></span></div>
                 <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
               </div>
               <h3 className="text-lg font-bold text-gray-800 dark:text-white">{product.name}</h3>
               <p className="text-xs text-[#138808] font-bold bg-green-100 inline-block px-2 py-1 rounded mt-1">Stock: {product.stock}</p>
               <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                 <span className="text-xl font-bold text-gray-800 dark:text-white">₹{product.price}</span>
                 <button onClick={() => addToCart(product)} className="bg-[#138808] text-white p-3 rounded-xl hover:bg-green-700 transition shadow-lg flex gap-2 items-center text-sm font-bold">Add <ShoppingCart size={16}/></button>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-[70] p-6 border-l dark:border-gray-800">
             <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold dark:text-white">Apna Jhola 🛍️</h2><button onClick={() => setCartOpen(false)}><X className="dark:text-white" /></button></div>
             {cart.length === 0 ? <p className="text-gray-500 text-center mt-10">Jhola khali hai!</p> : <div className="space-y-4 max-h-[60vh] overflow-y-auto">{cart.map((item, idx) => (<div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg"><div className="flex items-center gap-3"><img src={item.image} className="w-10 h-10 rounded-lg object-cover" /><div><p className="font-bold text-sm dark:text-white">{item.name}</p><p className="text-xs text-green-600">₹{item.price}</p></div></div><button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={16} /></button></div>))}</div>}
             {cart.length > 0 && <div className="mt-8 pt-4 border-t dark:border-gray-800"><div className="flex justify-between font-bold text-xl mb-6 dark:text-white"><span>Kul Yog (Total)</span><span>₹{cart.reduce((sum, i) => sum + Number(i.price), 0)}</span></div>{!checkoutMode ? <button onClick={() => setCheckoutMode(true)} className="w-full bg-[#FF9933] text-white py-3 rounded-xl font-bold hover:bg-orange-600">Order Karein</button> : <div className="space-y-3"><input placeholder="Aapka Naam" className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white" onChange={e => setFormData({...formData, name: e.target.value})} /><input placeholder="Mobile Number" className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white" onChange={e => setFormData({...formData, mobile: e.target.value})} /><button onClick={() => { placeOrder(formData.name, formData.mobile); setCartOpen(false); setCheckoutMode(false); alert('Dhanyawad! Order Confirm ho gaya. ✅'); }} className="w-full bg-[#138808] text-white py-3 rounded-xl font-bold">Confirm Order</button></div>}</div>}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setCartOpen(true)} className="fixed bottom-6 right-6 bg-[#FF9933] text-white p-4 rounded-full shadow-2xl z-40 animate-bounce"><ShoppingBag/></button>
    </div>
  );
};

// Farmers Page
const FarmersPage = () => {
  return (
    <div className="min-h-screen bg-green-50 dark:bg-[#0a1f0a] flex items-center justify-center p-6 pt-24">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-green-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
        <h1 className="text-3xl font-bold text-[#138808] dark:text-green-400 mb-2">Kisan Registration 👨‍🌾</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">"Desh ki neev mazboot karein."</p>
        <form className="space-y-4">
          <input className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" placeholder="Pura Naam" />
          <input className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" placeholder="Mobile Number" />
          <input className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" placeholder="Gaon / Zila" />
          <button type="button" className="w-full bg-[#138808] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition shadow-lg">Judiye Humare Saath</button>
        </form>
      </div>
    </div>
  );
};

// Admin Page
const AdminPage = () => {
  const { products, deleteProduct, navigateTo, addProduct } = useGlobal();
  const [newProd, setNewProd] = useState({ name: "", price: "", stock: "", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400" });
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] flex font-sans pt-20">
      <aside className="w-64 bg-[#138808] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">🇮🇳 Admin Panel</h2>
        <button onClick={() => navigateTo('home')} className="w-full text-left p-3 rounded bg-white/10 hover:bg-white/20">Back to Website</button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Product Inventory</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <input placeholder="Name" className="p-2 border rounded" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
             <input placeholder="Price" className="p-2 border rounded" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
             <input placeholder="Stock" className="p-2 border rounded" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} />
             <button onClick={() => { addProduct({ id: Date.now(), ...newProd }); alert('Added!'); }} className="bg-[#FF9933] text-white rounded font-bold">Add Item</button>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
          {products.map(p => (
            <div key={p.id} className="flex justify-between p-4 border-b dark:border-gray-700 items-center">
              <div className="flex items-center gap-4"><img src={p.image} className="w-10 h-10 rounded object-cover"/><span className="dark:text-white font-bold">{p.name}</span></div>
              <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- 4. MAIN LAYOUT ---
export default function App() {
  return (
    <GlobalProvider>
      <Navbar />
      <MainContent />
    </GlobalProvider>
  );
}

function MainContent() {
  const { currentPage } = useGlobal();
  return (
    <>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'shop' && <ShopPage />}
      {currentPage === 'farmers' && <FarmersPage />}
      {currentPage === 'admin' && <AdminPage />}
    </>
  );
}
