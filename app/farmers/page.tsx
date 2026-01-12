"use client";
import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Farmers() {
  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center justify-center">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-green-800 font-bold">
        <ArrowLeft className="w-5 h-5" /> Home
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Kisan Registration 👨‍🌾</h1>
        <p className="text-gray-500 mb-6">Apni fasal seedha customers ko bechein.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pura Naam</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ram Lal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="98765xxxxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gaon / Village</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          
          <button type="button" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition">
            Register Now
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-gray-800 mb-2">Benefits:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600"/> Sahi Daam (Best Price)</li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600"/> Turant Payment</li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600"/> Technical Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}