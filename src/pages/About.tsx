import { Heart, Users, Globe, Award, Shield, TrendingUp } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-sky-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Heart className="h-16 w-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About MediTravel</h1>
                        <p className="text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto">
                            Connecting patients with world-class healthcare facilities across the globe
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        To make quality healthcare accessible to everyone by connecting patients with the best medical facilities and specialists worldwide, ensuring affordable, transparent, and personalized care.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Globe className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Network</h3>
                        <p className="text-gray-600">
                            Access to top-rated hospitals and specialists across multiple countries
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                            <Award className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assured</h3>
                        <p className="text-gray-600">
                            All facilities are JCI and NABH accredited with verified credentials
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
                        <p className="text-gray-600">
                            Your medical data is protected with enterprise-grade security
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                            <Users className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
                        <p className="text-gray-600">
                            Dedicated support team to guide you through every step
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <TrendingUp className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cost Effective</h3>
                        <p className="text-gray-600">
                            Save up to 70% on medical procedures without compromising quality
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Care</h3>
                        <p className="text-gray-600">
                            Customized treatment plans tailored to your specific needs
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gradient-to-r from-sky-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-sky-100">Partner Hospitals</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">2000+</div>
                            <div className="text-sky-100">Specialist Doctors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-sky-100">Countries</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-sky-100">Happy Patients</div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 text-white rounded-full text-2xl font-bold mb-4">
                                1
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Inquiry</h3>
                            <p className="text-gray-600">
                                Share your medical condition and treatment preferences
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 text-white rounded-full text-2xl font-bold mb-4">
                                2
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Assessment</h3>
                            <p className="text-gray-600">
                                Receive expert medical assessment and recommendations
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 text-white rounded-full text-2xl font-bold mb-4">
                                3
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Treatment</h3>
                            <p className="text-gray-600">
                                Choose your preferred hospital and schedule your treatment
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 text-white rounded-full text-2xl font-bold mb-4">
                                4
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel & Heal</h3>
                            <p className="text-gray-600">
                                We handle everything from travel to post-treatment care
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of patients who have found quality healthcare through MediTravel
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/register" className="btn-primary text-lg px-8 py-3">
                            Get Started
                        </a>
                        <a href="/hospitals" className="btn-secondary text-lg px-8 py-3">
                            Browse Hospitals
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
