'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import "../globals.css";

export default function LuxuriousDatesLanding() {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    // Update oasis freshness timer
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900">
      <Head>
        <title>Date A Superfood | Premium Sun-Ripened Dates</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora&family=Montserrat&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav className="bg-emerald-900 bg-opacity-90 text-ivory py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-playfair text-gold">
          <span className="text-3xl">Date</span>
          <span className="text-ivory">A</span>
          <span className="text-xl font-montserrat tracking-widest ml-2">SUPERFOOD</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-ivory hover:text-gold transition-colors relative group">
            <span>Discover</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="text-ivory hover:text-gold transition-colors relative group">
            <span>Our Story</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="text-ivory hover:text-gold transition-colors relative group">
            <span>Collections</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="text-ivory hover:text-gold transition-colors relative group">
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all group-hover:w-full"></span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900 opacity-40 z-10"></div>
        <div className="bg-[url('/images/date-palms.jpg')] bg-cover bg-center absolute inset-0"></div>
        
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-playfair text-ivory mb-6">
            <span className="text-gold">Nature's</span> Luxurious Sweetness
          </h1>
          <p className="text-xl md:text-2xl text-ivory max-w-2xl mx-auto mb-8">
            Premium sun-ripened dates delivered fresh from the oasis to your table
          </p>
          <button className="bg-gold hover:bg-amber-600 text-emerald-900 font-bold py-3 px-8 rounded-sm transition-all transform hover:scale-105">
            Discover Opulence
          </button>
        </div>

        {/* Oasis Freshness Timer */}
        <div className="absolute bottom-8 right-8 z-20 bg-emerald-900 bg-opacity-70 text-ivory py-2 px-4 rounded">
          <div className="text-xs font-montserrat tracking-widest">OASIS FRESHNESS TIMER</div>
          <div className="font-montserrat text-gold">{currentTime}</div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-16 relative">
          <span className="relative inline-block">
            Our Collection
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gold transform -translate-y-2"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Royal Medjool", desc: "The crown jewel of dates", price: "$29" },
            { name: "Golden Zahidi", desc: "Sun-kissed golden perfection", price: "$26" },
            { name: "Black Diamond", desc: "Rare and intensely flavored", price: "$34" }
          ].map((date, index) => (
            <div key={index} className="bg-ivory rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 group">
              <div className="h-64 bg-[url('/images/date-variety.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gold bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-playfair text-emerald-900 mb-2">{date.name}</h3>
                <p className="text-emerald-700 mb-4">{date.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gold-dark">{date.price}</span>
                  <button className="text-emerald-900 hover:text-gold-dark transition-colors font-montserrat text-sm tracking-widest">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-ivory py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-playfair mb-4">Date A Superfood</h3>
            <p className="text-sm opacity-80">
              Bringing you the finest selection of sun-ripened dates from the heart of the oasis.
            </p>
          </div>
          <div>
            <h4 className="font-montserrat uppercase tracking-widest text-sm mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gold transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Recipes</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat uppercase tracking-widest text-sm mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gold transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat uppercase tracking-widest text-sm mb-4">Connect</h4>
            <div className="flex space-x-4">
              {['instagram', 'twitter', 'facebook'].map((social) => (
                <a key={social} href="#" className="hover:text-gold transition-colors">
                  <span className="sr-only">{social}</span>
                  {/* In a real app, you'd use actual icons here */}
                  <span className="text-lg">{social.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
            <div className="mt-6 text-xs opacity-70">
              <p>Certified Organic</p>
              <p>Fair Trade Certified</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-emerald-800 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} Date A Superfood. All rights reserved.</p>
          <p className="mt-2 italic">Curated with care by our Master Date Curator</p>
        </div>
      </footer>
    </div>
  );
};
