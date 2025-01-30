import React from 'react';
import { Users, Trophy, Clock, Target } from 'lucide-react';
import aboutTeamImage from '../assets/about-team.gif';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="min-h-screen py-16">
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-16 bg-orange-50 rounded-xl py-8">
                <div className="text-center max-w-3xl mx-auto bg-orange-50">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 bg-orange-50">Our Journey in Transforming Workplace Management</h1>
                    <p className="text-lg text-gray-600 bg-orange-50">
                        At WorkSync, we believe in creating seamless connections between employees, HR professionals, and management to build stronger, more efficient workplaces.
                    </p>
                </div>
            </div>

            {/* Mission and Vision */}
            <div className="container mx-auto px-4 mb-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-orange-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-orange-100">Our Mission</h2>
                        <p className="text-gray-600 bg-orange-100">
                            To revolutionize workplace management by providing innovative solutions that empower organizations to nurture their most valuable asset - their people. We strive to create an environment where efficiency meets empathy.
                        </p>
                    </div>
                    <div className="bg-orange-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-orange-100">Our Vision</h2>
                        <p className="text-gray-600 bg-orange-100">
                            To be the leading force in workplace transformation, creating harmonious work environments where technology and human interaction complement each other perfectly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="text-black py-16 mb-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Users className="w-12 h-12 text-orange-600 bg-orange-100" />,
                                title: "People First",
                                description: "We believe in putting people at the heart of everything we do"
                            },
                            {
                                icon: <Trophy className="w-12 h-12 text-orange-600 bg-orange-100" />,
                                title: "Excellence",
                                description: "We strive for excellence in every service we provide"
                            },
                            {
                                icon: <Clock className="w-12 h-12 text-orange-600 bg-orange-100" />,
                                title: "Efficiency",
                                description: "We optimize processes to save your valuable time"
                            },
                            {
                                icon: <Target className="w-12 h-12 text-orange-600 bg-orange-100" />,
                                title: "Innovation",
                                description: "We continuously evolve to meet changing workplace needs"
                            }
                        ].map((value, index) => (
                            <div key={index} className="p-6 rounded-xl text-center bg-orange-100 hover:shadow-lg">
                                <div className="flex justify-center mb-4 bg-orange-100">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 bg-orange-100">{value.title}</h3>
                                <p className="text-gray-600 bg-orange-100">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="container mx-auto px-4 mb-16 text-black">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-center mb-8">Why Choose WorkSync?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <img
                                src={aboutTeamImage}
                                alt="Team collaboration"
                                className="rounded-xl w-full"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">✨ Comprehensive Solutions</h3>
                                <p className="text-gray-600">All-in-one platform for employee management, payroll, and HR operations.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">🔒 Secure & Reliable</h3>
                                <p className="text-gray-600">State-of-the-art security measures to protect your sensitive data.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">🚀 Continuous Innovation</h3>
                                <p className="text-gray-600">Regular updates and new features to meet evolving workplace needs.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">💪 Dedicated Support</h3>
                                <p className="text-gray-600">24/7 customer support to help you every step of the way.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="container mx-auto px-4 text-black">
                <div className="bg-orange-50 rounded-xl p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4 bg-orange-50">Ready to Transform Your Workplace?</h2>
                    <p className="text-gray-600 mb-8 bg-orange-50">Get in touch with us to learn how WorkSync can help your organization thrive.</p>
                    <Link to={'/contactUs'} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;