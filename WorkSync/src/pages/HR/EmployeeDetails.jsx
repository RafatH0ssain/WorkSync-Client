import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
    const { uid } = useParams();
    const [employee, setEmployee] = useState(null);
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                // Fetch employee details
                const employeeResponse = await fetch(`https://work-sync-server-eight.vercel.app/users/${uid}`);
                if (!employeeResponse.ok) throw new Error('Failed to fetch employee details');
                const employeeData = await employeeResponse.json();
                setEmployee(employeeData);
        
                // Fetch salary history
                const salaryResponse = await fetch(`https://work-sync-server-eight.vercel.app/payment-history/${employeeData.email}`); // Use employeeData.email for email
                if (!salaryResponse.ok) throw new Error('Failed to fetch salary history');
                const salaryData = await salaryResponse.json();
        
                // Ensure salaryData.payments is an array and set it to salaryHistory
                if (Array.isArray(salaryData.payments)) {
                    setSalaryHistory(salaryData.payments);
                } else {
                    toast.error('No salary history found');
                }
            } catch (error) {
                toast.error('Failed to fetch employee details');
            } finally {
                setLoading(false);
            }
        };        

        fetchEmployeeDetails();
    }, [uid]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="p-6 text-center text-red-600">
                Employee not found
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Employee Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={employee.photoURL || "/api/placeholder/96/96"}
                            alt={employee.name}
                            className="w-24 h-24 rounded-full"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-orange-600">{employee.name}</h2>
                            <p className="text-gray-600">{employee.designation || 'Employee'}</p>
                            <p className="text-gray-600">{employee.email}</p>
                        </div>
                    </div>
                </div>

                {/* Salary Chart */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">Salary History</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Salary ($)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: 15
                                    }}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="salary"
                                    fill="#ea580c"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;