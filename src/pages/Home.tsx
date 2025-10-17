import { Search, Hospital, Users, Award, Globe, Shield, Clock, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const features = [
        {
            icon: Hospital,
            title: 'World-Class Hospitals',
            description: 'Access to JCI & NABH accredited hospitals with state-of-the-art facilities',
        },
        {
            icon: Users,
            title: 'Expert Doctors',
            description: 'Highly qualified specialists with years of international experience',
        },
        {
            icon: Award,
            title: 'Quality Assurance',
            description: 'Verified treatments with proven success rates and patient satisfaction',
        },
        {
            icon: Globe,
            title: 'Global Network',
            description: 'Connect with top medical facilities across multiple countries',
        },
        {
            icon: Shield,
            title: 'Safe & Secure',
            description: 'Your medical data is protected with enterprise-grade security',
        },
        {
            icon: Clock,
            title: '24/7 Support',
            description: 'Round-the-clock assistance for all your medical travel needs',
        },
    ];

    const specialties = [
        'Cardiology',
        'Orthopedics',
        'Oncology',
        'Neurology',
        'Cosmetic Surgery',
        'Dental Care',
        'IVF & Fertility',
        'Eye Care',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Your Journey to Better Health Starts Here
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Connect with world-class hospitals and expert doctors for affordable, quality healthcare
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center">
                                <Search className="h-6 w-6 text-gray-400 ml-4" />
                                <input
                                    type="text"
                                    placeholder="Search for hospitals, doctors, or treatments..."
                                    className="flex-1 px-4 py-3 outline-none text-gray-900"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Link
                                    to={`/search?q=${searchQuery}`}
                                    className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
                                >
                                    Search
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/hospitals" className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
                                Find Hospitals
                            </Link>
                            <Link to="/doctors" className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
                                Find Doctors
                            </Link>
                            <Link to="/treatments" className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
                                Browse Treatments
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Why Choose MediTravel?</h2>
                        <p className="section-subtitle">
                            We make medical tourism simple, safe, and affordable
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="card text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                    <feature.icon className="h-8 w-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Popular Specialties</h2>
                        <p className="section-subtitle">
                            Find expert care across a wide range of medical specialties
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {specialties.map((specialty, index) => (
                            <Link
                                key={index}
                                to={`/search?specialty=${specialty}`}
                                className="card text-center hover:border-primary-500 border-2 border-transparent transition-all"
                            >
                                <HeartPulse className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900">{specialty}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Medical Journey?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of patients who have found quality healthcare through our platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started Free
                        </Link>
                        <Link to="/about" className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                            <div className="text-gray-600">Partner Hospitals</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">2000+</div>
                            <div className="text-gray-600">Expert Doctors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
                            <div className="text-gray-600">Happy Patients</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
