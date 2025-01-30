import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';

const Progress = () => {
    const [worksheets, setWorksheets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [filteredWorksheets, setFilteredWorksheets] = useState([]);

    // Get all worksheets
    useEffect(() => {
        const fetchWorksheets = async () => {
            try {
                const response = await fetch('https://work-sync-server-eight.vercel.app/worksheet');
                if (!response.ok) {
                    throw new Error('Failed to fetch worksheets');
                }
                const data = await response.json();
                setWorksheets(data);
                setFilteredWorksheets(data);

                // Extract unique employees
                const uniqueEmployees = [...new Set(data.map(entry => entry.email))];
                setEmployees(uniqueEmployees);
            } catch (error) {
                console.error('Error fetching worksheets:', error);
            }
        };
        fetchWorksheets();
    }, []);

    // Get all months for the dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Filter worksheets based on selected employee and month
    useEffect(() => {
        let filtered = [...worksheets];

        if (selectedEmployee) {
            filtered = filtered.filter(worksheet => worksheet.email === selectedEmployee);
        }

        if (selectedMonth) {
            filtered = filtered.filter(worksheet => {
                const worksheetMonth = new Date(worksheet.date).toLocaleString('default', { month: 'long' });
                return worksheetMonth === selectedMonth;
            });
        }

        setFilteredWorksheets(filtered);
    }, [selectedEmployee, selectedMonth, worksheets]);

    return (
        <div className="p-6 min-h-screen bg-orange-100 rounded-xl">
            <div className="max-w-7xl mx-auto pt-5 bg-orange-100">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-orange-100">Work Progress Tracker</h1>

                {/* Filter Controls */}
                <div className="flex gap-4 mb-6 bg-orange-100">
                    <select
                        className="w-full max-w-xs bg-white border border-gray-300 rounded-lg px-4 py-2"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="">All Employees</option>
                        {employees.map((email) => (
                            <option key={email} value={email}>{email}</option>
                        ))}
                    </select>

                    <select
                        className="w-full max-w-xs bg-white border border-gray-300 rounded-lg px-4 py-2"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">All Months</option>
                        {months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {/* Worksheets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-orange-100">
                    {filteredWorksheets.map((worksheet) => (
                        <div
                            key={worksheet._id}
                            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-500" />
                                <span className="font-medium text-gray-700">{worksheet.email}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600">
                                    {new Date(worksheet.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <span className="text-gray-600">{worksheet.hoursWorked} hours</span>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Work Description: <span className="text-gray-600">{worksheet.task}</span></h4>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredWorksheets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No work records found for the selected filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Progress;