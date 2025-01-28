import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { AuthContext } from '../components/Auth/AuthProvider';
import { useContext } from 'react';

const ContactUS = () => {
    const { userDetails } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        heading: '',
        designation: 'employee',
        details: '',
        email: userDetails.email
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/submit-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    submittedAt: new Date()
                })
            });

            if (!response.ok) throw new Error('Failed to submit query');

            toast.success('Query submitted successfully!');
            setFormData({
                heading: '',
                designation: 'employee',
                details: ''
            });
        } catch (error) {
            toast.error('Failed to submit query');
            console.error('Error submitting query:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-orange-100 rounded-xl py-12 px-4 mt-10 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-orange-100">
                <div className="text-center mb-12 bg-orange-100">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-orange-100">Contact Us</h1>
                    <p className="text-lg text-gray-600 bg-orange-100">Get in touch with our support team</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-orange-100">
                    {/* Company Info Section */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6">Company Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <MapPin className="h-6 w-6 text-orange-600" />
                                <div>
                                    <h3 className="font-medium">Address</h3>
                                    <p className="text-gray-600">123 Business Avenue</p>
                                    <p className="text-gray-600">Tech District, Innovation City 12345</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Phone className="h-6 w-6 text-orange-600" />
                                <div>
                                    <h3 className="font-medium">Phone</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Mail className="h-6 w-6 text-orange-600" />
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-gray-600">support@worksync.com</p>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-orange-50 rounded-lg">
                                <h3 className="font-semibold mb-2 bg-orange-50 ">About WorkSync</h3>
                                <p className="text-gray-600 bg-orange-50 ">
                                    WorkSync is a leading HR management solution provider, helping businesses streamline their workforce operations since 2020. We specialize in employee management, payroll processing, and HR automation solutions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6">Submit a Query</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Query Heading
                                </label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Brief subject of your query"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Designation
                                </label>
                                <select
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="employee">Employee</option>
                                    <option value="hr">HR</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Query Details
                                </label>
                                <textarea
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Please provide detailed information about your query"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                <>
                                    Submit Query
                                </>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUS;