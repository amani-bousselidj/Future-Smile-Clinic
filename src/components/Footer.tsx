/**
 * Footer Component
 */
'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">Future Smile Clinic</h3>
            <p className="text-sm">
              Professional dental care with modern technology and experienced doctors.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">General Dentistry</Link></li>
              <li><Link href="#" className="hover:text-white">Orthodontics</Link></li>
              <li><Link href="#" className="hover:text-white">Cosmetic Dentistry</Link></li>
              <li><Link href="#" className="hover:text-white">Implants</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Phone: +1 (555) 123-4567</li>
              <li>Email: info@futuresmileclinic.com</li>
              <li>Hours: Mon-Fri 9AM-6PM</li>
              <li>Saturday 10AM-4PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Future Smile Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
