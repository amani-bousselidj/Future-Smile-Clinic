"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { FaTooth, FaBars, FaTimes, FaPhone, FaWhatsapp } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "من نحن", href: "/about" },
    { name: "خدماتنا", href: "/services" },
    { name: "معرض النتائج", href: "/gallery" },
    { name: "المقالات", href: "/blog" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:+213555123456"
              className="flex items-center gap-2 hover:text-primary-light transition"
            >
              <FaPhone className="text-xs" />
              <span>+213 555 123 456</span>
            </a>
            <a
              href="https://wa.me/213555123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-light transition"
            >
              <FaWhatsapp />
              <span>واتساب</span>
            </a>
          </div>
          <div>
            <span>contact@futuresmile.dz</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative group-hover:scale-110 transition-transform">
                <NextImage
                  src="/images/logo.png"
                  alt="Future Smile Clinic Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-animate">
                ابتسامة المستقبل
              </h1>
              <p className="text-xs text-gray-600">Future Smile Clinic</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary-light font-bold transition-colors relative group px-2 py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light to-primary-dark group-hover:w-full transition-all duration-300"></span>
                <span className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
              </Link>
            ))}
            <Link href="/appointment" className="btn-primary">
              احجز موعدك
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary-dark text-2xl"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-primary-light font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/appointment"
              className="block mt-4 text-center btn-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              احجز موعدك
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
