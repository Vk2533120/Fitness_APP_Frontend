import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">FitnessHub</h3>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link to="/about" className="text-gray-300 hover:text-white transition duration-200 text-sm">About Us</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition duration-200 text-sm">Contact</Link>
          <Link to="/privacy" className="text-gray-300 hover:text-white transition duration-200 text-sm">Privacy Policy</Link>
        </div>

        <div className="text-gray-400 text-sm">
          Follow us on:
          <div className="flex justify-center md:justify-start space-x-3 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
              <i className="fab fa-facebook-f"></i> {/* Requires Font Awesome if you want icons */}
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
              <i className="fab fa-twitter"></i>
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
              <i className="fab fa-instagram"></i>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;