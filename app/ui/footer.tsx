"use client";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="flex items-center mt-3">
            <FaMapMarkerAlt className="mr-2" /> 123 Main Street, City, Country
          </p>
          <p className="flex items-center mt-2">
            <FaPhone className="mr-2" /> +1 (123) 456-7890
          </p>
          <p className="flex items-center mt-2">
            <FaEnvelope className="mr-2" /> contact@example.com
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-400">About</Link></li>
            <li><Link href="/services" className="hover:text-gray-400">Services</Link></li>
            <li><Link href="/contact" className="hover:text-gray-400">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h2 className="text-lg font-semibold">Follow Us</h2>
          <div className="flex space-x-4 mt-3">
            <Link href="https://facebook.com" target="_blank" className="hover:text-blue-500 text-xl"><FaFacebook /></Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-400 text-xl"><FaTwitter /></Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-blue-600 text-xl"><FaLinkedin /></Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500 text-xl"><FaInstagram /></Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center border-t border-gray-700 mt-8 pt-4 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
