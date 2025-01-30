import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, Calendar, Trophy, ChartBar } from 'lucide-react';
import customerServiceGif from '../assets/customerServiceHelpGif.gif'
import { Link } from 'react-router-dom';

const Home = () => {
    const [topEmployee, setTopEmployee] = useState(null);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalQueries: 0
    });

    useEffect(() => {
        // Fetch total employees
        fetch('https://work-sync-server-eight.vercel.app/users')
            .then(res => res.json())
            .then(data => {
                setStats(prev => ({
                    ...prev,
                    totalEmployees: data.filter(user =>
                        user.userType === 'employee' && user.status !== 'fired'
                    ).length
                }));
            });

        // Fetch all queries for stats
        fetch('https://work-sync-server-eight.vercel.app/queries')
            .then(res => res.json())
            .then(data => {
                setStats(prev => ({
                    ...prev,
                    totalQueries: data.length
                }));
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                            Empowering Workplaces, <span className="text-orange-600">Connecting People</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Transform your workplace with our comprehensive HR management solution.
                            Streamline processes, enhance communication, and boost productivity.
                        </p>
                        <div className="flex gap-4">
                            <Link to={'/profile'} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2">
                                Profile <ArrowRight size={20} className="text-white bg-orange-600"/>
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <img
                            src={customerServiceGif}
                            alt="working online"
                            className="w-full rounded-2xl transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16 rounded-xl">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-all">
                            <Users className="w-12 h-12 text-orange-600 bg-orange-50 mb-4" />
                            <h3 className="text-2xl font-bold bg-orange-50 text-gray-800">{stats.totalEmployees}</h3>
                            <p className="text-gray-600 bg-orange-50">Active Employees</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-all">
                            <ChartBar className="w-12 h-12 text-orange-600 mb-4 bg-orange-50" />
                            <h3 className="text-2xl font-bold text-gray-800 bg-orange-50">{stats.totalQueries}</h3>
                            <p className="text-gray-600 bg-orange-50">Total Queries</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-all">
                            <Calendar className="w-12 h-12 text-orange-600 mb-4 bg-orange-50" />
                            <h3 className="text-2xl font-bold text-gray-800 bg-orange-50">24/7</h3>
                            <p className="text-gray-600 bg-orange-50">Support Available</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-all">
                            <Trophy className="w-12 h-12 text-orange-600 mb-4 bg-orange-50" />
                            <h3 className="text-2xl font-bold text-gray-800 bg-orange-50">98%</h3>
                            <p className="text-gray-600 bg-orange-50">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="text-black">
                <div className="container mx-auto px-4 py-16 bg-orange-50 rounded-xl">
                    <h2 className="text-3xl font-bold text-center mb-12 bg-orange-50">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-orange-50">
                        {[
                            {
                                title: "Employee Management",
                                description: "Comprehensive employee data management and tracking system",
                                icon: "👥"
                            },
                            {
                                title: "Payroll Processing",
                                description: "Automated salary calculations and payment processing",
                                icon: "💰"
                            },
                            {
                                title: "Query Resolution",
                                description: "Quick response system for employee queries and concerns",
                                icon: "❓"
                            }
                        ].map((service, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 bg-white text-black rounded-xl">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="p-6 rounded-xl hover:shadow-lg transition-all bg-orange-50">
                                <div className="flex gap-1 mb-4 bg-orange-50">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400 bg-orange-50" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4 bg-orange-50">
                                    "This platform has revolutionized how we manage our workforce. The efficiency and ease of use are remarkable!"
                                </p>
                                <div className="flex items-center gap-4 bg-orange-50">
                                    <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                                    <div>
                                        <h4 className="font-semibold bg-orange-50">John Doe</h4>
                                        <p className="text-sm text-gray-500 bg-orange-50">HR Manager</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Us Section */}
            <div className="py-16 bg-orange-50 text-black rounded-xl">
                <div className="container mx-auto px-4 bg-orange-50">
                    <div className="max-w-3xl mx-auto text-center bg-orange-50">
                        <h2 className="text-3xl font-bold mb-6 bg-orange-50">About WorkSync</h2>
                        <p className="text-gray-600 leading-relaxed mb-8 bg-orange-50">
                            WorkSync is more than just an HR management system - it's your partner in building a more efficient,
                            connected, and productive workplace. Our platform combines cutting-edge technology with user-friendly
                            design to streamline all your HR processes.
                        </p>
                        <Link to={'/about-us'} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all inline-flex items-center gap-2">
                            About Us <ArrowRight size={20} className="text-white bg-orange-600"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;