import React from 'react';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">ROJGARSETU</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting skilled laborers with customers directly, eliminating middlemen and creating opportunities for everyone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">support@kaamconnect.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Delhi, Mumbai, Bangalore</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Laborers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Find Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Set Availability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manage Profile</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Earnings</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Laborers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manage Bookings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 KaamConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;