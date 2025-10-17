import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <Heart className="h-8 w-8 text-primary-400" />
                            <span className="text-2xl font-bold">MediTravel</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Your trusted partner for world-class medical care abroad.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-400">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/hospitals" className="text-gray-400 hover:text-white">Hospitals</Link></li>
                            <li><Link to="/doctors" className="text-gray-400 hover:text-white">Doctors</Link></li>
                            <li><Link to="/treatments" className="text-gray-400 hover:text-white">Treatments</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Medical Consultation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Treatment Planning</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Travel Assistance</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Post-Care Support</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary-400 mt-1" />
                                <span className="text-gray-400">123 Medical Plaza, Healthcare City</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-primary-400" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-primary-400" />
                                <span className="text-gray-400">info@meditravel.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} MediTravel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
